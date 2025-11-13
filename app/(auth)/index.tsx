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
            <Ionicons name="leaf-outline" size={28} color="#2e7d32" />
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push("/signin")}
              >
                <Text style={styles.signInText}>Log in</Text>
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
          <Text style={styles.title}>Welcome to AgriSafeNav</Text>
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
    backgroundColor: "#1A1A1A",
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
    backgroundColor: "#4CAF50",    // bright green for contrast
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  signInText: { 
    color: "#000",                 // black text on green button
    fontSize: 14, 
    fontWeight: "500" 
  },
  registerButton: {
    backgroundColor: "#fff",       // white button
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  registerText: { 
    color: "#000",             // dark green text to match theme
    fontSize: 14, 
    fontWeight: "500" 
  },
  content: {
    marginTop: 150,
    marginHorizontal: 40,
    zIndex: 3,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.1)",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#2e7d32" },
  subtitle: { fontSize: 14, color: "#ffffffff", lineHeight: 20, textAlign: "left" },
});
