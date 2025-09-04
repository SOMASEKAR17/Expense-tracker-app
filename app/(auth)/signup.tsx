import Button from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Input from '@/components/ui/Input';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDb } from '../../lib/db'; // ✅ import your SQLite helper
import { useSession } from "@/components/session/SessionProvider";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signUp } = useSession();

  const onSignup = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    try {
          await signUp(email, password); // 👈 uses SessionProvider
          router.replace('/(setup)/username' as any);
        } catch (e: any) {
          Alert.alert("Login failed", e.message);
        }
    // try {
    //   const db = await getDb();

    //   await db.runAsync(
    //     'INSERT INTO users (email, password) VALUES (?, ?)',
    //     [email.trim(), password.trim()]
    //   );

    //   Alert.alert('Success', 'Account created! You can now log in.');
    //   router.replace('/(setup)/username' as any);
    // } catch (e: any) {
    //   if (e.message.includes('UNIQUE constraint failed')) {
    //     Alert.alert('Error', 'Email already registered');
    //   } else {
    //     Alert.alert('Error', e.message);
    //   }
    // }
  };

  return (
    <LinearGradient
      colors={['#f0fdf4', '#d1fae5']}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <IconSymbol size={48} name="person.badge.plus.fill" color="#10b981" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us to start tracking your expenses
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Input
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.inputSpacingSmall}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.inputSpacingLarge}
          />
          <Button title="Create Account" onPress={onSignup} />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Link href={'/(auth)/login' as any} style={styles.footerLink}>
                Login
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconWrapper: {
    width: 96,
    height: 96,
    backgroundColor: '#dcfce7',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 },
  subtitle: { fontSize: 18, color: '#4b5563', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#10b981',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  inputSpacingSmall: { marginBottom: 16 },
  inputSpacingLarge: { marginBottom: 24 },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerText: { textAlign: 'center', color: '#4b5563' },
  footerLink: { color: '#059669', fontWeight: '600' },
});
