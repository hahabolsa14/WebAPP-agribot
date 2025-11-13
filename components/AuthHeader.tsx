import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AuthHeaderProps = {
  title?: string;
};

export default function AuthHeader({ title }: AuthHeaderProps) {
  return (
    <View style={styles.topBar}>
      {/* Left: App Icon + Title */}
      <View style={styles.leftContainer}>
        <Ionicons name="leaf-outline" size={32} color="#2e7d32" />
        {title && <Text style={styles.headerTitle}>{title}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // align items on the left only
    backgroundColor: "#000",
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    zIndex: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
});
