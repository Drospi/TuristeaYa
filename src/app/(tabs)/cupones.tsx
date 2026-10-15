import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
} from "react-native";
import { BottomTabBar } from "../../components/Jose/BottomTabBar";
import { HeaderCupones } from "../../components/Jose/HeaderCupones";
import { EstadoCupon, TabsEstado } from "../../components/Jose/TabsEstado";
import { CuponItem, TarjetaCupon } from "../../components/Jose/TarjetaCupon";

const CUPONES_MOCK: CuponItem[] = [
  {
    id: "1",
    titulo: "20% en tu primera bebida",
    local: "Café del Patio",
    condicion: "Válido hasta el 30 de septiembre.",
    seleccionado: true,
  },
  {
    id: "2",
    titulo: "10% en almuerzo",
    local: "Restaurante del Centro",
    condicion: "Consumo mínimo Bs 50.",
    seleccionado: false,
  },
];

export default function PantallaCupones() {
  const [estado, setEstado] = useState<EstadoCupon>("disponibles");
  const [cupones, setCupones] = useState<CuponItem[]>(CUPONES_MOCK);
  const [tabActual, setTabActual] = useState("Cupones");

  const seleccionarCupon = (id: string) => {
    setCupones((prev) =>
      prev.map((c) => ({
        ...c,
        seleccionado: c.id === id,
      })),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <HeaderCupones onBack={() => console.log("Volver")} />

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <TabsEstado filtroActivo={estado} alCambiar={setEstado} />

        {cupones.map((item) => (
          <TarjetaCupon
            key={item.id}
            cupon={item}
            onPress={() => seleccionarCupon(item.id)}
          />
        ))}

        <Text style={styles.footerNote}>
          Revisa las condiciones antes de confirmar el canje.
        </Text>
      </ScrollView>

      <BottomTabBar tabActiva={tabActual} onSelectTab={setTabActual} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  footerNote: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
});
