import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarMenu from "./AvatarMenu";

interface TabsHeaderProps {
  currentPage?: "Home" | "About" | "Mapping";
  route?: any;
  options?: any;
}

export default function TabsHeader({ currentPage, route, options }: TabsHeaderProps) {
  const router = useRouter();
  
  // Determine current page from route if not provided
  const getCurrentPage = (): "Home" | "About" | "Mapping" => {
    if (currentPage) return currentPage;
    if (route?.name === "home") return "Home";
    if (route?.name === "about") return "About";
    if (route?.name === "mapping") return "Mapping";
    return "Home";
  };

  const current = getCurrentPage();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity 
        style={styles.logoContainer}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="car-sport-outline" size={32} color="#2e7d32" />
        <Text style={styles.logoText}>EcoVenture</Text>
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <TouchableOpacity
            style={current === "Home" ? styles.tabActive : styles.tab}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Ionicons name="home-outline" size={16} color={current === "Home" ? "#2e7d32" : "#fff"} />
            <Text style={current === "Home" ? styles.tabTextActive : styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={current === "Mapping" ? styles.tabActive : styles.tab}
            onPress={() => router.push("/main/mapping")}
          >
            <Ionicons name="map-outline" size={16} color={current === "Mapping" ? "#2e7d32" : "#fff"} />
            <Text style={current === "Mapping" ? styles.tabTextActive : styles.tabText}>Mapping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={current === "About" ? styles.tabActive : styles.tab}
            onPress={() => router.push("/(tabs)/about")}
          >
            <Ionicons name="information-circle-outline" size={16} color={current === "About" ? "#2e7d32" : "#fff"} />
            <Text style={current === "About" ? styles.tabTextActive : styles.tabText}>About</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Menu */}
        <AvatarMenu currentPage={current} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    margin: 0,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  navTabs: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#2e7d32",
    borderRadius: 25,
    paddingHorizontal: 6,
    padding: 4,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  tabText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#2e7d32",
    fontSize: 12,
    fontWeight: "600",
  },
});
