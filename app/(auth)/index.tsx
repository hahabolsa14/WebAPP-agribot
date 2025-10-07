import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../BackgroundWrapper";

export default function AuthIndex() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top white header bar */}
        <View style={styles.headerOverlay}>
          <View style={styles.topBar}>
            <Ionicons name="car-sport-outline" size={28} color="black" />
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push("/signin")}
              >
                <Text style={styles.signInText}>Sign in</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push("/signup")}
              >
                <Text style={styles.registerText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Middle content */}
        <View style={styles.content}>
          <Text style={styles.title}>EcoVenture</Text>
          <Text style={styles.subtitle}>
            An autonomous ground vehicle for agricultural applications with
            drawn paths for field navigation.
          </Text>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  authButtons: {
    flexDirection: "row",
    gap: 10,
  },
  signInButton: {
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  signInText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  registerButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  registerText: { color: "#000", fontSize: 14, fontWeight: "500" },
  content: {
    marginTop: 150,
    marginHorizontal: 40,
    zIndex: 3,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#000" },
  subtitle: { fontSize: 14, color: "#222", lineHeight: 20, textAlign: "left" },
});
