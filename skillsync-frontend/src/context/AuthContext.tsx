import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthResponse } from '../model/Auth';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('skillsync_token');
    const storedUser = localStorage.getItem('skillsync_user');
    if (storedToken && storedUser) {
      const parsedUser: AuthResponse = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (response: AuthResponse) => {
    localStorage.setItem('skillsync_token', response.token);
    localStorage.setItem('skillsync_user', JSON.stringify(response));
    setToken(response.token);
    setUser(response);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
  };

  const logout = () => {
    localStorage.removeItem('skillsync_token');
    localStorage.removeItem('skillsync_user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'ADMIN',
      loading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
