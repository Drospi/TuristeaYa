import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  Boton,
  Campo,
  Chip,
  Foto,
  Pantalla,
  TABS_USUARIO,
  useIr,
} from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

import { createRecord, getCurrentUserId } from '@/services/http';
import type { DbTicket } from '@/types/database';

const MOTIVOS = ['Horario incorrecto', 'Precio incorrecto', 'Problema con cupón', 'Otro'];

export default function Reportar() {
  const router = useRouter();
  const { ir } = useIr();
  const { motivo: motivoInicial } = useLocalSearchParams<{ motivo?: string }>();

  const [motivo, setMotivo] = useState(motivoInicial ?? MOTIVOS[0]);
  const [lugar, setLugar] = useState('Café del Patio');
  const [descripcion, setDescripcion] = useState('');

  const enviar = async () => {
    if (!descripcion.trim()) {
      Alert.alert('Falta información', 'Escribe una descripción del problema.');
      return;
    }
    let numero = String(2000 + (Date.now() % 1000));
    let ticketId = '';
    try {
      const userId = await getCurrentUserId();
      if (userId) {
        const created = await createRecord<DbTicket>('tickets', {
          user_id: userId,
          subject: `${motivo} · ${lugar.trim()}`,
          description: descripcion.trim(),
          kind: 'report',
          priority: 'medium',
          status: 'open',
        });
        numero = created.id.slice(0, 6);
        ticketId = created.id;
      }
    } catch {
      // Mantiene número local si no hay sesión activa
    }
    ir('/RamaNegocio/ayuda', { numero, motivo, ticketId });
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

      <Foto
        texto="+ Adjuntar una fotografía"
        onPress={() => Alert.alert('Fotografía', 'Aquí se abrirá la galería.')}
      />

      <Boton texto="Enviar reporte" onPress={() => void enviar()} />
      <Boton texto="Cancelar" variante="borde" onPress={() => router.back()} />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', color: C.texto },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
