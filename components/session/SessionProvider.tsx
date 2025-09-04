// components/session/SessionProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveSession } from "@/lib/secureStore";
import { getDb } from "@/lib/db";

interface SessionContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<any | null>>; // 👈 added
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  setUser: () => {}, // 👈 default no-op
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fake "session restore"
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email: string, password: string) => {
    const db = await getDb();
    const existing = await db.getFirstAsync<any>(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );
    if (existing) throw new Error("Email already registered.");

    // Insert user (username will be set later)
    const res = await db.runAsync(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, password]
    );

    const insertedId = res.lastInsertRowId as number;
    const newUser = { email, userId: insertedId };
    setUser(newUser);
    await saveSession(newUser);
  };

  const signIn = async (email: string, password: string) => {
    const db = await getDb();
    const row = await db.getFirstAsync<any>(
      `SELECT id, email, password, username FROM users WHERE email = ?`,
      [email]
    );

    if (!row) throw new Error("Account not found. Please sign up.");
    if (row.password !== password) throw new Error("Invalid password.");

    const loggedInUser = {
      email: row.email,
      userId: row.id,
      username: row.username || null,
    };

    setUser(loggedInUser);
    await saveSession(loggedInUser);
  };

  const signOut = async () => {
    setUser(null);
    await saveSession(null);
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, signIn, signUp, signOut, setUser }} // 👈 expose setUser
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
