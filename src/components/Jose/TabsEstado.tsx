import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type EstadoCupon = "disponibles" | "usados";

interface Props {
  filtroActivo: EstadoCupon;
  alCambiar: (estado: EstadoCupon) => void;
}

export const TabsEstado: React.FC<Props> = ({ filtroActivo, alCambiar }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Estado</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => alCambiar("disponibles")}
          style={[
            styles.tab,
            filtroActivo === "disponibles"
              ? styles.tabActivo
              : styles.tabInactivo,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              filtroActivo === "disponibles"
                ? styles.tabTextActivo
                : styles.tabTextInactivo,
            ]}
          >
            Disponibles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => alCambiar("usados")}
          style={[
            styles.tab,
            filtroActivo === "usados" ? styles.tabActivo : styles.tabInactivo,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              filtroActivo === "usados"
                ? styles.tabTextActivo
                : styles.tabTextInactivo,
            ]}
          >
            Usados
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabActivo: {
    backgroundColor: "#dceee3",
    borderWidth: 1,
    borderColor: "#c6dfcf",
  },
  tabInactivo: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
  },
  tabTextActivo: {
    color: "#164e3f",
  },
  tabTextInactivo: {
    color: "#64748b",
  },
});
