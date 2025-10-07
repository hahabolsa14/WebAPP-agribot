import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarMenu from "./AvatarMenu";

interface TabsHeaderProps {
  currentPage: "Home" | "About";
}

export default function TabsHeader({ currentPage }: TabsHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      <Ionicons name="car-sport-outline" size={28} color="black" />

      <View style={styles.rightContainer}>
        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <TouchableOpacity
            style={currentPage === "Home" ? styles.tabActive : styles.tab}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={currentPage === "Home" ? styles.tabTextActive : styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={currentPage === "About" ? styles.tabActive : styles.tab}
            onPress={() => router.push("/(tabs)/about")}
          >
            <Text style={currentPage === "About" ? styles.tabTextActive : styles.tabText}>About Us</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Menu */}
        <AvatarMenu currentPage={currentPage} />
      </View>
    </View>
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
    width: "100%",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navTabs: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 5,
    padding: 2,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tabActive: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  tabText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
});
