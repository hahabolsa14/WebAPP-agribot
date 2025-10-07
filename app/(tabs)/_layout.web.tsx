// app/(tabs)/_layout.web.tsx
import { Stack } from "expo-router";
import React from "react";
import TabsHeader from "../../components/TabsHeader";
import BackgroundWrapper from "../BackgroundWrapper";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="about" />
    </Stack>
  );
}