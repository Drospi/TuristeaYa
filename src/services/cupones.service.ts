import {
  createRecord,
  deleteRecord,
  ensureSessionLoaded,
  generateUuid,
  getRecord,
  httpRequest,
  isUuid,
  listRecords,
  updateRecord,
  type ListQueryOptions,
} from './http';
import type {
  DbBusiness,
  DbCouponRedemption,
  DbExperience,
  DbPlace,
  DbPromotion,
  DbReservation,
  RedeemCouponRequestPayload,
} from '@/types/database';
import type {
  BenefitHistoryEntry,
  Coupon,
  Promotion,
  PromotionState,
} from '@/types';
import { coupons as fallbackCoupons } from './mock/coupons';
import { promotions as fallbackPromotions } from './mock/business';
import { benefitHistory as fallbackBenefitHistory } from './mock/vip';

// ============================================================================
// CRUD de Promociones (/api/v1/promotions)
// ============================================================================

export function listPromotions(options?: ListQueryOptions): Promise<DbPromotion[]> {
  return listRecords<DbPromotion>('promotions', options);
}

export function getPromotion(id: string): Promise<DbPromotion> {
  return getRecord<DbPromotion>('promotions', id);
}

export function createPromotion(payload: Partial<DbPromotion>): Promise<DbPromotion> {
  return createRecord<DbPromotion>('promotions', payload as Record<string, unknown>);
}

export function updatePromotion(
  id: string,
  payload: Partial<DbPromotion>,
): Promise<DbPromotion> {
  return updateRecord<DbPromotion>('promotions', id, payload as Record<string, unknown>);
}

export function deletePromotion(id: string): Promise<void> {
  return deleteRecord('promotions', id);
}

// ============================================================================
// CRUD de Canjes de Cupones (/api/v1/coupon-redemptions)
// ============================================================================

export function listCouponRedemptions(
  options?: ListQueryOptions,
): Promise<DbCouponRedemption[]> {
  return listRecords<DbCouponRedemption>('coupon-redemptions', options);
}

export function getCouponRedemption(id: string): Promise<DbCouponRedemption> {
  return getRecord<DbCouponRedemption>('coupon-redemptions', id);
}

export function createCouponRedemption(
  payload: Partial<DbCouponRedemption>,
): Promise<DbCouponRedemption> {
  return createRecord<DbCouponRedemption>(
    'coupon-redemptions',
    payload as Record<string, unknown>,
  );
}

// ============================================================================
// Acción RPC de Canje (/api/v1/promotions/{promotion_id}/redeem)
// ============================================================================

export async function redeemPromotion(
  promotionId: string,
  purchaseAmount: number,
  requestKey: string = generateUuid(),
): Promise<unknown> {
  const payload: RedeemCouponRequestPayload = {
    request_key: requestKey,
    purchase_amount: Number(purchaseAmount) > 0 ? Number(purchaseAmount) : 50,
  };
  return httpRequest(`/promotions/${encodeURIComponent(promotionId)}/redeem`, {
    method: 'POST',
    body: payload,
    authenticated: true,
  });
}

// ============================================================================
// Mapeadores y Operaciones de Dominio (Turista, Negocio y VIP)
// ============================================================================

