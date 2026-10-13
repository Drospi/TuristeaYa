export type CouponState = 'disponible' | 'usado';

/** Cupón de descuento (pantallas 19-21). */
export interface Coupon {
  id: string;
  title: string;
  placeName: string;
  detail: string;
  code: string;
  discountPct: number;
  baseCost: number;
  discountCost: number;
  finalCost: number;
  conditions: string;
  state: CouponState;
}
