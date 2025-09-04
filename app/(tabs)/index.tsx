import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDb } from "@/lib/db";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useSession } from "@/components/session/SessionProvider";

/** Types matching your DB schema */
type Bank = {
  id: number;
  name: string;
  account_number?: string;
  initial_balance: number;
};

type Transaction = {
  id: number;
  title: string;
  amount: number;
  category_id?: number;
  category_name?: string; // ✅ fetched from join
  date?: string;
  bank_id?: number;
  bank_name?: string;
};



export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [bank, setBank] = useState<Bank | null>(null);
  const router = useRouter();
  const { user } = useSession(); 

 
    const fetchData = async () => {
  const db = await getDb();

  // 1. Fetch all banks for the logged-in user
  const banks: Bank[] = (await db.getAllAsync(
    "SELECT * FROM banks WHERE user_id = ?",
    [user?.userId]
  )) as Bank[];

  // 2. Calculate total initial balance
  const totalInitialBalance = banks.reduce(
    (acc, bank) => acc + (bank.initial_balance || 0),
    0
  );
  setInitialBalance(totalInitialBalance);

  // 3. Fetch transactions for this user
  // 3. Fetch transactions for this user (with bank name + category)
const txns = await db.getAllAsync(
  `
  SELECT t.*, 
         b.name as bank_name,
         c.name as category_name
  FROM transactions t
  LEFT JOIN banks b ON t.bank_id = b.id
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE t.user_id = ?
  ORDER BY t.date DESC
  `,
  [user?.userId]
);

setTransactions(txns as (Transaction & { bank_name?: string; category_name?: string })[]);

};


    

  // Refresh whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Compute balances
 // Compute balances
const changeFromTransactions = transactions.reduce(
  (acc, t) => acc + (t.amount ?? 0),
  0
);
const balance = initialBalance + changeFromTransactions;

const income = transactions
  .filter((t) => (t.amount ?? 0) > 0)
  .reduce((acc, t) => acc + (t.amount ?? 0), 0);

const expenses = transactions
  .filter((t) => (t.amount ?? 0) < 0)
  .reduce((acc, t) => acc + Math.abs(t.amount ?? 0), 0);


  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#2563eb", "#4f46e5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Hi{user ? ` — ${user.username}` : ""} 👋</Text>
        <Text style={styles.headerSubtitle}>Here’s your financial overview</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>₹{Number(balance).toLocaleString()}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceCol}>
              <Text style={styles.incomeLabel}>Income</Text>
              <Text style={styles.balanceValue}>₹{income.toLocaleString()}</Text>
            </View>
            <View style={styles.balanceCol}>
              <Text style={styles.expenseLabel}>Expenses</Text>
              <Text style={styles.balanceValue}>₹{expenses.toLocaleString()}</Text>
            </View>
          </View>

          {/* Add Transaction Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-transaction")}
          >
            <Text style={styles.addButtonText}>➕ Add Transaction</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Transactions */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsTitle}>Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: item.amount < 0 ? "#fee2e2" : "#dcfce7" },
                    ]}
                  >
                    <Text style={styles.iconText}>{item.amount < 0 ? "💸" : "💰"}</Text>
                  </View>
                  <View style={styles.transactionTextWrapper}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionSubtitle}>
                        {item.category_name ?? "General"} • {item.bank_name ?? "No Bank"} •{" "}
                        {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                      </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.amount < 0 ? "#dc2626" : "#16a34a" },
                  ]}
                >
                  {item.amount < 0 ? "-" : "+"}₹{Math.abs(item.amount).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20, color: "#6b7280" }}>No transactions yet</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#c7d2fe",
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  balanceLabel: {
    color: "#c7d2fe",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  balanceCol: {
    alignItems: "center",
  },
  incomeLabel: {
    color: "#86efac",
    fontSize: 12,
  },
  expenseLabel: {
    color: "#fca5a5",
    fontSize: 12,
  },
  balanceValue: {
    color: "white",
    fontWeight: "600",
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 2,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  transactionTextWrapper: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  transactionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
