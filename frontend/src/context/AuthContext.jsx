import React, { createContext, useState, useEffect } from 'react';
import { setStorageUser } from '../utils/StorageManager';

export const AuthContext = createContext();

// Use 127.0.0.1 instead of localhost to match backend
const API_URL = 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
      setAuthChecked(true);
      setStorageUser(null); // Clear storage user when no token
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        // CRITICAL: Set storage user ID
        console.log('🔑 Setting storage for user:', userData.id, userData.username);
        setStorageUser(userData.id);

      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);

      // Fetch user will set storage user
      await fetchUser(data.access_token);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, username, password, fullName) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          full_name: fullName
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      return await login(username, password);
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('🚪 Logging out, clearing storage for user:', user?.id);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    
    // CRITICAL: Clear storage user
    setStorageUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        authChecked
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};