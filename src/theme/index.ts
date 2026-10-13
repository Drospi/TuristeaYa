export { colors, type ColorToken } from './colors';
export {
  fontFamilies,
  textVariants,
  type FontWeightToken,
  type TextVariant,
  type TextVariantName,
} from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, type RadiusToken } from './radius';

/** Tamaños de componentes medidos en el Figma. */
export const sizes = {
  /** Botón de ancho completo (46px). */
  buttonHeight: 46,
  /** Botón pequeño (31px). */
  buttonHeightSm: 31,
  /** Campo de formulario (42px). */
  inputHeight: 42,
  /** Alto visible de la barra de pestañas (sin inset inferior). */
  tabBarHeight: 58,
  /** Píldora del tab activo dentro de la barra. */
  tabPillHeight: 40,
} as const;

export const borderWidth = {
  hairline: 1,
} as const;

export const theme = { colors, fontFamilies, textVariants, spacing, radius, sizes, borderWidth };
