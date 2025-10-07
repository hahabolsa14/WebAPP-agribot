import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu";
import BackgroundWrapper from "../BackgroundWrapper";

export default function BotLocationPage() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Ionicons name="car-sport-outline" size={28} color="black" />

          <View style={styles.rightContainer}>
            <AvatarMenu currentPage="BotLocation" />
          </View>
        </View>

        {/* Placeholder Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Bot Location Placeholder</Text>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
