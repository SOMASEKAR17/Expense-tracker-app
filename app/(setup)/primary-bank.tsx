import React, { useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getDb } from "@/lib/db";
import { useRouter } from "expo-router";
import { useSession } from "@/components/session/SessionProvider";

export default function PrimaryBank() {
  const { user } = useSession();
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const router = useRouter();

  const onComplete = async () => {
    if (!bankName.trim() || !accountNo.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    try {
      const db = await getDb();

      // Insert new bank; set initial balance later on the next screen
      const result = await db.runAsync(
        `INSERT INTO banks (name, account_number, initial_balance,user_id) VALUES (? ,?, ?, ?)`,
        [bankName.trim(), accountNo.trim(), 0 ,user?.userId]
      );

      const bankId = result.lastInsertRowId;

      // Navigate to Initial Balance with bankId
      router.replace({
        pathname: "/(setup)/initial-balance",
        params: { bankId: String(bankId) },
      });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <LinearGradient
      colors={["#faf5ff", "#ede9fe"]} // purple-50 → violet-100
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.innerWrapper}>
        {/* Top Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconWrapper}>
            <IconSymbol size={48} name="building.2.fill" color="#7c3aed" />
          </View>
          <Text style={styles.title}>Add Primary Bank</Text>
          <Text style={styles.subtitle}>Set up your main bank account</Text>
        </View>

        {/* Card Section */}
        <View style={styles.card}>
          <Input
            placeholder="Bank Name"
            value={bankName}
            onChangeText={setBankName}
            style={styles.inputSpacing}
          />
          <Input
            placeholder="Account Number"
            value={accountNo}
            onChangeText={setAccountNo}
            style={styles.inputSpacing}
          />
          <Button title="Complete Setup" onPress={onComplete} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32, // px-8
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32, // mb-8
  },
  iconWrapper: {
    width: 96, // w-24
    height: 96, // h-24
    backgroundColor: "#f3e8ff", // purple-100
    borderRadius: 48, // rounded-full
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24, // mb-6
  },
  title: {
    fontSize: 32, // text-4xl
    fontWeight: "bold",
    color: "#1f2937", // gray-800
    marginBottom: 12, // mb-3
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: "#4b5563", // gray-600
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16, // rounded-2xl
    padding: 24, // p-6
    shadowColor: "#7c3aed",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  inputSpacing: {
    marginBottom: 16, // add spacing between inputs
  },
});
