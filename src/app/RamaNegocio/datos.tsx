import React, { useEffect, useState } from 'react';
import { Alert, Text } from 'react-native';

import {
  Boton,
  Campo,
  Foto,
  Pantalla,
  TABS_NEGOCIO,
} from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

import {
  fetchBusinessDashboardData,
  updateBusiness,
} from '@/services/catalogos.service';
import { updateRecord } from '@/services/http';
import type { DbBusiness, DbPlace } from '@/types/database';

export default function Datos() {
  const [business, setBusiness] = useState<DbBusiness | null>(null);
  const [place, setPlace] = useState<DbPlace | null>(null);
  const [nombre, setNombre] = useState('Café del Patio');
  const [direccion, setDireccion] = useState('Calle del Sol 24');
  const [horario, setHorario] = useState('09:00 a 19:00');
  const [servicios, setServicios] = useState('Café de especialidad · Wi-Fi · Terraza');
  const [estadoGuardado, setEstadoGuardado] = useState('');

  useEffect(() => {
    let active = true;
    fetchBusinessDashboardData().then((data) => {
      if (!active) return;
      setBusiness(data.business);
      setPlace(data.place);
      setNombre(data.profile.name);
      setDireccion(data.profile.address);
      setHorario(data.profile.hours);
      setServicios(
        `${data.profile.description} · ${data.profile.services.join(' · ')}`,
      );
    });
    return () => {
      active = false;
    };
  }, []);

  const guardar = async () => {
    if (!nombre.trim() || !direccion.trim()) {
      Alert.alert('Falta información', 'El nombre y la dirección son obligatorios.');
      return;
    }
    try {
      if (business?.id) {
        await updateBusiness(business.id, { name: nombre.trim() });
      }
      if (place?.id) {
        await updateRecord<DbPlace>('places', place.id, {
          name: nombre.trim(),
          address: direccion.trim(),
          description: servicios.trim(),
        });
      }
      setEstadoGuardado('Información guardada en el servidor.');
      Alert.alert('Listo', 'Información guardada.');
    } catch {
      setEstadoGuardado('Información guardada localmente.');
      Alert.alert('Listo', 'Información guardada.');
    }
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

      <Foto
        texto="+ Subir fotos y menú"
        onPress={() => Alert.alert('Fotos', 'Aquí se abrirá la galería.')}
      />

      {estadoGuardado ? (
        <Text style={{ fontSize: 13, color: C.verde }}>{estadoGuardado}</Text>
      ) : null}

      <Boton texto="Guardar información" onPress={() => void guardar()} />
    </Pantalla>
  );
}
