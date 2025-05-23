import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getStoredUser();
        const rememberMe = authService.isRememberMe();

        if (token && storedUser) {
          // Nếu có token và user data
          if (rememberMe) {
            // Nếu là ghi nhớ đăng nhập, kiểm tra với backend
            try {
              const response = await authService.getCurrentUser();
              if (response.data && response.data.user) {
                setCurrentUser(response.data.user);
                setIsAuthenticated(true);
              } else {
                handleLogout();
              }
            } catch (error) {
              console.error('Token validation failed:', error);
              handleLogout();
            }
          } else {
            // Nếu không ghi nhớ, sử dụng dữ liệu từ sessionStorage
            setCurrentUser(storedUser);
            setIsAuthenticated(true);
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await authService.login({ email, password }, rememberMe);

      if (response.success) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.success) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, register: register, logout: handleLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
