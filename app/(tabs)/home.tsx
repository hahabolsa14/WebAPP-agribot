import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../BackgroundWrapper";

// Import the standalone pages - we'll embed them in the dashboard
import AIDetectionPage from "../main/aiDetection";
import BotLocationPage from "../main/botLocation";
// import PathHistoryPage from "../main/pathHistory";
// Note: Use mapping.web.tsx for web platform
const MappingPage = Platform.OS === 'web' 
  ? require("../main/mapping.web").default 
  : require("../main/mapping").default;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Bot Location");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabs = [
    { label: "Bot Location", icon: "location-outline" as const },
    // { label: "Path History", icon: "time-outline" as const },
    { label: "Mapping", icon: "map-outline" as const },
    { label: "AI Detection", icon: "scan-outline" as const },
  ];

  const handleTabPress = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    router.push('/(auth)');
  };

  const handleNavigateToHome = () => {
    setActiveTab("Bot Location");
  };

  const handleNavigateToAbout = () => {
    router.push('/about');
  };

  // Render the active page component in an embedded container
  const renderActiveContent = () => {
    switch (activeTab) {
      case "Bot Location":
        return <View style={styles.embeddedPage}><BotLocationPage /></View>;
      // case "Path History":
      //   return <View style={styles.embeddedPage}><PathHistoryPage /></View>;
      case "Mapping":
        return <View style={styles.embeddedPage}><MappingPage /></View>;
      case "AI Detection":
        return <View style={styles.embeddedPage}><AIDetectionPage /></View>;
      default:
        return null;
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="leaf-outline" size={32} color="#2e7d32" />
            <Text style={styles.headerTitle}>AgriSafeNav</Text>
            
            {/* Navigation Links */}
            <View style={styles.headerNav}>
              <TouchableOpacity onPress={handleNavigateToHome} style={styles.navLink}>
                <Text style={styles.navLinkText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNavigateToAbout} style={styles.navLink}>
                <Text style={styles.navLinkText}>About</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="#B0B0B0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={24} color="#B0B0B0" />
            </TouchableOpacity>
            <View style={styles.profileContainer}>
              <TouchableOpacity 
                style={styles.avatar}
                onPress={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Ionicons name="person-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
              
              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <View style={styles.profileMenu}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setShowProfileMenu(false);
                      router.push('/profile');
                    }}
                  >
                    <Ionicons name="person-outline" size={20} color="#B0B0B0" />
                    <Text style={styles.menuItemText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      setShowProfileMenu(false);
                      router.push('/settings');
                    }}
                  >
                    <Ionicons name="settings-outline" size={20} color="#B0B0B0" />
                    <Text style={styles.menuItemText}>Settings</Text>
                  </TouchableOpacity>
                  <View style={styles.menuDivider} />
                  <TouchableOpacity 
                    style={[styles.menuItem, styles.logoutItem]}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#f44336" />
                    <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Main Content Area with Sidebar */}
        <View style={styles.mainContent}>
          {/* Overlay to close menu when clicking outside */}
          {showProfileMenu && (
            <TouchableOpacity 
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setShowProfileMenu(false)}
            />
          )}
          
          {/* Main Screen Area - Embedded Page */}
          <View style={styles.screenArea}>
            {renderActiveContent()}
          </View>

          {/* Right Sidebar Navigation */}
          <View style={styles.sidebar}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.label}
                style={[
                  styles.sidebarTab,
                  activeTab === tab.label && styles.sidebarTabActive
                ]}
                onPress={() => handleTabPress(tab.label)}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={24} 
                  color={activeTab === tab.label ? "#fff" : "#666"} 
                />
                <Text style={[
                  styles.sidebarTabText,
                  activeTab === tab.label && styles.sidebarTabTextActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10000,
    position: "relative",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerNav: {
    flexDirection: "row",
    gap: 24,
    marginLeft: 32,
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navLinkText: {
    fontSize: 16,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    position: "relative",
  },
  headerIcon: {
    padding: 8,
  },
  profileContainer: {
    position: "relative",
    marginLeft: 8,
    zIndex: 100000,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
  },
  profileMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#252525",
    borderRadius: 8,
    padding: 8,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10000,
    zIndex: 99999,
    borderWidth: 1,
    borderColor: "#404040",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  menuItemText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#404040",
    marginVertical: 4,
  },
  logoutItem: {
    backgroundColor: "#252525",
  },
  logoutText: {
    color: "#f44336",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#121212",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  screenArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  embeddedPage: {
    flex: 1,
    overflow: "hidden",
  },
  // Sidebar Styles
  sidebar: {
    width: 200,
    backgroundColor: "#1A1A1A",
    borderLeftWidth: 1,
    borderLeftColor: "#333333",
    paddingVertical: 20,
    gap: 8,
  },
  sidebarTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: "transparent",
  },
  sidebarTabActive: {
    backgroundColor: "#2e7d32",
    borderLeftWidth: 4,
    borderLeftColor: "#1b5e20",
  },
  sidebarTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B0B0B0",
    flex: 1,
  },
  sidebarTabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
