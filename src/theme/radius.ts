/** Radios medidos: chips 3, tarjetas/botones/inputs 8, especial 12. */
export const radius = {
  sm: 3,
  md: 8,
  lg: 12,
} as const;

export type RadiusToken = keyof typeof radius;
