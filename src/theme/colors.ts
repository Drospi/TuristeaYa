/**
 * Paleta extraída del archivo de Figma (K4tEGFyk9oVZElp6W8H7SQ).
 * El prototipo no define estilos ni variables: los valores se
 * recopilaron de los rellenos y trazos reales de los nodos.
 */
export const colors = {
  /** Verde principal: títulos de pantalla, botones, enlaces. */
  primary: '#246b53',
  /** Verde profundo: acentos secundarios, indicador inferior. */
  primaryDeep: '#39795e',
  /** Texto principal (verde muy oscuro). */
  ink: '#243d35',
  /** Texto secundario: subtítulos, cuerpo de tarjetas. */
  inkSoft: '#61736a',
  /** Texto atenuado: placeholders de formularios. */
  inkMuted: '#596b63',
  /** Fondo de la aplicación. */
  background: '#f7faf8',
  /** Superficie de tarjetas e inputs. */
  surface: '#ffffff',
  /** Verde claro: píldora de tab activo, chips seleccionados. */
  surfaceGreen: '#e3efe7',
  /** Variantes de superficie verde usadas en esquemas y fotos. */
  surfaceGreenAlt: '#ddeee2',
  surfaceGreenSoft: '#eaf0e3',
  /** Crema: banners de avisos y patrocinados. */
  highlight: '#f7ebdd',
  /** Verde apagado: barras del gráfico. */
  greenSoft: '#83aa91',
  /** Bordes. */
  border: '#d7e3da',
  borderAlt: '#cad8d0',
  borderGreen: '#c7dace',
  borderSoft: '#d9e6de',
  borderHighlight: '#e6d8c6',
  borderCream: '#daccb9',
  /** Texto sobre botón primario. */
  onPrimary: '#ffffff',
} as const;

export type ColorToken = keyof typeof colors;
