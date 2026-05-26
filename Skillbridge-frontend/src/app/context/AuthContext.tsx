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
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    nombre: string,
    email: string,
    password: string,
    rol: string
  ) => Promise<void>;

  logout: () => void;

  isAuthenticated: boolean;

  loading: boolean;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  // Persistencia automática
  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem('user');

      const token =
        localStorage.getItem('token');

      if (storedUser && token) {

        setUser(JSON.parse(storedUser));

      }

    } catch (error) {

      console.error(
        'Error cargando usuario:',
        error
      );

      localStorage.removeItem('user');
      localStorage.removeItem('token');

    } finally {

      setLoading(false);

    }

  }, []);

  // LOGIN
  const login = async (
    email: string,
    password: string
  ) => {

    try {

      const data =
        await loginService(
          email,
          password
        );

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      setUser(data.user);

    } catch (error) {

      console.error(
        'Error login:',
        error
      );

      throw error;
    }
  };

  // REGISTER
  const register = async (
    nombre: string,
    email: string,
    password: string,
    rol: string
  ) => {

    try {

      const data =
        await registerService(
          nombre,
          email,
          password,
          rol
        );

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      setUser(data.user);

    } catch (error) {

      console.error(
        'Error register:',
        error
      );

      throw error;
    }
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
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}