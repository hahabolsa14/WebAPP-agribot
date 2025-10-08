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
import { submitMessage } from "../../utils/firestoreHelpers";
import BackgroundWrapper from "../BackgroundWrapper";
import TabsHeader from "../../components/TabsHeader";

export default function AboutScreen() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

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
      <View style={styles.container}>
        <TabsHeader currentPage="About" />
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bannerContainer}>
            <Text style={styles.bannerText}>EcoVentureBot</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>About Us</Text>
              <Text style={styles.paragraph}>
                At EcoVentureBot, we are committed to revolutionizing the agricultural landscape
                with cutting-edge autonomous technology.
              </Text>
              <Text style={styles.paragraph}>
                EcoVentureBot designs and develops autonomous ground vehicles tailored for
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
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  scrollContainer: { flex: 1 },
  bannerContainer: { 
    width: "100%", 
    height: 160, 
    backgroundColor: "rgba(46, 125, 50, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: { paddingHorizontal: 20, marginTop: 10 },
  textContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.1)",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#122909", marginBottom: 15 },
  paragraph: { fontSize: 16, color: "#333", lineHeight: 24, marginBottom: 14 },
  contactContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  contactTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  inputBox: {
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: { marginTop: 15, backgroundColor: "#000", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
