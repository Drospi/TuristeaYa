import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Pantalla, Card, Boton, TABS_NEGOCIO, useIr } from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

export default function Notificaciones() {
  const { ir } = useIr();

  return (
    <Pantalla
      titulo="Notificaciones del negocio"
      subtitulo="Canjes y avisos importantes"
      tabs={TABS_NEGOCIO}
      activa="Cupones"
    >
      <Card>
        <Text style={s.titulo}>Nuevo canje · #C102</Text>
        <Text style={s.detalle}>TURISTEA20 · Ahorro Bs 7</Text>
        <Text style={s.detalle}>Hoy, 14:35 · Uso 1 de 1</Text>
      </Card>

      <Card>
        <Text style={s.titulo}>Soporte · Revisar promoción</Text>
        <Text style={s.detalle}>El cupón tiene un horario incorrecto.</Text>
        <Text style={s.detalle}>Actualiza las condiciones.</Text>
      </Card>

      <Card>
        <Text style={s.titulo}>Campaña próxima a terminar</Text>
        <Text style={s.detalle}>Café cerca de ti finaliza el 27 sep.</Text>
      </Card>

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
