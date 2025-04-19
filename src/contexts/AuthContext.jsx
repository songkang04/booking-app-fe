import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

// Tạo Context
const AuthContext = createContext();

// Hook để sử dụng context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Khởi tạo - kiểm tra nếu người dùng đã đăng nhập
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Kiểm tra xem có token không
        if (authService.getToken()) {
          // Lấy thông tin người dùng từ API
          const response = await authService.getCurrentUser();
          if (response.success) {
            setCurrentUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token không hợp lệ
            authService.logout();
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        authService.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Đăng nhập thất bại' };
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Đăng ký thất bại' };
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Giá trị context
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
