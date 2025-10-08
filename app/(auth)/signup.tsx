import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "../../components/AuthHeader";
import AuthInput from "../../components/AuthInput";
import { registerUser } from "../../utils/authHelpers";
import BackgroundWrapper from "../BackgroundWrapper";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    // Check if fields are empty
    if (!email || !password || !confirmPassword) {
      Alert.alert("Registration Failed", "Please fill in all fields.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    const user = await registerUser(email, password);
    setLoading(false);

    if (user) {
      Alert.alert(
        "Success",
        "Your account has been created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"), // redirect to landing or login page
          },
        ]
      );
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Header */}
        <AuthHeader title="Register" />

        {/* Form */}
        <View style={styles.form}>
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
          />

          <AuthInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm Password"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#000" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>Registering...</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
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
    minHeight: 450,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center'
  },
  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
