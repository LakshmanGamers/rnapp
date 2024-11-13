import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://yourapi.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.token) {
        setUser(result.user);
        await AsyncStorage.setItem('userToken', result.token);
      }
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch('https://yourapi.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userToken');
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUser(token);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
