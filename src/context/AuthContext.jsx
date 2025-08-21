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
      const sessionTimestamp = localStorage.getItem('sessionTimestamp');
      
      if (accessToken && savedUser) {
        try {
          // Verificar si la sesión no ha expirado (24 horas)
          const now = Date.now();
          const sessionAge = now - parseInt(sessionTimestamp || '0');
          const maxSessionAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
          
          if (sessionAge > maxSessionAge) {
            throw new Error('Sesión expirada por tiempo');
          }
          
          // Intentar verificar el token con el servidor
          try {
            await apiService.verifyToken();
            // Si la verificación es exitosa, restaurar usuario
            setUser(JSON.parse(savedUser));
          } catch (verifyError) {
            console.warn('No se pudo verificar el token con el servidor, pero manteniendo sesión local:', verifyError.message);
            // Si el servidor no está disponible pero la sesión es reciente, mantener la sesión
            if (sessionAge < 60 * 60 * 1000) { // Menos de 1 hora
              setUser(JSON.parse(savedUser));
            } else {
              throw new Error('No se puede verificar sesión antigua sin conexión al servidor');
            }
          }
        } catch (error) {
          console.log('Limpiando sesión:', error.message);
          // Token inválido o sesión expirada, limpiar datos
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('sessionTimestamp');
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
      // Manejar tanto {success: true, data: {...}} como {status: 200, message: '...', data: {...}}
      const isSuccessful = (response.success === true) || (response.status === 200 && response.message === 'Login successful');
      
      if (response && isSuccessful && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        // Guardar tokens, datos del usuario y timestamp de la sesión
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('sessionTimestamp', Date.now().toString());
        
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
      localStorage.removeItem('sessionTimestamp');
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