import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Switch, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Linking 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import BackgroundWrapper from "./BackgroundWrapper";
import { useAuth } from "../utils/authHelpers";
import NetworkStatusBanner from "../components/NetworkStatusBanner";

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleChangePassword = async () => {
    if (!user?.email) return;

    Alert.alert(
      "Change Password",
      "We'll send a password reset link to your email.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Link",
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, user.email!);
              Alert.alert(
                "Success", 
                "Password reset link sent to your email. Please check your inbox."
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to send reset email");
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (user) {
                await deleteUser(user);
                Alert.alert("Success", "Account deleted successfully");
                router.replace("/(auth)");
              }
            } catch (error: any) {
              if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                  "Error",
                  "For security reasons, please sign out and sign in again before deleting your account."
                );
              } else {
                Alert.alert("Error", error.message || "Failed to delete account");
              }
            }
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            // Implement cache clearing logic here
            Alert.alert("Success", "Cache cleared successfully");
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@agribot.com?subject=Support Request");
  };

  const handlePrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "Privacy policy will be displayed here.");
  };

  const handleTermsOfService = () => {
    Alert.alert("Terms of Service", "Terms of service will be displayed here.");
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        <NetworkStatusBanner />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="leaf-outline" size={32} color="#2e7d32" />
            <Text style={styles.headerTitle}>AgriSafeNav</Text>
            
            <View style={styles.headerNav}>
              <TouchableOpacity onPress={() => router.push('/home')} style={styles.navLink}>
                <Text style={styles.navLinkText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/about')} style={styles.navLink}>
                <Text style={styles.navLinkText}>About</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={24} color="#B0B0B0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/settings')}>
              <Ionicons name="settings" size={24} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
              <Ionicons name="person-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Settings</Text>

            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => router.push("/profile")}
              >
                <Text style={styles.settingText}>Edit Profile</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleChangePassword}
              >
                <Text style={styles.settingText}>Change Password</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Push Notifications</Text>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: "#404040", true: "#4CAF50" }}
                  thumbColor={notifications ? "#fff" : "#999"}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Email Updates</Text>
                <Switch
                  value={emailUpdates}
                  onValueChange={setEmailUpdates}
                  trackColor={{ false: "#404040", true: "#4CAF50" }}
                  thumbColor={emailUpdates ? "#fff" : "#999"}
                />
              </View>
            </View>

            {/* Data & Storage Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data & Storage</Text>
              
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleClearCache}
              >
                <Text style={styles.settingText}>Clear Cache</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Support Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>
              
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleContactSupport}
              >
                <Text style={styles.settingText}>Contact Support</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handlePrivacyPolicy}
              >
                <Text style={styles.settingText}>Privacy Policy</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingItem}
                onPress={handleTermsOfService}
              >
                <Text style={styles.settingText}>Terms of Service</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Version</Text>
                <Text style={styles.versionText}>1.0.0</Text>
              </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
              
              <TouchableOpacity 
                style={[styles.settingItem, styles.dangerItem]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.dangerText}>Delete Account</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
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
  },
  headerIcon: {
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2C2C2C",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  settingText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  arrow: {
    fontSize: 24,
    color: "#B0B0B0",
  },
  versionText: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  dangerTitle: {
    color: "#ef4444",
  },
  dangerItem: {
    borderColor: "#ef4444",
    backgroundColor: "#2C1616",
  },
  dangerText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
  },
});
