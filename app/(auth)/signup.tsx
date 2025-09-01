import { useSession } from '@/components/session/SessionProvider';
import Button from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Input from '@/components/ui/Input';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function Signup() {
  const { signUp } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  
  const onSignup = async () => {
  try {
  await signUp(email.trim(), password);
  router.replace('/(setup)/username' as any);
  } catch (e: any) {
  Alert.alert('Signup failed', e.message);
  }
  };
  return (
    <View className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100">
        <View className="flex-1 justify-center px-8">
            <View className="items-center mb-8">
                <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
                    <IconSymbol size={48} name="person.badge.plus.fill" color="#10b981" />
                </View>
                <Text className="text-4xl font-bold text-gray-800 mb-3">Create Account</Text>
                <Text className="text-lg text-gray-600 text-center">Join us to start tracking your expenses</Text>
            </View>
            
            <View className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/10">
                <Input 
                    placeholder="Email address" 
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                    value={email} 
                    onChangeText={setEmail} 
                    className="mb-4"
                />
                <Input 
                    placeholder="Password" 
                    secureTextEntry 
                    value={password} 
                    onChangeText={setPassword} 
                    className="mb-6"
                />
                <Button title="Create Account" onPress={onSignup} />
                
                {/* Demo Credentials */}
                <View className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Text className="text-green-800 text-sm text-center font-medium mb-1">Demo Credentials</Text>
                    <Text className="text-green-600 text-xs text-center">Email: demo@example.com</Text>
                    <Text className="text-green-600 text-xs text-center">Password: password123</Text>
                </View>
                
                <View className="mt-6 pt-6 border-t border-gray-100">
                    <Text className="text-center text-gray-600">
                        Already have an account? <Link href={"/(auth)/login" as any} className="text-primary-600 font-semibold">Login</Link>
                    </Text>
                </View>
            </View>
        </View>
    </View>
    );
    }