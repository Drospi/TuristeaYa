import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Pantalla, Card, Campo, Foto, Boton, TABS_NEGOCIO } from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

export default function Resenas() {
  const [respuesta, setRespuesta] = useState('Gracias por visitarnos, Lucía.');
  const [publicada, setPublicada] = useState<string | null>(null);

  const publicar = () => {
    if (!respuesta.trim()) {
      Alert.alert('Falta información', 'Escribe una respuesta.');
      return;
    }
    setPublicada(respuesta.trim());
  };

  return (
    <Pantalla
      titulo="Reseñas de mi negocio"
      subtitulo="4.8 / 5 · 128 opiniones"
      tabs={TABS_NEGOCIO}
      activa="Resumen"
    >
      <Card>
        <Text style={s.titulo}>Lucía · 5 / 5</Text>
        <Text style={s.detalle}>Buen café y atención amable.</Text>
        {publicada ? <Text style={s.respuesta}>Tu respuesta: {publicada}</Text> : null}
      </Card>

      <Foto texto="Foto adjunta por la visitante" />

      <Campo label="Responder como negocio" value={respuesta} onChangeText={setRespuesta} />
      <Boton texto="Publicar respuesta" onPress={publicar} />

      <Card>
        <Text style={s.titulo}>Carlos · 4 / 5</Text>
        <Text style={s.detalle}>El servicio estuvo bien, aunque esperamos un poco.</Text>
      </Card>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '700', color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
  respuesta: { fontSize: 13, color: C.verde, marginTop: 6 },
});
