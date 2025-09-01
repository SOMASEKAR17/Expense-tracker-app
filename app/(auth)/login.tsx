import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useSession } from '../../components/session/SessionProvider';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
    const { signIn } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    
    
    const onLogin = async () => {
    try {
    await signIn(email.trim(), password);
    router.replace('/(setup)/username' as any);
    } catch (e: any) {
    Alert.alert('Login failed', e.message);
    }
    };

    return (
        <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
            <View className="flex-1 justify-center px-8">
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
                        <IconSymbol size={48} name="person.circle.fill" color="#3b82f6" />
                    </View>
                    <Text className="text-4xl font-bold text-gray-800 mb-3">Welcome Back</Text>
                    <Text className="text-lg text-gray-600 text-center">Sign in to your account</Text>
                </View>
                
                <View className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/10">
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
                    <Button title="Sign In" onPress={onLogin} />
                    
                    {/* Demo Credentials */}
                    <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Text className="text-blue-800 text-sm text-center font-medium mb-1">Demo Credentials</Text>
                        <Text className="text-blue-600 text-xs text-center">Email: demo@example.com</Text>
                        <Text className="text-blue-600 text-xs text-center">Password: password123</Text>
                    </View>
                    
                    <View className="mt-6 pt-6 border-t border-gray-100">
                        <Text className="text-center text-gray-600">
                            No account? <Link href={"/(auth)/signup" as any} className="text-primary-600 font-semibold">Sign up</Link>
                        </Text>
                    </View>
                </View>
            </View>
        </View>
        );
        }