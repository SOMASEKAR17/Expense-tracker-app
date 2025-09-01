import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function BankScreen() {
  return (
    <View className="flex-1 bg-gradient-to-br from-purple-50 to-violet-100">
      <View className="pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Bank Accounts</Text>
        <Text className="text-gray-600">Manage your financial accounts</Text>
      </View>

      <View className="flex-1 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/10">
          <View className="items-center py-8">
            <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
              <IconSymbol size={40} name="creditcard.fill" color="#7c3aed" />
            </View>
            <Text className="text-xl font-semibold text-gray-800 mb-2">Bank Integration</Text>
            <Text className="text-gray-600 text-center mb-6">Connect your bank accounts to automatically sync transactions and balances</Text>
            
            <TouchableOpacity className="bg-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-purple-500/25">
              <Text className="text-white font-semibold">Coming Soon</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 