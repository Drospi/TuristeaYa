import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface CuponItem {
  id: string;
  titulo: string;
  local: string;
  condicion: string;
  seleccionado?: boolean;
}

interface Props {
  cupon: CuponItem;
  onPress: () => void;
}

export const TarjetaCupon: React.FC<Props> = ({ cupon, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, cupon.seleccionado && styles.cardSelected]}
    >
      <Text style={styles.title}>{cupon.titulo}</Text>
      <Text style={styles.local}>{cupon.local}</Text>
      <Text style={styles.condicion}>{cupon.condicion}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardSelected: {
    borderColor: "#0284c7", // Borde azul resaltado de la maqueta
    borderWidth: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#164e3f",
    marginBottom: 6,
  },
  local: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 2,
  },
  condicion: {
    fontSize: 13,
    color: "#64748b",
  },
});
