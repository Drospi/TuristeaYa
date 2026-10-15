import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../constants/negocioTheme';

/* ---------- Navegación ---------- */

export type Tab = { label: string; ruta?: string };

export const TABS_NEGOCIO: Tab[] = [
  { label: 'Resumen', ruta: '/RamaNegocio' },
  { label: 'Cupones', ruta: '/RamaNegocio/notificaciones' },
  { label: 'Campañas', ruta: '/RamaNegocio/proximamente' },
  { label: 'Mi local', ruta: '/RamaNegocio/datos' },
];

export const TABS_USUARIO: Tab[] = [
  { label: 'Inicio', ruta: '/explore' },
  { label: 'Mis rutas' },
  { label: 'Cupones' },
  { label: 'Perfil' },
];

export function useIr() {
  const router = useRouter();
  return {
    ir: (ruta: string, params?: Record<string, string>) =>
      router.push((params ? { pathname: ruta, params } : ruta) as any),
    volver: () =>
      router.canGoBack() ? router.back() : router.replace('/explore' as any),
  };
}

/* ---------- Pantalla base ---------- */

type PantallaProps = {
  titulo: string;
  subtitulo?: string;
  tabs: Tab[];
  activa: string;
  children: React.ReactNode;
};

export function Pantalla({ titulo, subtitulo, tabs, activa, children }: PantallaProps) {
  const insets = useSafeAreaInsets();
  const { ir, volver } = useIr();

  return (
    <KeyboardAvoidingView
      style={[s.pantalla, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.header}>
        <Pressable onPress={volver} hitSlop={12}>
          <Text style={s.flecha}>‹</Text>
        </Pressable>
        <Text style={s.titulo} numberOfLines={1}>
          {titulo}
        </Text>
      </View>
      {subtitulo ? <Text style={s.subtitulo}>{subtitulo}</Text> : null}

      <ScrollView
        contentContainerStyle={s.contenido}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <View style={[s.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {tabs.map((t) => {
          const activo = t.label === activa;
          return (
            <Pressable
              key={t.label}
              style={[s.tab, activo && s.tabActivo]}
              onPress={() => t.ruta && ir(t.ruta)}
            >
              <Text style={s.tabTexto}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </KeyboardAvoidingView>
  );
}

/* ---------- Piezas reutilizables ---------- */

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={s.card}>{children}</View>;
}

export function Boton({
  texto,
  onPress,
  variante = 'lleno',
}: {
  texto: string;
  onPress?: () => void;
  variante?: 'lleno' | 'borde';
}) {
  const lleno = variante === 'lleno';
  return (
    <Pressable
      onPress={onPress}
      style={[s.boton, lleno ? s.botonLleno : s.botonBorde]}
    >
      <Text style={[s.botonTexto, { color: lleno ? '#fff' : C.verde }]}>{texto}</Text>
    </Pressable>
  );
}

export function Campo({
  label,
  ...props
}: { label: string } & TextInputProps) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={C.gris}
        {...props}
        style={[s.input, props.multiline && { minHeight: 70, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Chip({
  texto,
  activo,
  onPress,
}: {
  texto: string;
  activo: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.chip, activo && s.chipActivo]}>
      <Text style={s.chipTexto}>{texto}</Text>
    </Pressable>
  );
}

export function Foto({ texto, onPress }: { texto: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.foto}>
      <Text style={s.fotoTexto}>{texto}</Text>
    </Pressable>
  );
}

/* ---------- Estilos ---------- */

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  flecha: { fontSize: 30, color: C.verde, marginTop: -4 },
  titulo: { fontSize: 22, fontWeight: '700', color: C.verde, flexShrink: 1 },
  subtitulo: {
    fontSize: 13,
    color: C.gris,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.borde,
  },
  contenido: { padding: 16, gap: 12 },

  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.borde,
    backgroundColor: C.fondo,
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  tabActivo: { backgroundColor: C.verdeClaro },
  tabTexto: { fontSize: 12, color: C.texto },

  card: {
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 12,
    padding: 14,
    backgroundColor: C.fondo,
    gap: 4,
  },

  boton: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  botonLleno: { backgroundColor: C.verde },
  botonBorde: { borderWidth: 1.5, borderColor: C.verde },
  botonTexto: { fontSize: 15, fontWeight: '700' },

  label: { fontSize: 13, fontWeight: '700', color: C.texto, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.texto,
    backgroundColor: C.fondo,
  },

  chip: {
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActivo: { backgroundColor: C.verdeClaro, borderColor: C.verde },
  chipTexto: { fontSize: 13, color: C.texto },

  foto: {
    backgroundColor: C.durazno,
    borderWidth: 1,
    borderColor: C.duraznoBorde,
    borderRadius: 12,
    height: 100,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fotoTexto: { fontSize: 13, color: C.gris },
});
