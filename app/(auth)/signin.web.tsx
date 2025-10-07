import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "../../components/AuthHeader";
import AuthInput from "../../components/AuthInput";
import { signInUser } from "../../utils/authHelpers";
import BackgroundWrapper from "../BackgroundWrapper";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      window.alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const user = await signInUser(email, password);
    setLoading(false);

    if (user) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Header */}
        <AuthHeader title="Sign In" />

        {/* Form */}
        <View style={styles.form}>
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            inputMode="email"
            placeholder="Email"
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => window.alert("Forgot Password feature coming soon...")}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
    opacity: 1,
  },
  buttonText: { 
    color: "#000", 
    fontWeight: "bold",
  },
  forgotText: {
    color: "#aaa",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});