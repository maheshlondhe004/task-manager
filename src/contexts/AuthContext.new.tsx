import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const apiBaseUrl = '/api';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: 'ADMIN' | 'USER') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${apiBaseUrl}/users/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      // Set up automatic token refresh
      setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: 'ADMIN' | 'USER') => {
    try {
      console.log('Sending registration request with role:', role);
      const response = await fetch(`${apiBaseUrl}/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          role 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration response:', data);
      
      // Validate that the server returned the correct role
      if (data.user.role !== role) {
        console.error('Server returned different role than requested:', {
          requested: role,
          received: data.user.role
        });
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      // Set up automatic token refresh
      setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Logout failed on server');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await refreshToken();
          // Set up automatic token refresh
          setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
        } catch (error) {
          console.error('Failed to refresh token on init:', error);
          logout();
        }
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout,
        refreshToken,
        isAuthenticated,
        isAdmin 
      }}
    >
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
