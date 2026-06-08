import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'player' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  goals?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string[];
  injuries?: string[];
  gravityScore?: number;
  workoutStreak?: number;
  joinedAt?: string;
  isPro?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; name: string; inviteCode?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@gravitygains.com': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      email: 'admin@gravitygains.com',
      name: 'Admin User',
      role: 'admin',
      gravityScore: 875,
      workoutStreak: 45,
      experienceLevel: 'advanced',
      isPro: true,
      joinedAt: '2024-01-15',
    },
  },
  'player@gravitygains.com': {
    password: 'player123',
    user: {
      id: 'player-1',
      email: 'player@gravitygains.com',
      name: 'Test Player',
      role: 'player',
      gravityScore: 420,
      workoutStreak: 12,
      experienceLevel: 'intermediate',
      isPro: false,
      joinedAt: '2024-03-20',
    },
  },
};

const AUTH_STORAGE_KEY = 'mock_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        const storedMock = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedMock) {
          const parsed = JSON.parse(storedMock);
          Object.assign(MOCK_USERS, parsed);
        }
      } catch { /* ignore */ }
      finally { setIsLoading(false); }
    })();
  }, []);

  const persistMockUsers = async () => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    } catch { /* ignore */ }
  };

  const signIn = async (email: string, password: string) => {
    const record = MOCK_USERS[email.toLowerCase()];
    if (!record || record.password !== password) {
      throw new Error('Invalid email or password');
    }
    const u = record.user;
    setUser(u);
    await AsyncStorage.setItem('user', JSON.stringify(u));
  };

  const signUp = async (data: { email: string; password: string; name: string; inviteCode?: string }) => {
    const email = data.email.toLowerCase();
    if (MOCK_USERS[email]) throw new Error('Email already registered');

    const isAdmin = data.inviteCode?.trim() === 'GRAVITYADMIN';
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: data.name,
      role: isAdmin ? 'admin' : 'player',
      gravityScore: 0,
      workoutStreak: 0,
      experienceLevel: 'beginner',
      isPro: false,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    MOCK_USERS[email] = { password: data.password, user: newUser };
    await persistMockUsers();
    setUser(newUser);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    await AsyncStorage.setItem('user', JSON.stringify(updated));
    const record = MOCK_USERS[user.email.toLowerCase()];
    if (record) record.user = updated;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
