import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function DashboardScreen() {
  // Sample static data (later: fetch from SQLite/Supabase)
  const [transactions, setTransactions] = useState([
    { id: "1", title: "Groceries", amount: -500, category: "Food", date: "Today" },
    { id: "2", title: "Salary", amount: 5000, category: "Income", date: "Yesterday" },
    { id: "3", title: "Rent", amount: -2000, category: "Housing", date: "2 days ago" },
    { id: "4", title: "Freelance", amount: 1500, category: "Income", date: "3 days ago" },
    { id: "5", title: "Transport", amount: -300, category: "Travel", date: "4 days ago" },
  ]);

  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const categories = [
    { name: "Food", amount: 800, color: "bg-orange-500", icon: "🍽️" },
    { name: "Transport", amount: 500, color: "bg-blue-500", icon: "🚗" },
    { name: "Housing", amount: 2000, color: "bg-purple-500", icon: "🏠" },
    { name: "Entertainment", amount: 300, color: "bg-pink-500", icon: "🎬" },
  ];

  return (
    <View className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <View className="pt-12 pb-6 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold mb-2">Welcome back! 👋</Text>
        <Text className="text-blue-100 mb-6">Here's your financial overview</Text>
        
        {/* Balance Card */}
        <View className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <Text className="text-blue-100 text-sm font-medium mb-1">Total Balance</Text>
          <Text className="text-white text-4xl font-bold mb-2">₹{balance.toLocaleString()}</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-green-300 text-sm">Income</Text>
              <Text className="text-white font-semibold">₹{income.toLocaleString()}</Text>
            </View>
            <View className="items-center">
              <Text className="text-red-300 text-sm">Expenses</Text>
              <Text className="text-white font-semibold">₹{expenses.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View className="px-6 -mt-4">
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg shadow-blue-500/10 border border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600 text-sm">This Month</Text>
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                <Text className="text-green-600 text-lg">📈</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-gray-800">₹{income.toLocaleString()}</Text>
            <Text className="text-green-600 text-sm font-medium">+12.5%</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg shadow-red-500/10 border border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-600 text-sm">Spent</Text>
              <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                <Text className="text-red-600 text-lg">💸</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-gray-800">₹{expenses.toLocaleString()}</Text>
            <Text className="text-red-600 text-sm font-medium">-8.2%</Text>
          </View>
        </View>
      </View>

      {/* Categories Section */}
      <View className="px-6 mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Top Categories</Text>
        <View className="flex-row flex-wrap gap-3">
          {categories.map((cat, index) => (
            <View key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-w-[150px]">
              <View className={`w-12 h-12 ${cat.color} rounded-xl items-center justify-center mb-3`}>
                <Text className="text-white text-2xl">{cat.icon}</Text>
              </View>
              <Text className="text-gray-800 font-semibold mb-1">{cat.name}</Text>
              <Text className="text-gray-600">₹{cat.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="flex-1 px-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    item.amount < 0 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <Text className="text-lg">
                      {item.amount < 0 ? '💸' : '💰'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-medium text-gray-800">{item.title}</Text>
                    <Text className="text-gray-500 text-sm">{item.category} • {item.date}</Text>
                  </View>
                </View>
                <Text
                  className={`text-lg font-bold ${item.amount < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {item.amount < 0 ? '-' : '+'}₹{Math.abs(item.amount).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
