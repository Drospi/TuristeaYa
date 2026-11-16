import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '@/components/Jose/BottomTabBar';
import { HeaderCupones } from '@/components/Jose/HeaderCupones';
import { EstadoCupon, TabsEstado } from '@/components/Jose/TabsEstado';
import { CuponItem, TarjetaCupon } from '@/components/Jose/TarjetaCupon';
import {
  fetchCouponsCatalog,
  redeemCouponById,
} from '@/services/cupones.service';
import type { Coupon } from '@/types';

export default function PantallaCupones() {
  const [estado, setEstado] = useState<EstadoCupon>('disponibles');
  const [catalog, setCatalog] = useState<Coupon[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [tabActual, setTabActual] = useState('Cupones');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadCoupons() {
    setLoading(true);
    try {
      const items = await fetchCouponsCatalog();
      setCatalog(items);
      if (items.length > 0 && !selectedId) {
        setSelectedId(items[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCoupons = catalog.filter((c) =>
    estado === 'disponibles' ? c.state === 'disponible' : c.state === 'usado',
  );

  const selectedCoupon =
    filteredCoupons.find((c) => c.id === selectedId) ?? filteredCoupons[0];

  const handleRedeem = async () => {
    if (!selectedCoupon || selectedCoupon.state === 'usado' || redeeming) return;
    setRedeeming(true);
    setFeedback(null);
    try {
      const result = await redeemCouponById(selectedCoupon);
      setCatalog((prev) =>
        prev.map((item) =>
          item.id === selectedCoupon.id ? { ...item, state: 'usado' } : item,
        ),
      );
      setFeedback(
        `Cupón ${result.code} canjeado con éxito. Ahorraste Bs ${result.savings}.`,
      );
    } catch {
      setFeedback('No se pudo procesar el canje en este momento.');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <HeaderCupones
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/turista'))}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <TabsEstado filtroActivo={estado} alCambiar={setEstado} />

        {loading ? (
          <Text style={styles.footerNote}>Sincronizando cupones disponibles…</Text>
        ) : null}

        {feedback ? (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}

        {filteredCoupons.map((item) => {
          const cuponItem: CuponItem = {
            id: item.id,
            titulo: item.title,
            local: item.placeName,
            condicion: item.detail,
            seleccionado: selectedCoupon?.id === item.id,
          };
          return (
            <TarjetaCupon
              key={item.id}
              cupon={cuponItem}
              onPress={() => setSelectedId(item.id)}
            />
          );
        })}

        {!loading && filteredCoupons.length === 0 ? (
          <Text style={styles.footerNote}>
            {estado === 'disponibles'
              ? 'No tienes cupones disponibles por ahora.'
              : 'Aún no has canjeado ningún cupón.'}
          </Text>
        ) : null}

        {selectedCoupon ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailHeader}>Detalle del cupón seleccionado</Text>
            <Text style={styles.detailTitle}>
              {selectedCoupon.title} · {selectedCoupon.placeName}
            </Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>Código para mostrar en caja</Text>
              <Text style={styles.codeValue}>{selectedCoupon.code}</Text>
            </View>
            <Text style={styles.detailRow}>
              Consumo referencial: Bs {selectedCoupon.baseCost} · Descuento ({selectedCoupon.discountPct}%): -Bs {selectedCoupon.discountCost} · Total estimado: Bs {selectedCoupon.finalCost}
            </Text>
            <Text style={styles.conditionsText}>{selectedCoupon.conditions}</Text>

            {selectedCoupon.state === 'disponible' ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.redeemButton, redeeming && styles.redeemButtonDisabled]}
                disabled={redeeming}
                onPress={handleRedeem}
              >
                <Text style={styles.redeemButtonText}>
                  {redeeming ? 'Confirmando canje...' : 'Confirmar y canjear cupón'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.usedBadge}>
                <Text style={styles.usedBadgeText}>✓ Cupón ya utilizado</Text>
              </View>
            )}
          </View>
        ) : null}

        <Text style={styles.footerNote}>
          Revisa las condiciones antes de confirmar el canje.
        </Text>
      </ScrollView>

      <BottomTabBar tabActiva={tabActual} onSelectTab={setTabActual} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  feedbackBanner: {
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#dceee3',
    borderWidth: 1,
    borderColor: '#c6dfcf',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#164e3f',
  },
  detailCard: {
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8faf9',
    borderWidth: 1,
    borderColor: '#dceee3',
  },
  detailHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52665e',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#164e3f',
    marginBottom: 10,
  },
  codeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#c6dfcf',
    marginBottom: 10,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#164e3f',
    letterSpacing: 1.2,
  },
  detailRow: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 8,
    lineHeight: 18,
  },
  conditionsText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  redeemButton: {
    backgroundColor: '#164e3f',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    opacity: 0.6,
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  usedBadge: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  usedBadgeText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  footerNote: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
