import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false, // custom headers handled by screens
        }}
      >
        {/* Landing page (Sign in / Register options) */}
        <Stack.Screen name="index" />

        {/* Auth pages */}
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
    </SafeAreaProvider>
  );
}
