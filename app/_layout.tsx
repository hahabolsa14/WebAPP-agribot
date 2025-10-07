// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native"; // ✅ Add this
import "react-native-reanimated";
import { app } from "../firebase";
import BackgroundWrapper from "./BackgroundWrapper"; // optional if you want splash inside wrapper

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <BackgroundWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={{ color: "#000", marginTop: 10 }}>Loading...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          // Logged in → tabs
          <Stack.Screen name="(tabs)" />
        ) : (
          // Not logged in → auth flow
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
