import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { submitMessage } from "../../utils/firestoreHelpers";
import BackgroundWrapper from "../BackgroundWrapper";

export default function AboutScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, message } = form;

    if (!firstName || !lastName || !email || !message) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await submitMessage(firstName, lastName, email, message);
      Alert.alert("Message Sent", "Thank you for contacting us!");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting message:", error);
      Alert.alert("Error", "Unable to send your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fields: {
    label: string;
    key: keyof typeof form;
    multiline?: boolean;
    height?: number;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  }[] = [
    { label: "First name", key: "firstName" },
    { label: "Last name", key: "lastName" },
    { label: "Email address", key: "email", keyboardType: "email-address" },
    { label: "Your message", key: "message", multiline: true, height: 100 },
  ];

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
              <TouchableOpacity onPress={() => router.push('/home')} style={styles.navLink}>
                <Text style={styles.navLinkText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLink}>
                <Text style={[styles.navLinkText, styles.navLinkActive]}>About</Text>
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
                    style={styles.menuItem}
                    onPress={() => {
                      setShowProfileMenu(false);
                      router.push('/(auth)/signin');
                    }}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#f44336" />
                    <Text style={[styles.menuItemText, { color: "#f44336" }]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>About Us</Text>
              <Text style={styles.paragraph}>
                At AgriSafeNav, we are committed to revolutionizing the agricultural landscape
                with cutting-edge autonomous technology.
              </Text>
              <Text style={styles.paragraph}>
                AgriSafeNav designs and develops autonomous ground vehicles tailored for
                agricultural applications. Using smart navigation, AI-driven analytics, and
                real-time data, our vehicles automate key farming tasks like precision planting,
                irrigation, crop monitoring, and soil analysis. The result? A more efficient,
                sustainable, and cost-effective way to manage agricultural operations.
              </Text>
            </View>
          </View>

          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Contact us</Text>

            {fields.map((field) => (
              <View key={field.label} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={[styles.inputBox, field.height ? { height: field.height, textAlignVertical: "top" } : {}]}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  placeholderTextColor="#808080"
                  keyboardType={field.keyboardType}
                  multiline={field.multiline}
                  value={form[field.key]}
                  onChangeText={(text) => handleChange(field.key, text)}
                  editable={!loading}
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading ? "Sending..." : "Submit"}</Text>
            </TouchableOpacity>
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
  navLinkActive: {
    color: "#4CAF50",
    fontWeight: "600",
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
    marginVertical: 8,
  },
  scrollContainer: { 
    flex: 1,
  },
  content: { 
    paddingHorizontal: 20, 
    marginTop: 20,
  },
  textContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#333333",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FFFFFF", 
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  paragraph: { 
    fontSize: 16, 
    color: "#B0B0B0", 
    lineHeight: 26, 
    marginBottom: 14,
  },
  contactContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: "#1E1E1E",
    paddingVertical: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#333333",
  },
  contactTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#FFFFFF",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  inputGroup: { 
    marginBottom: 16,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "#2C2C2C",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
    color: "#FFFFFF",
    fontSize: 15,
  },
  submitButton: { 
    marginTop: 20, 
    backgroundColor: "#4CAF50", 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  submitText: { 
    color: "#FFFFFF", 
    fontWeight: "600", 
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
