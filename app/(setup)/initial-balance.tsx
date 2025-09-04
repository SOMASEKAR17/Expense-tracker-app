import React, { useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDb } from "@/lib/db";

export default function InitialBalanceScreen() {
  const { bankId } = useLocalSearchParams<{ bankId: string }>();
  const [initialBalance, setInitialBalance] = useState("");
  const router = useRouter();

  const onComplete = async () => {
    if (!initialBalance || isNaN(Number(initialBalance))) {
      Alert.alert("Invalid Balance", "Please enter a valid initial balance");
      return;
    }

    try {
      const db = await getDb();

      // Update initial balance for the bank created before
      await db.runAsync(
        `UPDATE banks SET initial_balance = ? WHERE id = ?`,
        [parseFloat(initialBalance), Number(bankId)]
      );

      // Navigate to dashboard (tabs)
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <LinearGradient
      colors={["#fef3c7", "#fde68a"]} // amber-100 → yellow-200
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.innerWrapper}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconWrapper}>
            <IconSymbol size={48} name="dollarsign.circle.fill" color="#d97706" />
          </View>
          <Text style={styles.title}>Set Initial Balance</Text>
          <Text style={styles.subtitle}>
            Enter the opening balance for your primary account
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Input
            placeholder="Enter Initial Balance"
            value={initialBalance}
            onChangeText={setInitialBalance}
            keyboardType="numeric"
            style={styles.inputSpacing}
          />

          <Button title="Finish Setup ✅" onPress={onComplete} />
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
    paddingHorizontal: 32,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    backgroundColor: "#fef9c3",
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#4b5563",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#d97706",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  inputSpacing: {
    marginBottom: 16,
  },
});
