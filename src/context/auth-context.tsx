import { authService } from '@/services/auth.service';
import { storageService } from '@/services/storage.service';
import { User } from '@/types';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';

const AUTH_STORAGE_KEY = '@kaarya_user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await storageService.getItem<User>(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await authService.login(email, password);
    
    if (result.status === "ok") {
      const userData = result.data;
      setUser(userData);
      await storageService.setItem(AUTH_STORAGE_KEY, userData);
      router.replace('/home');
    } else {
      Alert.alert("Login Failed", result.message);
    }
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const result = await authService.signup(name, email, password);
    
    if (result.status === "ok") {
      const userData = result.data;
      setUser(userData);
      await storageService.setItem(AUTH_STORAGE_KEY, userData);
      router.replace('/home');
    } else {
      Alert.alert("Registration Failed", result.message);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    await storageService.removeItem(AUTH_STORAGE_KEY);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
