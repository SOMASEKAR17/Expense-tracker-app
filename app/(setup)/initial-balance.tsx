import Button from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Input from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function InitialBalance() {
  const [balance, setBalance] = useState('');
  const router = useRouter();

  const onContinue = () => {
    if (!balance || parseFloat(balance) < 0) {
      Alert.alert('Invalid Balance', 'Please enter a valid initial balance');
      return;
    }
    // Save initial balance logic here
    router.replace('/(setup)/primary-bank' as any);
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100">
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <IconSymbol size={48} name="banknote.fill" color="#10b981" />
          </View>
          <Text className="text-4xl font-bold text-gray-800 mb-3">Set Initial Balance</Text>
          <Text className="text-lg text-gray-600 text-center">Enter your starting bank balance</Text>
        </View>
        
        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/10">
          <Input 
            placeholder="Enter amount (₹)" 
            keyboardType="numeric" 
            value={balance} 
            onChangeText={setBalance} 
            className="mb-6"
          />
          <Button title="Continue" onPress={onContinue} />
        </View>
      </View>
    </View>
  );
} 