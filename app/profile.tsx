import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import BackgroundWrapper from "./BackgroundWrapper";
import { useAuth } from "../utils/authHelpers";
import NetworkStatusBanner from "../components/NetworkStatusBanner";

interface UserProfile {
  displayName: string;
  farmName: string;
  location: string;
  farmSize: string;
  cropTypes: string;
  phoneNumber: string;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    farmName: "",
    location: "",
    farmSize: "",
    cropTypes: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
      } else {
        // Initialize with user's display name if available
        setProfile(prev => ({
          ...prev,
          displayName: user.displayName || ""
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update Firebase Auth profile
      if (profile.displayName && profile.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: profile.displayName
        });
      }

      // Save to Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...profile,
          updatedAt: new Date()
        });
      } else {
        await setDoc(docRef, {
          ...profile,
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/(auth)");
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        <NetworkStatusBanner />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>My Profile</Text>
          
          {/* Email (Read-only) */}
          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>{user?.email}</Text>
            </View>
          </View>

          {/* Display Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={profile.displayName}
              onChangeText={(text) => setProfile({ ...profile, displayName: text })}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Farm Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput
              style={styles.input}
              value={profile.farmName}
              onChangeText={(text) => setProfile({ ...profile, farmName: text })}
              placeholder="Enter your farm name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={profile.location}
              onChangeText={(text) => setProfile({ ...profile, location: text })}
              placeholder="City, Country"
              placeholderTextColor="#999"
            />
          </View>

          {/* Farm Size */}
          <View style={styles.section}>
            <Text style={styles.label}>Farm Size (hectares)</Text>
            <TextInput
              style={styles.input}
              value={profile.farmSize}
              onChangeText={(text) => setProfile({ ...profile, farmSize: text })}
              placeholder="e.g., 5.0"
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>

          {/* Crop Types */}
          <View style={styles.section}>
            <Text style={styles.label}>Crop Types</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={profile.cropTypes}
              onChangeText={(text) => setProfile({ ...profile, cropTypes: text })}
              placeholder="e.g., Rice, Corn, Vegetables"
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.section}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phoneNumber}
              onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#10b981",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#122909",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#122909",
    marginBottom: 8,
  },
  readOnlyContainer: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
