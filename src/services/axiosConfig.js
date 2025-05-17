import axios from 'axios';
import { toast } from 'react-toastify';

// Lấy URL API từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'user_token';

// Tạo instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout mặc định 10 giây
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Thêm interceptor request để thêm token xác thực vào header nếu có
api.interceptors.request.use(
  (config) => {
    // Ưu tiên lấy token từ localStorage
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response để xử lý lỗi chung
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response && response.data) {
      // Hiển thị lỗi từ server nếu có
      if (response.status === 401) {
        // Lỗi xác thực
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        // Xóa token từ cả hai storage
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
      } else if (response.status === 403) {
        // Lỗi quyền truy cập
        toast.error('Bạn không có quyền thực hiện hành động này');
      } else {
        // Các lỗi khác
        const { message } = response.data;
        toast.error(message || 'Đã xảy ra lỗi, vui lòng thử lại sau');
      }
    } else {
      // Lỗi không có response (network error)
      toast.error('Không thể kết nối đến máy chủ');
    }

    return Promise.reject(error);
  }
);

export default api;
