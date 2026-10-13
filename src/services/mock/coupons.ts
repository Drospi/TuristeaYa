import type { Coupon } from '@/types';

/** Cupones de demostración (pantallas 19-21). */
export const coupons: Coupon[] = [
  {
    id: 'turistea20',
    title: '20% en tu primera bebida',
    placeName: 'Café del Patio',
    detail: 'Válido hasta el 30 de septiembre.',
    code: 'TURISTEA20',
    discountPct: 20,
    baseCost: 35,
    discountCost: 7,
    finalCost: 28,
    conditions:
      'Muestra este código antes de pagar.\nVálido una vez por cuenta.\nAplica a una bebida seleccionada.',
    state: 'disponible',
  },
  {
    id: 'almuerzo10',
    title: '10% en almuerzo',
    placeName: 'Restaurante del Centro',
    detail: 'Consumo mínimo Bs 50.',
    code: 'ALMUERZO10',
    discountPct: 10,
    baseCost: 50,
    discountCost: 5,
    finalCost: 45,
    conditions:
      'Muestra este código antes de pagar.\nVálido una vez por cuenta.\nAplica al almuerzo seleccionado.',
    state: 'usado',
  },
];
