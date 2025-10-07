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
import TabsHeader from "../../components/TabsHeader";
import { submitMessage } from "../../utils/firestoreHelpers";
import BackgroundWrapper from "../BackgroundWrapper";

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
      <SafeAreaView style={{ flex: 1 }}>
        <TabsHeader currentPage="About" />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        >
          <Image
            source={{ uri: "https://i.ibb.co/0Vh6nQv/field-banner.jpg" }}
            style={styles.bannerImage}
          />

          <View style={styles.content}>
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
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  bannerImage: { width: "100%", height: 160, resizeMode: "cover" },
  content: { paddingHorizontal: 20, marginTop: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: "#122909", marginBottom: 15 },
  paragraph: { fontSize: 16, color: "#333", lineHeight: 22, marginBottom: 12 },
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
