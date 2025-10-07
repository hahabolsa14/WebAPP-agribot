import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsHeader from "../../components/TabsHeader";
import BackgroundWrapper from "../BackgroundWrapper";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <TabsHeader currentPage="Home" />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>EcoVenture</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {[
            { label: "Bot Location", icon: "location-outline", route: "/main/botLocation" },
            { label: "Path History", icon: "time-outline", route: "/main/pathHistory" },
            { label: "Mapping", icon: "map-outline", route: "/main/mapping" },
          ].map((btn) => (
            <TouchableOpacity
              key={btn.label}
              style={styles.button}
              onPress={() => router.push(btn.route)}
            >
              <Ionicons name={btn.icon as any} size={24} color="#2e7d32" />
              <Text style={styles.buttonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: { marginTop: 120, alignItems: "center" },
  title: { fontSize: 40, fontWeight: "bold", color: "#122909" },
  buttonsContainer: { marginTop: 160, alignItems: "center", gap: 40 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#000", marginLeft: 10 },
});
