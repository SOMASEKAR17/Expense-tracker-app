// components/session/SessionProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SessionContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fake "session restore"
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // mark session check as done
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email.trim() && password.trim()) {
      setUser({ email: email.trim() });
    } else {
      throw new Error('Please enter valid credentials');
    }
  };

  const signUp = async (email: string, password: string) => {
    if (email.trim() && password.trim()) {
      setUser({ email: email.trim() });
    } else {
      throw new Error('Please enter valid credentials');
    }
  };

  const signOut = async () => {
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
