import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      Alert.alert("Error", "Please enter both email and password.");
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
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#000" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>Signing in...</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Coming soon...")}>
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
    minHeight: 650,
  },
  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: { color: "#000", fontWeight: "bold" },
  forgotText: {
    color: "#aaa",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