export async function fetchCouponsCatalog(): Promise<Coupon[]> {
  try {
    const session = await ensureSessionLoaded();
    const userId = session?.userId && isUuid(session.userId) ? session.userId : undefined;

    const [promotions, redemptions, places] = await Promise.all([
      listPromotions({ limit: 100 }),
      listCouponRedemptions({
        limit: 100,
        filters: userId ? { user_id: userId } : undefined,
      }).catch(() => [] as DbCouponRedemption[]),
      listRecords<DbPlace>('places', { limit: 100 }).catch(() => [] as DbPlace[]),
    ]);

    if (!promotions.length) return fallbackCoupons;

    const placeNameMap = new Map(places.map((p) => [p.id, p.name]));
    const redeemedPromotionIds = new Set(redemptions.map((r) => r.promotion_id));

    return promotions.map((promo) => {
      const pct = Math.max(1, Math.min(100, Number(promo.discount_percent ?? 15)));
      const baseCost = 50;
      const discountCost = Math.round((baseCost * pct) / 100);
      const finalCost = Math.max(0, baseCost - discountCost);
      const endsLabel = promo.ends_at
        ? `Válido hasta ${new Date(promo.ends_at).toLocaleDateString('es-BO')}.`
        : 'Válido en horario de atención.';
      return {
        id: promo.id,
        title: promo.title,
        placeName: placeNameMap.get(promo.place_id) ?? 'Comercio afiliado La Paz',
        detail: endsLabel,
        code: promo.code || 'TURISTEA',
        discountPct: pct,
        baseCost,
        discountCost,
        finalCost,
        conditions:
          promo.conditions ||
          'Muestra este código antes de pagar.\nVálido según disponibilidad del comercio.',
        state:
          redeemedPromotionIds.has(promo.id) || promo.status === 'expired'
            ? 'usado'
            : 'disponible',
      };
    });
  } catch {
    return fallbackCoupons;
  }
}

export async function fetchCouponById(id: string): Promise<Coupon | undefined> {
  const catalog = await fetchCouponsCatalog();
  return catalog.find((item) => item.id === id || item.code.toLowerCase() === id.toLowerCase());
}

export async function redeemCouponById(
  coupon: Coupon,
  purchaseAmount?: number,
): Promise<{ code: string; savings: number; redeemedAt: string }> {
  const amount = purchaseAmount ?? coupon.baseCost ?? 50;
  const savings = Math.round((amount * coupon.discountPct) / 100);
  const nowIso = new Date().toISOString();

  if (isUuid(coupon.id)) {
    try {
      await redeemPromotion(coupon.id, amount);
      return { code: coupon.code, savings, redeemedAt: nowIso };
    } catch {
      const session = await ensureSessionLoaded();
      const userId = session?.userId && isUuid(session.userId) ? session.userId : null;
      if (userId) {
        await createCouponRedemption({
          user_id: userId,
          promotion_id: coupon.id,
          idempotency_key: generateUuid(),
          savings,
          redeemed_at: nowIso,
        }).catch(() => undefined);
      }
    }
  }

  return { code: coupon.code, savings, redeemedAt: nowIso };
}

export async function fetchBusinessPromotions(): Promise<Promotion[]> {
  try {
    const [promotions, redemptions] = await Promise.all([
      listPromotions({ limit: 100 }),
      listCouponRedemptions({ limit: 100 }).catch(() => [] as DbCouponRedemption[]),
    ]);

    if (!promotions.length) return fallbackPromotions;

    const countByPromo = new Map<string, number>();
    for (const r of redemptions) {
      countByPromo.set(r.promotion_id, (countByPromo.get(r.promotion_id) ?? 0) + 1);
    }

    return promotions.map((promo) => {
      const state: PromotionState =
        promo.status === 'active' || promo.status === 'Activa' ? 'Activa' : 'Programada';
      const validity = promo.ends_at
        ? `Hasta ${new Date(promo.ends_at).toLocaleDateString('es-BO')}`
        : 'Vigencia mensual';
      return {
        id: promo.id,
        title: promo.title,
        state,
        redemptions: countByPromo.get(promo.id) ?? 0,
        validity,
        discountPct: Number(promo.discount_percent ?? 15),
        code: promo.code,
        usageLimit: `${promo.max_redemptions ?? 100} canjes (${promo.per_user_limit ?? 1} por cuenta)`,
        conditions: promo.conditions || 'Presentar código antes del pago.',
      };
    });
  } catch {
    return fallbackPromotions;
  }
}

