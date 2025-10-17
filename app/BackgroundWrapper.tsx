import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require("../assets/images/field-bg.webp")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Semi-transparent white overlay for readability */}
      <View style={styles.overlay} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#121212", // Dark background color
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Dark semi-transparent overlay
  },
});