import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import {
  Boton,
  Campo,
  Card,
  Pantalla,
  TABS_USUARIO,
  useIr,
} from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

import {
  createRecord,
  getCurrentUserId,
  isUuid,
  listRecords,
} from '@/services/http';
import type { DbTicketMessage } from '@/types/database';

export default function Ayuda() {
  const { ir } = useIr();
  const {
    numero = '2050',
    motivo = 'Horario incorrecto',
    ticketId = '',
  } = useLocalSearchParams<{
    numero?: string;
    motivo?: string;
    ticketId?: string;
  }>();

  const [mensaje, setMensaje] = useState('');
  const [enviados, setEnviados] = useState<string[]>([]);

  useEffect(() => {
    if (!ticketId || !isUuid(ticketId)) return;
    let active = true;
    listRecords<DbTicketMessage>('ticket-messages', {
      limit: 30,
      filters: { ticket_id: ticketId },
    })
      .then((msgs) => {
        if (active && msgs.length) {
          setEnviados(msgs.map((m) => m.body));
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [ticketId]);

  const enviar = async () => {
    const text = mensaje.trim();
    if (!text) return;
    setEnviados((prev) => [...prev, text]);
    setMensaje('');
    if (ticketId && isUuid(ticketId)) {
      const senderId = await getCurrentUserId();
      if (senderId && isUuid(senderId)) {
        await createRecord<DbTicketMessage>('ticket-messages', {
          ticket_id: ticketId,
          sender_id: senderId,
          body: text,
        }).catch(() => undefined);
      }
    }
  };

  return (
    <Pantalla
      titulo="Ayuda y mis reportes"
      subtitulo="Seguimiento de tu solicitud"
      tabs={TABS_USUARIO}
      activa="Inicio"
    >
      <Card>
        <Text style={s.titulo}>Reporte #{numero}</Text>
        <Text style={s.detalle}>{motivo} · En revisión</Text>
      </Card>

      <Card>
        <Text style={s.titulo}>Soporte</Text>
        <Text style={s.detalle}>
          Recibimos tu reporte y consultaremos al negocio.
        </Text>
      </Card>

      {enviados.map((m, i) => (
        <Card key={i}>
          <Text style={s.titulo}>Tú</Text>
          <Text style={s.detalle}>{m}</Text>
        </Card>
      ))}

      <Campo
        label="Mensaje"
        value={mensaje}
        onChangeText={setMensaje}
        placeholder="¿Cuándo se actualizará el horario?"
      />

      <Boton texto="Enviar mensaje" onPress={() => void enviar()} />
      <Boton
        texto="Nuevo reporte"
        variante="borde"
        onPress={() => ir('/RamaNegocio/reportar')}
      />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '700', color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
});
