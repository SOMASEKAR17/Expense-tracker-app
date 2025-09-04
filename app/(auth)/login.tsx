import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { getDb } from '../../lib/db';   // ✅ import your db helper
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useSession } from "@/components/session/SessionProvider";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useSession();


  const handleLogin = async () => {
    try {
      await signIn(email, password); // 👈 uses SessionProvider
      router.replace("/(tabs)"); // ✅ move to dashboard/tabs
    } catch (e: any) {
      Alert.alert("Login failed", e.message);
    }
  };

  const onLogin = async () => {
    handleLogin()
    // if (!email.trim() || !password.trim()) {
    //   Alert.alert('Error', 'Please fill in all fields');
    //   return;
    // }

    // try {
    //   const db = await getDb();
    //   const result = await db.getFirstAsync(
    //     'SELECT * FROM users WHERE email = ? AND password = ?',
    //     [email.trim(), password.trim()]
    //   );

    //   if (result) {
    //     // ✅ user exists, login successful
    //     router.replace('/(tabs)' as any);
    //   } else {
    //     Alert.alert('Login failed', 'Invalid email or password');
    //   }
    // } catch (e: any) {
    //   Alert.alert('Error', e.message);
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol size={48} name="person.circle.fill" color="#3b82f6" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Input
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <Button title="Sign In" onPress={onLogin} />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              No account?{' '}
              <Link href={"/(auth)/signup" as any} style={styles.link}>
                Sign up
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF2FF' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: {
    width: 96, height: 96, backgroundColor: '#DBEAFE',
    borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#4B5563', textAlign: 'center' },
  card: {
    backgroundColor: 'white', borderRadius: 16, padding: 24,
    shadowColor: '#3b82f6', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  input: { marginBottom: 16 },
  footer: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerText: { textAlign: 'center', color: '#4B5563' },
  link: { color: '#059669', fontWeight: '600' },
});
