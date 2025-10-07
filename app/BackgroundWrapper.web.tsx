import React from "react";
import { ImageBackground, View, StyleSheet } from "react-native";

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require("../assets/images/field-bg.webp")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default BackgroundWrapper;