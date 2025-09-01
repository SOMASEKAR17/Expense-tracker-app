import React, { useState } from "react";
import { Text, View } from "react-native";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AddTransactionScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    console.log("Transaction added:", title, amount);
    // Later: save to SQLite/Supabase
    setTitle("");
    setAmount("");
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100">
      <View className="pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Add Transaction</Text>
        <Text className="text-gray-600">Record your income or expense</Text>
      </View>

      <View className="flex-1 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/10">
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-3">Transaction Details</Text>
            <Input
              placeholder="Transaction Title"
              value={title}
              onChangeText={setTitle}
              className="mb-4"
            />
            <Input
              placeholder="Amount (₹)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              className="mb-6"
            />
          </View>

          <Button title="Save Transaction" onPress={handleAdd} />
        </View>
      </View>
    </View>
  );
} 