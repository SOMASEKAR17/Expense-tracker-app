import Button from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Input from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDb } from '@/lib/db';
import { useSession } from '@/components/session/SessionProvider'; // 👈 import session

export default function Username() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { setUser, user } = useSession(); // 👈 access logged-in user

  const onContinue = async () => {
    if (!username.trim()) {
      Alert.alert('Missing Username', 'Please enter a username');
      return;
    }

    try {
      const db = await getDb();

      if (!user?.userId) {
        Alert.alert('Error', 'No logged-in user found');
        return;
      }

      // ✅ Update username for the logged-in user
      await db.runAsync(
        `UPDATE users SET username = ? WHERE id = ?`,
        [username.trim(), user.userId]
      );

      // You might also want to update session state with the new username
      // (optional, only if you need it later)
      setUser({ ...user, username: username.trim() });

      router.replace('/(setup)/primary-bank' as any);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <LinearGradient
      colors={['#eff6ff', '#e0e7ff']}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <IconSymbol size={48} name="person.fill" color="#3b82f6" />
          </View>
          <Text style={styles.title}>Set Your Username</Text>
          <Text style={styles.subtitle}>
            Choose a username for your account
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.card}>
          <Input
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <Button title="Continue" onPress={onContinue} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    backgroundColor: '#dbeafe',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  input: {
    marginBottom: 24,
  },
});
