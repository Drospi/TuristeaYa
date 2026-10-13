import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, fontFamilies, radius, sizes, spacing, borderWidth } from '@/theme';

type FormFieldProps = Omit<TextInputProps, 'placeholderTextColor'> & {
  label: string;
};

/** Campo de formulario de Figma: etiqueta 12/17 bold, input 42 alto. */
export function FormField({ label, style, ...inputProps }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.inkMuted}
        onFocus={(event) => {
          setFocused(true);
          inputProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          inputProps.onBlur?.(event);
        }}
        style={[styles.input, focused && styles.inputFocused, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { alignSelf: 'stretch' },
  input: {
    height: sizes.inputHeight,
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderAlt,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  inputFocused: { borderColor: colors.primary },
});
