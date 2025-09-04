import React, { useCallback , useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getDb } from "@/lib/db";
import { useSession } from "@/components/session/SessionProvider";
import { useFocusEffect } from "@react-navigation/native";

export default function BankScreen() {
  const { user } = useSession();
  const [banks, setBanks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [balance, setBalance] = useState("");

  // Fetch banks for this user
 const loadBanks = async () => {
  try {
    const db = await getDb();

    // 1. Fetch all banks for this user
    const banksRaw: any[] = await db.getAllAsync(
      "SELECT * FROM banks WHERE user_id = ?",
      [user?.userId]
    );

    // 2. For each bank, fetch sum of transactions
    const banksWithBalances = await Promise.all(
      banksRaw.map(async (bank) => {
        const txnSumRow: any = await db.getFirstAsync(
          "SELECT SUM(amount) as total FROM transactions WHERE bank_id = ? AND user_id = ?",
          [bank.id, user?.userId]
        );

        const txnSum = txnSumRow?.total || 0;

        return {
          ...bank,
          final_balance: bank.initial_balance + txnSum, // ✅ actual balance
        };
      })
    );

    setBanks(banksWithBalances);
  } catch (err: any) {
    console.error("Error fetching banks:", err);
  }
};

useFocusEffect(
      useCallback(() => {
        loadBanks();
      }, [])
    );


  

  const handleAddBank = async () => {
    if (!bankName.trim() || !accountNo.trim() || !balance.trim()) {
      Alert.alert("Missing Fields", "Please enter all fields");
      return;
    }

    // user_id INTEGER,
    //     name TEXT NOT NULL,
    //     account_number TEXT,
    //     initial_balance REAL DEFAULT 0

    try {
      const db = await getDb();
      await db.runAsync(
        `INSERT INTO banks (name, account_number, initial_balance, user_id) VALUES (?, ?, ?, ?)`,
        [bankName.trim(), accountNo.trim(), parseFloat(balance), user?.userId]
      );

      Alert.alert("Success", "Bank added!");
      setModalVisible(false);
      setBankName("");
      setAccountNo("");
      setBalance("");
      loadBanks(); // refresh list
    } catch (err: any) {
      console.error("Error inserting bank:", err);
      Alert.alert("Error", err.message || "Failed to add bank");
    }
  };

  return (
    <LinearGradient
      colors={["#faf5ff", "#ede9fe"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={["#7c3aed", "#6d28d9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Bank Accounts</Text>
        <Text style={styles.headerSubtitle}>Manage your financial accounts</Text>
      </LinearGradient>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconWrapper}>
            <IconSymbol size={46} name="creditcard.fill" color="#7c3aed" />
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.cardTitle}>Your Banks</Text>
          <Text style={styles.cardSubtitle}>
            Add and view your linked bank accounts
          </Text>

          {/* Add Bank Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>+ Add Bank</Text>
          </TouchableOpacity>
        </View>

        {/* List of Banks */}
        <FlatList
          data={banks}
          keyExtractor={(item) => item.id.toString()}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <View style={styles.bankItem}>
              <Text style={styles.bankName}>{item.name}</Text>
              <Text style={styles.bankDetails}>
                A/C: {item.account_number} | ₹{item.final_balance.toLocaleString()}
              </Text>
            </View>
          )}
        />

      </View>

      {/* Modal for Adding Bank */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bank</Text>
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={bankName}
              onChangeText={setBankName}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              value={accountNo}
              onChangeText={setAccountNo}
            />
            <TextInput
              style={styles.input}
              placeholder="Initial Balance"
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#dc2626" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleAddBank}>
                <Text style={styles.buttonText}>Save</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: { color: "#ddd6fe" },
  contentWrapper: { flex: 1, marginTop: -24, paddingHorizontal: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#7c3aed",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd6fe",
  },
  iconWrapper: {
    width: 96,
    height: 96,
    backgroundColor: "#f3e8ff",
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 22, fontWeight: "600", color: "#1f2937", marginBottom: 8 },
  cardSubtitle: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  bankItem: {
    backgroundColor: "#f9f9ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  bankName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  bankDetails: { fontSize: 14, color: "#4b5563", marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd6fe",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
});
