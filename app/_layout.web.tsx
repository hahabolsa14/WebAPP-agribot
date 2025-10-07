// app/_layout.web.tsx
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../utils/authHelpers";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-reanimated";
import BackgroundWrapper from "./BackgroundWrapper";

export default function RootLayout() {
  const { user } = useAuth();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}>
        {user ? (
          // Logged in → tabs
          <Stack.Screen 
            name="(tabs)" 
            options={{
              animationDuration: 200
            }}
          />
        ) : (
          // Not logged in → auth flow
          <Stack.Screen 
            name="(auth)" 
            options={{
              animationDuration: 200
            }}
          />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}