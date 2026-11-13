import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const data = response.data.data;
      const userInfo = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        phone: data.phone,
      };
      setToken(data.token);
      setUser(userInfo);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return { success: true, user: userInfo };
    }
    return { success: false, message: response.data.message };
  };

  const register = async (registerData) => {
    const response = await api.post('/auth/register', registerData);
    if (response.data.success) {
      const data = response.data.data;
      const userInfo = {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        phone: data.phone,
      };
      setToken(data.token);
      setUser(userInfo);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      return { success: true, user: userInfo };
    }
    return { success: false, message: response.data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
