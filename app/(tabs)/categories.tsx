import React, { useState } from "react";
import { Text, View } from "react-native";
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([
    "Food",
    "Travel",
    "Bills",
    "Shopping",
    "Salary",
  ]);

  return (
    <View className="flex-1 bg-gradient-to-br from-orange-50 to-amber-100">
      <View className="pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Categories</Text>
        <Text className="text-gray-600">Organize your transactions</Text>
      </View>

      <View className="flex-1 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-orange-500/10">
          {categories.map((cat, idx) => (
            <View key={idx} className="flex-row items-center py-4 border-b border-gray-100 last:border-b-0">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
                <IconSymbol size={20} name="tag.fill" color="#ea580c" />
              </View>
              <Text className="text-lg font-medium text-gray-800 flex-1">{cat}</Text>
              <View className="w-3 h-3 bg-orange-400 rounded-full" />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
} 