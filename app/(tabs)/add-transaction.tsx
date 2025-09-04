import React, { useCallback ,useState, useEffect } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getDb } from "@/lib/db";
import { useSession } from "@/components/session/SessionProvider";
import { Picker } from "@react-native-picker/picker"; // ✅ install if not added: expo install @react-native-picker/picker
import { useFocusEffect } from "@react-navigation/native";

export default function AddTransactionScreen() {
  const { user } = useSession();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  const [categories, setCategories] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBank, setSelectedBank] = useState<number | null>(null);

    const fetchData = async () => {
      try {
        const db = await getDb();

        const cats = await db.getAllAsync(
          "SELECT * FROM categories WHERE user_id = ?",
          [user?.userId]
        );
        setCategories(cats);

        const banksData = await db.getAllAsync(
          "SELECT * FROM banks WHERE user_id = ?",
          [user?.userId]
        );
        setBanks(banksData);
      } catch (err: any) {
        Alert.alert("Error", err.message);
      }
    };
    fetchData();

  useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );

  const handleAdd = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("Missing Fields", "Please enter both title and amount");
      return;
    }
    if (!user?.userId) {
      Alert.alert("Error", "No user logged in");
      return;
    }
    if (!selectedCategory) {
      Alert.alert("Validation", "Please select a category");
      return;
    }
    if (!selectedBank) {
      Alert.alert("Validation", "Please select a bank");
      return;
    }

    try {
      const db = await getDb();
      const today = new Date().toISOString();

      const finalAmount =
        type === "expense" ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

      await db.runAsync(
        `INSERT INTO transactions (title, amount, category_id, bank_id, date, user_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, finalAmount, selectedCategory, selectedBank, today, user.userId]
      );

      Alert.alert("Success", "Transaction added!");
      setTitle("");
      setAmount("");
      setType("income");
      setSelectedCategory(null);
      setSelectedBank(null);
    } catch (err: any) {
      console.error("Error inserting transaction:", err);
      Alert.alert("Error", err.message || "Failed to add transaction");
    }
  };

  return (
    <LinearGradient
      colors={["#f0fdf4", "#d1fae5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={["#059669", "#047857"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <Text style={styles.headerSubtitle}>Record your income or expense</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            marginTop: -24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Transaction Details</Text>

            <Input
              placeholder="Transaction Title"
              value={title}
              onChangeText={setTitle}
              style={{ marginBottom: 16 }}
            />

            <Input
              placeholder="Amount (₹)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{ marginBottom: 16 }}
            />

            {/* Type Selector */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" && styles.activeIncome,
                ]}
                onPress={() => setType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "income" && styles.activeText,
                  ]}
                >
                  💰 Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" && styles.activeExpense,
                ]}
                onPress={() => setType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "expense" && styles.activeText,
                  ]}
                >
                  💸 Expense
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Dropdown */}
            <Text style={styles.label}>Select Category</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <Picker.Item label="-- Select Category --" value={null} />
                {categories.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={`${cat.emoji || "🏷️"} ${cat.name}`}
                    value={cat.id}
                  />
                ))}
              </Picker>
            </View>

            {/* Bank Dropdown */}
            <Text style={styles.label}>Select Bank</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedBank}
                onValueChange={(value) => setSelectedBank(value)}
              >
                <Picker.Item label="-- Select Bank --" value={null} />
                {banks.map((bank) => (
                  <Picker.Item key={bank.id} label={bank.name} value={bank.id} />
                ))}
              </Picker>
            </View>

            <Button
              title="💾 Save Transaction"
              onPress={handleAdd}
              style={styles.saveButton}
              textStyle={styles.saveButtonText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 14, color: "#bbf7d0" },
  formCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#10b981",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#d1fae5",
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  activeIncome: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },
  activeExpense: {
    backgroundColor: "#fee2e2",
    borderColor: "#dc2626",
  },
  activeText: {
    color: "#1f2937",
    fontWeight: "700",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#059669",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
