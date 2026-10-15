import { StyleSheet, Text, View } from "react-native";
import {
    Boton,
    Card,
    Pantalla,
    TABS_NEGOCIO,
    useIr,
} from "../../components/negocio/Ui";
import { C } from "../../constants/negocioTheme";

const HORAS = [
  { hora: "10h", valor: 30 },
  { hora: "12h", valor: 45 },
  { hora: "14h", valor: 65 },
  { hora: "16h", valor: 95 },
  { hora: "18h", valor: 75 },
  { hora: "20h", valor: 35 },
];

export default function Resumen() {
  const { ir } = useIr();

  return (
    <Pantalla
      titulo="Mi negocio"
      subtitulo="Café del Patio · Últimos 7 días"
      tabs={TABS_NEGOCIO}
      activa="Resumen"
    >
      <Card>
        <Text style={s.cardTitulo}>Resumen</Text>
        <Text style={s.dato}>1,248 vistas · 86 visitas al local</Text>
        <Text style={s.dato}>32 cupones canjeados</Text>
      </Card>

      <Card>
        <Text style={s.cardTitulo}>Visitas por horario</Text>
        <View style={s.grafico}>
          {HORAS.map((h) => (
            <View key={h.hora} style={s.columna}>
              <View style={[s.barra, { height: h.valor * 1.2 }]} />
              <Text style={s.hora}>{h.hora}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text style={s.afluencia}>Mayor afluencia: 16:00 a 18:00</Text>

      <Boton
        variante="borde"
        texto="Reseñas y respuestas"
        onPress={() => ir("/RamaNegocio/resenas")}
      />
      <Boton
        variante="borde"
        texto="Avisos de canjes y promociones"
        onPress={() => ir("/RamaNegocio/notificaciones")}
      />
      <Boton
        variante="borde"
        texto="Solicitar verificación"
        onPress={() => ir("/RamaNegocio/ayuda")}
      />
      <Boton
        variante="borde"
        texto="Volver a recorridos"
        onPress={() => ir("/explore")}
      />
    </Pantalla>
  );
}

const s = StyleSheet.create({
  cardTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: C.texto,
    marginBottom: 4,
  },
  dato: { fontSize: 13, color: C.gris },
  grafico: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 150,
    marginTop: 8,
  },
  columna: { alignItems: "center", justifyContent: "flex-end" },
  barra: { width: 26, backgroundColor: C.barra, borderRadius: 3 },
  hora: { fontSize: 11, color: C.gris, marginTop: 6 },
  afluencia: { fontSize: 14, color: C.texto, marginTop: 4 },
});
