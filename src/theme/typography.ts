import type { ColorToken } from './colors';

/** Familias cargadas con expo-font (@expo-google-fonts/inter). */
export const fontFamilies = {
  regular: 'Inter_400Regular',
  bold: 'Inter_700Bold',
} as const;

export type FontWeightToken = keyof typeof fontFamilies;

export type TextVariant = {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeightToken;
  color: ColorToken;
};

/**
 * Variantes tipográficas medidas en el Figma.
 * La app usa exclusivamente Inter en pesos 400 y 700.
 */
export const textVariants = {
  /** Título grande del selector (26/36). */
  display: { fontSize: 26, lineHeight: 36, fontWeight: 'regular', color: 'ink' } satisfies TextVariant,
  /** Título de pantalla (22/31, verde). */
  title: { fontSize: 22, lineHeight: 31, fontWeight: 'bold', color: 'primary' } satisfies TextVariant,
  /** Subtítulo bajo el título (12/17). */
  subtitle: { fontSize: 12, lineHeight: 17, fontWeight: 'regular', color: 'inkSoft' } satisfies TextVariant,
  /** Encabezado de sección / título de tarjeta (15/21). */
  section: { fontSize: 15, lineHeight: 21, fontWeight: 'bold', color: 'ink' } satisfies TextVariant,
  /** Cuerpo (14/20). */
  body: { fontSize: 14, lineHeight: 20, fontWeight: 'regular', color: 'ink' } satisfies TextVariant,
  /** Cuerpo de tarjeta (13/18). */
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: 'regular', color: 'inkSoft' } satisfies TextVariant,
  /** Etiqueta de formulario (12/17, negrita). */
  label: { fontSize: 12, lineHeight: 17, fontWeight: 'bold', color: 'ink' } satisfies TextVariant,
  /** Texto auxiliar (12/17). */
  caption: { fontSize: 12, lineHeight: 17, fontWeight: 'regular', color: 'ink' } satisfies TextVariant,
  /** Texto pequeño (11/15). */
  micro: { fontSize: 11, lineHeight: 15, fontWeight: 'regular', color: 'ink' } satisfies TextVariant,
  /** Etiquetas de gráfico (10/14). */
  tiny: { fontSize: 10, lineHeight: 14, fontWeight: 'regular', color: 'ink' } satisfies TextVariant,
  /** Acción / elemento de menú (14/20, verde). */
  action: { fontSize: 14, lineHeight: 20, fontWeight: 'bold', color: 'primary' } satisfies TextVariant,
  /** Texto de botón primario (14/20, blanco). */
  button: { fontSize: 14, lineHeight: 20, fontWeight: 'bold', color: 'onPrimary' } satisfies TextVariant,
  /** Glifo de retroceso "‹" (26/36). */
  back: { fontSize: 26, lineHeight: 36, fontWeight: 'regular', color: 'ink' } satisfies TextVariant,
} as const;

export type TextVariantName = keyof typeof textVariants;
