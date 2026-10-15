import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pantalla,
  Campo,
  Chip,
  Foto,
  Boton,
  TABS_USUARIO,
  useIr,
} from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

const MOTIVOS = ['Horario incorrecto', 'Precio incorrecto', 'Problema con cupón', 'Otro'];

export default function Reportar() {
  const router = useRouter();
  const { ir } = useIr();
  const { motivo: motivoInicial } = useLocalSearchParams<{ motivo?: string }>();

  const [motivo, setMotivo] = useState(motivoInicial ?? MOTIVOS[0]);
  const [lugar, setLugar] = useState('Café del Patio');
  const [descripcion, setDescripcion] = useState('');

  const enviar = () => {
    if (!descripcion.trim()) {
      Alert.alert('Falta información', 'Escribe una descripción del problema.');
      return;
    }
    const numero = String(2000 + (Date.now() % 1000));
    ir('/RamaNegocio/ayuda', { numero, motivo });
  };

  return (
    <Pantalla
      titulo="Reportar un problema"
      subtitulo="Ayúdanos a mantener la información correcta"
      tabs={TABS_USUARIO}
      activa="Inicio"
    >
      <Text style={s.label}>Motivo</Text>
      <View style={s.chips}>
        {MOTIVOS.map((m) => (
          <Chip key={m} texto={m} activo={m === motivo} onPress={() => setMotivo(m)} />
        ))}
      </View>

      <Campo label="Lugar o ruta" value={lugar} onChangeText={setLugar} />
      <Campo
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Ej: El horario mostrado no coincide con el del local."
        multiline
      />

      <Foto texto="+ Adjuntar una fotografía" onPress={() => Alert.alert('Fotografía', 'Aquí se abrirá la galería.')} />

      <Boton texto="Enviar reporte" onPress={enviar} />
      <Boton texto="Cancelar" variante="borde" onPress={() => router.back()} />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', color: C.texto },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
