import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
  inputMode?: "text" | "email" | "numeric" | "tel" | "search" | "none" | "url" | "decimal";
}

const AuthInput: React.FC<AuthInputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  secureTextEntry, 
  placeholder, 
  keyboardType = "default",
  inputMode = "text"
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        inputMode={inputMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 6,
    color: "#fff",
    fontSize: 16,
    width: '100%',
  },
});

export default AuthInput;