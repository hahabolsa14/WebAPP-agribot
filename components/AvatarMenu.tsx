import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

interface AvatarMenuProps {
  currentPage?: "Home" | "About" | "Mapping" | "AI Detection" | string;
}

export default function AvatarMenu({ currentPage = "" }: AvatarMenuProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)"); // redirect to auth stack
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <>
      {/* Pressable Avatar */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/main/aiDetection" as any);
              }}
            >
              <Text style={styles.menuText}>AI Detection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/profile");
              }}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/settings");
              }}
            >
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 15,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 150,
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
});
