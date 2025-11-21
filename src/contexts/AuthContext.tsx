import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'superadmin' | 'instructor' | 'student' | null;

interface User {
  username: string;
  role: Role;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role: Role, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (allowedRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as Role;
    const username = localStorage.getItem('username') || '';

    if (token && role) {
      setUser({ token, role, username });
    }
  }, []);

  const login = (token: string, role: Role, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role || '');
    localStorage.setItem('username', username);
    setUser({ token, role, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
  };

  const hasRole = (allowedRoles: Role[]) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
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
