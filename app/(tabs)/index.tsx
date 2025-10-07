// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabsIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(tabs)/home"); // redirect to home automatically
  }, []);

  return null; // nothing to render
}
