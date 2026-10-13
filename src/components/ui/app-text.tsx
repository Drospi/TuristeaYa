import { Text, type TextProps } from 'react-native';

import {
  colors,
  fontFamilies,
  textVariants,
  type ColorToken,
  type TextVariantName,
} from '@/theme';

type AppTextProps = TextProps & {
  /** Variante tipográfica del sistema de diseño. */
  variant?: TextVariantName;
  /** Color que sobrescribe el de la variante. */
  color?: ColorToken;
};

/** Texto del sistema de diseño: aplica variante tipográfica de Figma. */
export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  const token = textVariants[variant];
  return (
    <Text
      style={[
        {
          fontFamily: fontFamilies[token.fontWeight],
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          color: colors[color ?? token.color],
        },
        style,
      ]}
      {...rest}
    />
  );
}
