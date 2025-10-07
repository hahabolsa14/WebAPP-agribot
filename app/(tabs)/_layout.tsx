import { Stack } from "expo-router";
import React from "react";
import BackgroundWrapper from "../BackgroundWrapper";

export default function TabLayout() {
  return (
    <BackgroundWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="about" />
      </Stack>
    </BackgroundWrapper>
  );
}
