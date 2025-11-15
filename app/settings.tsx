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
import { auth } from "../firebase";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import BackgroundWrapper from "./BackgroundWrapper";
import { useAuth } from "../utils/authHelpers";

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

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
        <ScrollView showsVerticalScrollIndicator={false}>
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
                trackColor={{ false: "#767577", true: "#10b981" }}
                thumbColor={notifications ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Email Updates</Text>
              <Switch
                value={emailUpdates}
                onValueChange={setEmailUpdates}
                trackColor={{ false: "#767577", true: "#10b981" }}
                thumbColor={emailUpdates ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Auto-save Chats</Text>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: "#767577", true: "#10b981" }}
                thumbColor={autoSave ? "#fff" : "#f4f3f4"}
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
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#122909",
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#122909",
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  settingText: {
    fontSize: 16,
    color: "#000",
  },
  arrow: {
    fontSize: 24,
    color: "#999",
  },
  versionText: {
    fontSize: 16,
    color: "#666",
  },
  dangerTitle: {
    color: "#ef4444",
  },
  dangerItem: {
    borderColor: "#ef4444",
  },
  dangerText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "600",
  },
});
