import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Pantalla, Campo, Foto, Boton, TABS_NEGOCIO } from '../../components/negocio/Ui';

export default function Datos() {
  const [nombre, setNombre] = useState('Café del Patio');
  const [direccion, setDireccion] = useState('Calle del Sol 24');
  const [horario, setHorario] = useState('09:00 a 19:00');
  const [servicios, setServicios] = useState('Café de especialidad · Wi-Fi · Terraza');

  const guardar = () => {
    if (!nombre.trim() || !direccion.trim()) {
      Alert.alert('Falta información', 'El nombre y la dirección son obligatorios.');
      return;
    }
    Alert.alert('Listo', 'Información guardada.');
  };

  return (
    <Pantalla
      titulo="Datos del negocio"
      subtitulo="Registra o actualiza tu establecimiento"
      tabs={TABS_NEGOCIO}
      activa="Mi local"
    >
      <Campo label="Nombre" value={nombre} onChangeText={setNombre} />
      <Campo label="Dirección" value={direccion} onChangeText={setDireccion} />
      <Campo label="Horario" value={horario} onChangeText={setHorario} />
      <Campo label="Descripción y servicios" value={servicios} onChangeText={setServicios} />

      <Foto texto="+ Subir fotos y menú" onPress={() => Alert.alert('Fotos', 'Aquí se abrirá la galería.')} />

      <Boton texto="Guardar información" onPress={guardar} />
    </Pantalla>
  );
}
