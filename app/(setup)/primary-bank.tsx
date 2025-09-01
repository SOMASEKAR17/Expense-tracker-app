import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function PrimaryBank() {
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const router = useRouter();

  const onComplete = () => {
    if (!bankName.trim() || !accountNo.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    // Save bank account logic here
    router.replace('/(tabs)' as any);
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-purple-50 to-violet-100">
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-purple-100 rounded-full items-center justify-center mb-6">
            <IconSymbol size={48} name="building.2.fill" color="#7c3aed" />
          </View>
          <Text className="text-4xl font-bold text-gray-800 mb-3">Add Primary Bank</Text>
          <Text className="text-lg text-gray-600 text-center">Set up your main bank account</Text>
        </View>
        
        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/10">
          <Input 
            placeholder="Bank Name" 
            value={bankName} 
            onChangeText={setBankName} 
            className="mb-4"
          />
          <Input 
            placeholder="Account Number" 
            value={accountNo} 
            onChangeText={setAccountNo} 
            className="mb-6"
          />
          <Button title="Complete Setup" onPress={onComplete} />
        </View>
      </View>
    </View>
  );
} 