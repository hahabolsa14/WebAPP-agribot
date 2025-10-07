import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../BackgroundWrapper";
import TabsHeader from "../../components/TabsHeader";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <TabsHeader currentPage="Home" />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
                onPress={() => router.push(btn.route as any)}
              >
                <Ionicons name={btn.icon as any} size={24} color="#2e7d32" />
                <Text style={styles.buttonText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  titleContainer: { 
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 5,
  },
  title: { 
    fontSize: 36, 
    fontWeight: "bold", 
    color: "#000000ff",
    textAlign: 'center',
  },
  buttonsContainer: { 
    marginTop: 40, 
    alignItems: "center", 
    gap: 20,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "90%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#000", 
    marginLeft: 10,
    flex: 1,
  },
});
