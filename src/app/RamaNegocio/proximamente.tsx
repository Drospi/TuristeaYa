import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Boton, Card, Pantalla, TABS_NEGOCIO, useIr } from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

import { fetchBusinessDashboardData } from '@/services/catalogos.service';
import type { Campaign } from '@/types';

export default function Proximamente() {
  const { ir } = useIr();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    let active = true;
    fetchBusinessDashboardData().then((data) => {
      if (active) setCampaigns(data.campaigns);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Pantalla
      titulo="Campañas"
      subtitulo="Promociones de tu negocio"
      tabs={TABS_NEGOCIO}
      activa="Campañas"
    >
      {campaigns.map((c) => (
        <Card key={c.id}>
          <Text style={s.titulo}>
            {c.title} · {c.state}
          </Text>
          <Text style={s.detalle}>
            {c.space} · {c.period}
          </Text>
          <Text style={s.detalle}>
            Bs {c.spent} / Bs {c.budget} · {c.views} vistas
          </Text>
        </Card>
      ))}
      <Boton
        texto="Administrar campañas"
        onPress={() => ir('/negocio/campanas')}
      />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '700', color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
});
