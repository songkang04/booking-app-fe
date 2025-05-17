import api from './axiosConfig';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';
const REMEMBER_ME_KEY = 'remember_me';

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
   * @param {boolean} rememberMe - Có ghi nhớ đăng nhập không
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', credentials);

      if (response.success) {
        // Xóa dữ liệu cũ trước khi lưu mới
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);

        if (rememberMe) {
          // Nếu ghi nhớ đăng nhập, lưu vào localStorage
          localStorage.setItem(TOKEN_KEY, response.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
          localStorage.setItem(REMEMBER_ME_KEY, 'true');
        } else {
          // Nếu không ghi nhớ, lưu vào sessionStorage
          sessionStorage.setItem(TOKEN_KEY, response.data.token);
          sessionStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
          localStorage.removeItem(REMEMBER_ME_KEY);
        }
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
    // Xóa tất cả dữ liệu đăng nhập
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
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
    // Ưu tiên lấy từ localStorage (ghi nhớ đăng nhập)
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) return localToken;

    // Nếu không có trong localStorage, thử lấy từ sessionStorage
    return sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Lấy thông tin user từ storage phù hợp
   */
  getStoredUser: () => {
    // Ưu tiên lấy từ localStorage (ghi nhớ đăng nhập)
    const localUser = localStorage.getItem(USER_KEY);
    if (localUser) return JSON.parse(localUser);

    // Nếu không có trong localStorage, thử lấy từ sessionStorage
    const sessionUser = sessionStorage.getItem(USER_KEY);
    return sessionUser ? JSON.parse(sessionUser) : null;
  },

  /**
   * Kiểm tra trạng thái remember me
   */
  isRememberMe: () => {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
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
  },

  /**
   * check token in localStorage
   * @returns {boolean} - true nếu token hợp lệ, false nếu không
   */
  isTokenValid: () => {
    const token = authService.getToken();
    if (!token) {
      return false;
    }

    // Kiểm tra tính hợp lệ của token (ví dụ: kiểm tra thời gian hết hạn)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp < Date.now() / 1000;
    return !isExpired;
  },
};

export default authService;
