// components/TabsHeader.web.tsx
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AvatarMenu from "./AvatarMenu";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Link } from "expo-router";

interface TabsHeaderProps extends BottomTabHeaderProps {
  currentPage?: string;
  title: string;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ currentPage, route, title }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.nav}>
        <Link href="/home" style={styles.link}>Home</Link>
        <Link href="/about" style={styles.link}>About</Link>
      </View>
      <View style={styles.rightContainer}>
        <AvatarMenu currentPage={currentPage || route.name} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  nav: {
    flexDirection: "row",
    gap: 16,
  },
  link: {
    color: "#007AFF",
    textDecorationLine: "none",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TabsHeader;