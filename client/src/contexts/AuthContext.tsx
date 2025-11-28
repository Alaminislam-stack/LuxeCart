import React, { createContext, useContext, useState, useEffect } from "react";
import { adminApi, authApi } from "../services/api";
import type { User, LoginCredentials, RegisterData } from "../types";

interface AuthContextType {
  user: User | null;
  admin: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  adminLogout: () => Promise<void>;
  adminLogin: (credentials: LoginCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authApi.getProfile();
      // Server returns { success, message, user: {...} }
      const userData = (response as any).user || response.data;
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    if (response.success && response.user) {
      setUser(response.user);
    }
  };

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    if (response.success && response.user) {
      setUser(response.user);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const adminLogin = async (credentials: LoginCredentials) => {
    const response = await adminApi.login(credentials);
    if (response.success && response.admin) {
      setAdmin(response.admin);
    }
  };

  const adminLogout = async () => {
    try {
      await adminApi.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
        adminLogout,
        adminLogin,
        admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
