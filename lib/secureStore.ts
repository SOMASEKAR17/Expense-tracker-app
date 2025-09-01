import React, { createContext, useContext, useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { getDb } from './db';
import { clearSession, getSession, saveSession } from './secureStore';

interface AuthState {
    userId: number | null;
    email: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    }

const Ctx = createContext<AuthState | undefined>(undefined);


export const useAuth = () => {
const v = useContext(Ctx);
if (!v) throw new Error('useAuth must be used inside SessionProvider');
return v;
};


export function SessionProvider({ children }: { children?: React.ReactNode }) {
    const [userId, setUserId] = useState<number | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const segments = useSegments();
    const router = useRouter();
    
    
    useEffect(() => {
    (async () => {
    const s = await getSession();
    if (s?.userId) {
    setUserId(s.userId);
    setEmail(s.email);
    }
    })();
    }, []);


    const signIn = async (email: string, _password: string) => {
        const db = await getDb();
        const row = await db.getFirstAsync<any>(`SELECT id, email FROM users WHERE email = ?`, [email]);
        if (!row) throw new Error('Account not found. Please sign up.');
        setUserId(row.id);
        setEmail(row.email);
        await saveSession({ email: row.email, userId: row.id });
        };


        const signUp = async (email: string, _password: string) => {
            const db = await getDb();
            const existing = await db.getFirstAsync<any>(`SELECT id FROM users WHERE email = ?`, [email]);
            if (existing) throw new Error('Email already registered.');
            const res = await db.runAsync(`INSERT INTO users (email, name) VALUES (?, ?)`, [email, null]);
            const insertedId = res.lastInsertRowId as number;
            setUserId(insertedId);
            setEmail(email);
            await saveSession({ email, userId: insertedId });
            };

            const signOut = async () => {
                setUserId(null);
                setEmail(null);
                await clearSession();
                };
                
                
                const value: AuthState = { userId, email, signIn, signUp, signOut };
                
                
                return (
                    <Ctx.Provider value={value}>
                        <Slot />
                    </Ctx.Provider>
                );
                }