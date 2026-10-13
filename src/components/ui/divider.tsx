import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, borderWidth } from '@/theme';

/** Línea divisoria bajo el encabezado (1px #d9e6de). */
export function Divider({ style, ...rest }: ViewProps) {
  return <View style={[styles.line, style]} {...rest} />;
}

const styles = StyleSheet.create({
  line: {
    height: borderWidth.hairline,
    backgroundColor: colors.borderSoft,
    alignSelf: 'stretch',
  },
});
