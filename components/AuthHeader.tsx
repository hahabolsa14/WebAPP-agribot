import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AuthHeaderProps = {
  title?: string;
};

export default function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <View style={styles.headerOverlay}>
      <View style={styles.topBar}>
        <Ionicons name="car-sport-outline" size={28} color="black" />
        {title && <Text style={styles.headerTitle}>{title}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
