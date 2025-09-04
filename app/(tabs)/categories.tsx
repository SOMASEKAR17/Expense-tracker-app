import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDb } from "@/lib/db";
import { useSession } from "@/components/session/SessionProvider";

type Category = {
  id: number;
  name: string;
  emoji?: string;
  user_id: number;
  created_at?: string;
};

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const { user } = useSession();

  const fetchCategories = async () => {
    try {
      const db = await getDb();
      const rows = await db.getAllAsync(
        "SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC",
        [user?.userId]
      );
      setCategories(rows as Category[]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const addCategory = async () => {
    if (!newName.trim()) {
      Alert.alert("Validation", "Category name is required.");
      return;
    }

    try {
      const db = await getDb();
      await db.runAsync(
        "INSERT INTO categories (name, emoji, user_id) VALUES (?, ?, ?)",
        [newName.trim(), newEmoji.trim(), user?.userId]
      );
      setNewName("");
      setNewEmoji("");
      setModalVisible(false);
      fetchCategories();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <LinearGradient colors={["#fff7ed", "#fef3c7"]} style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#f97316", "#d97706"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>Organize your transactions</Text>
      </LinearGradient>

      {/* Categories List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoryCard}>
          {categories.map((cat, idx) => (
            <View
              key={cat.id}
              style={[
                styles.categoryItem,
                idx === categories.length - 1 && styles.lastCategoryItem,
              ]}
            >
              <View style={styles.iconWrapper}>
                <Text style={styles.emojiText}>
                  {cat.emoji || "🏷️"}
                </Text>
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
              <View style={styles.dot} />
            </View>
          ))}
        </View>

        {/* Add Category Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>➕ Add Category</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Adding Category */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Category</Text>
            <TextInput
              placeholder="Enter category name"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />
            <TextInput
              placeholder="Enter emoji (📚, 🍔, ✈️)"
              value={newEmoji}
              onChangeText={setNewEmoji}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: "#ef4444" }]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addCategory}
                style={[styles.modalButton, { backgroundColor: "#10b981" }]}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  headerSubtitle: { color: "#ffedd5" },
  scrollContent: { paddingHorizontal: 24, marginTop: -24 },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fed7aa",
    elevation: 2,
    shadowColor: "#f97316",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  lastCategoryItem: { borderBottomWidth: 0 },
  iconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: "#ffedd5",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  emojiText: { fontSize: 22 },
  categoryText: { fontSize: 18, fontWeight: "600", color: "#1f2937", flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#fb923c" },
  addButton: {
    marginTop: 16,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: { color: "white", fontWeight: "600" },
});
