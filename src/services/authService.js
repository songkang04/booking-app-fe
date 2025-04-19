import api from './axiosConfig';

/**
 * Service xử lý các thao tác xác thực
 */
const authService = {
  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Dữ liệu đăng ký người dùng
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.success) {
        // Lưu token nếu đăng ký thành công
        authService.saveToken(response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đăng nhập
   * @param {Object} credentials - Thông tin đăng nhập
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.success) {
        // Lưu token nếu đăng nhập thành công
        authService.saveToken(response.data.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getCurrentUser: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Chưa đăng nhập');
      }

      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đăng xuất người dùng
   */
  logout: () => {
    localStorage.removeItem('authToken');
  },

  /**
   * Lưu token xác thực
   * @param {string} token - JWT token
   */
  saveToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  /**
   * Lấy token xác thực
   * @returns {string|null} - JWT token hoặc null nếu không có
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  /**
   * Kiểm tra xem người dùng đã đăng nhập chưa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return authService.getToken() !== null;
  },

  /**
   * Gửi yêu cầu quên mật khẩu
   * @param {string} email - Email người dùng
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  forgotPassword: async (email) => {
    try {
      return await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đặt lại mật khẩu
   * @param {Object} resetData - Dữ liệu đặt lại mật khẩu (token, password, confirmPassword)
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  resetPassword: async (resetData) => {
    try {
      return await api.post('/auth/reset-password', resetData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xác thực email
   * @param {string} token - Token xác thực email
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  verifyEmail: async (token) => {
    try {
      return await api.post('/auth/verify-email', { token });
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
