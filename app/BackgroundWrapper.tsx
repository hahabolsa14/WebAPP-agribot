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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.65)", // modify opacity here
  },
});