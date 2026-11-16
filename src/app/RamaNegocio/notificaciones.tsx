import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  Boton,
  Card,
  Pantalla,
  TABS_NEGOCIO,
  useIr,
} from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

import { fetchBusinessDashboardData } from '@/services/catalogos.service';
import * as businessMock from '@/services/mock/business';
import type { BusinessNotification } from '@/types';

export default function Notificaciones() {
  const { ir } = useIr();
  const [notifications, setNotifications] = useState<BusinessNotification[]>(
    businessMock.businessNotifications,
  );

  useEffect(() => {
    let active = true;
    fetchBusinessDashboardData().then((data) => {
      if (active) setNotifications(data.notifications);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Pantalla
      titulo="Notificaciones del negocio"
      subtitulo="Canjes y avisos importantes"
      tabs={TABS_NEGOCIO}
      activa="Cupones"
    >
      {notifications.map((n) => (
        <Card key={n.id}>
          <Text style={s.titulo}>{n.title}</Text>
          <Text style={s.detalle}>{n.body}</Text>
        </Card>
      ))}

      <Boton
        texto="Reportar un canje incorrecto"
        variante="borde"
        onPress={() => ir('/RamaNegocio/reportar', { motivo: 'Problema con cupón' })}
      />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '700', color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
});
