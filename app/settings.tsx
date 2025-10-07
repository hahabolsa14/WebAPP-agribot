import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "./BackgroundWrapper";

export default function SettingsScreen() {
  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.content}>
          <Text style={styles.placeholderText}>
            This is a placeholder for the settings page.
          </Text>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#122909",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
