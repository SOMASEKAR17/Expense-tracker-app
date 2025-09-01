import Button from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Input from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function Username() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const onContinue = () => {
    if (!username.trim()) {
      Alert.alert('Missing Username', 'Please enter a username');
      return;
    }
    // Save username logic here
    router.replace('/(setup)/initial-balance' as any);
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
            <IconSymbol size={48} name="person.fill" color="#3b82f6" />
          </View>
          <Text className="text-4xl font-bold text-gray-800 mb-3">Set Your Username</Text>
          <Text className="text-lg text-gray-600 text-center">Choose a username for your account</Text>
        </View>
        
        <View className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/10">
          <Input 
            placeholder="Enter username" 
            value={username} 
            onChangeText={setUsername} 
            className="mb-6"
          />
          <Button title="Continue" onPress={onContinue} />
        </View>
      </View>
    </View>
  );
} 