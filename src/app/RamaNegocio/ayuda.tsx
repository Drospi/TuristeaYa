import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import {
  Boton,
  Campo,
  Card,
  Pantalla,
  TABS_USUARIO,
  useIr,
} from "../../components/negocio/Ui";
import { C } from "../../constants/negocioTheme";

export default function Ayuda() {
  const { ir } = useIr();
  const { numero = "2050", motivo = "Horario incorrecto" } =
    useLocalSearchParams<{
      numero?: string;
      motivo?: string;
    }>();

  const [mensaje, setMensaje] = useState("");
  const [enviados, setEnviados] = useState<string[]>([]);

  const enviar = () => {
    if (!mensaje.trim()) return;
    setEnviados((prev) => [...prev, mensaje.trim()]);
    setMensaje("");
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

      <Boton texto="Enviar mensaje" onPress={enviar} />
      <Boton
        texto="Nuevo reporte"
        variante="borde"
        onPress={() => ir("/RamaNegocio/reportar")}
      />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: "700", color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
});
