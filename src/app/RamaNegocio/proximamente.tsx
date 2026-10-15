import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Pantalla, Card, TABS_NEGOCIO } from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

export default function Proximamente() {
  return (
    <Pantalla titulo="Campañas" subtitulo="Promociones de tu negocio" tabs={TABS_NEGOCIO} activa="Campañas">
      <Card>
        <Text style={s.titulo}>Próximamente</Text>
        <Text style={s.detalle}>Aquí podrás crear y administrar tus campañas.</Text>
      </Card>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '700', color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
});
