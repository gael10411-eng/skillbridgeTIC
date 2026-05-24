import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'mentor') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: '1',
      name: 'Ana García',
      email: email,
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
    });
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'mentor') => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser({
      id: Math.random().toString(),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
