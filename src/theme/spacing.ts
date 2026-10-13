/**
 * Espaciados derivados del prototipo:
 * padding de contenido 20, separación entre elementos 12-13,
 * padding interior de tarjetas 12-16, secciones 24.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export type SpacingToken = keyof typeof spacing;
