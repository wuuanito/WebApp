import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay tokens guardados y validar la sesión
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (accessToken && savedUser) {
        try {
          // Verificar si el token sigue siendo válido
          await apiService.verifyToken();
          setUser(JSON.parse(savedUser));
        } catch (error) {
          // Token inválido, limpiar datos
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      console.log('Intentando login con:', credentials);
      const response = await apiService.login(credentials);
      console.log('Respuesta del servidor:', response);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && (response.status === 200 || response.success || response.data)) {
        // Manejar diferentes formatos de respuesta
        let userData, accessToken, refreshToken;
        
        if (response.data && response.data.user) {
          // Formato: { status: 200, message: 'Login successful', data: { user, accessToken, refreshToken } }
          ({ user: userData, accessToken, refreshToken } = response.data);
        } else if (response.success) {
          // Formato: { success: true, data: { user, accessToken, refreshToken } }
          ({ user: userData, accessToken, refreshToken } = response.data);
        } else {
          // Formato directo: { user, accessToken, refreshToken }
          userData = response.user;
          accessToken = response.accessToken;
          refreshToken = response.refreshToken;
        }
        
        // Guardar tokens y datos del usuario
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        console.log('Login exitoso, usuario:', userData);
        return { success: true, user: userData };
      } else {
        console.error('Respuesta inesperada del servidor:', response);
        throw new Error(response.message || 'Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message || 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Intentar hacer logout en el servidor
      await apiService.logout();
    } catch (error) {
      console.error('Error en logout del servidor:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado del servidor
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  };

  const refreshAuthToken = async () => {
    try {
      const response = await apiService.refreshToken();
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      await logout();
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    refreshAuthToken,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};