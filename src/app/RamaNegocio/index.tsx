import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
import type { BusinessProfile, BusinessStats } from '@/types';

export default function Resumen() {
  const { ir } = useIr();
  const [profile, setProfile] = useState<BusinessProfile>(businessMock.businessProfile);
  const [stats, setStats] = useState<BusinessStats>(businessMock.businessStats);

  useEffect(() => {
    let active = true;
    fetchBusinessDashboardData().then((data) => {
      if (!active) return;
      setProfile(data.profile);
      setStats(data.stats);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Pantalla
      titulo="Mi negocio"
      subtitulo={`${profile.name} · Últimos 7 días`}
      tabs={TABS_NEGOCIO}
      activa="Resumen"
    >
      <Card>
        <Text style={s.cardTitulo}>Resumen</Text>
        <Text style={s.dato}>
          {stats.views} vistas · {stats.localVisits} visitas al local
        </Text>
        <Text style={s.dato}>{stats.couponsRedeemed} cupones canjeados</Text>
      </Card>

      <Card>
        <Text style={s.cardTitulo}>Visitas por horario</Text>
        <View style={s.grafico}>
          {stats.hourly.map((h) => (
            <View key={h.hour} style={s.columna}>
              <View style={[s.barra, { height: h.value * 1.2 }]} />
              <Text style={s.hora}>{h.hour}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text style={s.afluencia}>Mayor afluencia: {stats.peakLabel}</Text>

      <Boton
        variante="borde"
        texto="Reseñas y respuestas"
        onPress={() => ir('/RamaNegocio/resenas')}
      />
      <Boton
        variante="borde"
        texto="Avisos de canjes y promociones"
        onPress={() => ir('/RamaNegocio/notificaciones')}
      />
      <Boton
        variante="borde"
        texto="Solicitar verificación"
        onPress={() => ir('/RamaNegocio/ayuda')}
      />
      <Boton
        variante="borde"
        texto="Volver a recorridos"
        onPress={() => ir('/')}
      />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: C.texto,
    marginBottom: 4,
  },
  dato: { fontSize: 13, color: C.gris },
  grafico: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
    marginTop: 8,
  },
  columna: { alignItems: 'center', justifyContent: 'flex-end' },
  barra: { width: 26, backgroundColor: C.barra, borderRadius: 3 },
  hora: { fontSize: 11, color: C.gris, marginTop: 6 },
  afluencia: { fontSize: 14, color: C.texto, marginTop: 4 },
});
