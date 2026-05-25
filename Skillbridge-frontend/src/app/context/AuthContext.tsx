import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react';

import {
  login as loginService,
  register as registerService
} from '../../services/authService';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    nombre: string,
    email: string,
    password: string,
    rol: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);

  // Persistencia automática
  useEffect(() => {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  // LOGIN REAL
  const login = async (
    email: string,
    password: string
  ) => {

    const data = await loginService(email, password);

    localStorage.setItem('token', data.token);

    localStorage.setItem(
      'user',
      JSON.stringify(data.user)
    );

    setUser(data.user);
  };

  // REGISTER REAL
  const register = async (
    nombre: string,
    email: string,
    password: string,
    rol: string
  ) => {

    const data = await registerService(
      nombre,
      email,
      password,
      rol
    );

    localStorage.setItem('token', data.token);

    const userData = {
      nombre,
      email,
      rol
    };

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );

    setUser(userData as User);
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}