export async function createBusinessPromotion(params: {
  title: string;
  code: string;
  discountPct: number;
  maxRedemptions?: number;
  conditions?: string;
}): Promise<Promotion> {
  const [businesses, places] = await Promise.all([
    listRecords<DbBusiness>('businesses', { limit: 10 }).catch(() => [] as DbBusiness[]),
    listRecords<DbPlace>('places', { limit: 10 }).catch(() => [] as DbPlace[]),
  ]);

  const businessId = businesses[0]?.id ?? generateUuid();
  const placeId = places[0]?.id ?? generateUuid();
  const now = new Date();
  const ends = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const created = await createPromotion({
    business_id: businessId,
    place_id: placeId,
    title: params.title.trim(),
    code: params.code.trim().toUpperCase(),
    discount_percent: Number(params.discountPct) || 15,
    starts_at: now.toISOString(),
    ends_at: ends.toISOString(),
    max_redemptions: Number(params.maxRedemptions) || 100,
    per_user_limit: 1,
    conditions:
      params.conditions?.trim() || 'Muestra este código antes de pagar en el local.',
    status: 'active',
  });

  return {
    id: created.id,
    title: created.title,
    state: 'Activa',
    redemptions: 0,
    validity: `Hasta ${new Date(created.ends_at).toLocaleDateString('es-BO')}`,
    discountPct: created.discount_percent,
    code: created.code,
    usageLimit: `${created.max_redemptions} canjes (${created.per_user_limit} por cuenta)`,
    conditions: created.conditions,
  };
}

export async function toggleBusinessPromotionStatus(
  id: string,
  currentState: PromotionState,
): Promise<PromotionState> {
  const nextState: PromotionState = currentState === 'Activa' ? 'Programada' : 'Activa';
  if (isUuid(id)) {
    await updatePromotion(id, {
      status: nextState === 'Activa' ? 'active' : 'scheduled',
    });
  }
  return nextState;
}

export async function fetchVipBenefitHistory(): Promise<BenefitHistoryEntry[]> {
  try {
    const session = await ensureSessionLoaded();
    const userId = session?.userId && isUuid(session.userId) ? session.userId : undefined;

    const [redemptions, promotions, reservations, experiences] = await Promise.all([
      listCouponRedemptions({
        limit: 50,
        filters: userId ? { user_id: userId } : undefined,
      }).catch(() => [] as DbCouponRedemption[]),
      listPromotions({ limit: 100 }).catch(() => [] as DbPromotion[]),
      listRecords<DbReservation>('reservations', {
        limit: 50,
        filters: userId ? { user_id: userId } : undefined,
      }).catch(() => [] as DbReservation[]),
      listRecords<DbExperience>('experiences', { limit: 100 }).catch(
        () => [] as DbExperience[],
      ),
    ]);

    const promoMap = new Map(promotions.map((p) => [p.id, p]));
    const expMap = new Map(experiences.map((e) => [e.id, e]));

    const entries: BenefitHistoryEntry[] = [];

    for (const r of redemptions) {
      const promo = promoMap.get(r.promotion_id);
      entries.push({
        id: r.id,
        title: promo ? `Cupón: ${promo.title}` : `Cupón canjeado`,
        detail: `Ahorro Bs ${r.savings ?? 0} · Código ${promo?.code ?? 'VIP'}`,
        usedLabel: r.redeemed_at
          ? new Date(r.redeemed_at).toLocaleDateString('es-BO')
          : 'Reciente',
      });
    }

    for (const res of reservations) {
      const exp = expMap.get(res.experience_id);
      entries.push({
        id: res.id,
        title: exp ? `Reserva VIP: ${exp.title}` : 'Reserva de experiencia VIP',
        detail: `${res.participants} ${res.participants === 1 ? 'persona' : 'personas'} · Total Bs ${res.total}`,
        usedLabel: res.created_at
          ? new Date(res.created_at).toLocaleDateString('es-BO')
          : 'Confirmada',
      });
    }

    return entries.length > 0 ? entries : fallbackBenefitHistory;
  } catch {
    return fallbackBenefitHistory;
  }
}
