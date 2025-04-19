import api from './axiosConfig';

/**
 * Service xử lý các thao tác liên quan đến homestay
 */
const homestayService = {
  /**
   * Tìm kiếm homestay theo các tham số lọc
   * @param {Object} params - Các tham số tìm kiếm
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  searchHomestays: async (params = {}) => {
    try {
      const response = await api.get('/homestays/search', { params });
      return response; // Giữ nguyên cấu trúc phản hồi từ API
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết của một homestay
   * @param {string} id - ID của homestay
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getHomestayById: async (id) => {
    try {
      return await api.get(`/homestays/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách homestay tương tự
   * @param {string} id - ID của homestay
   * @param {number} limit - Số lượng homestay muốn lấy
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getSimilarHomestays: async (id, limit = 4) => {
    try {
      return await api.get(`/homestays/${id}/similar`, { params: { limit } });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách đánh giá của một homestay
   * @param {string} homestayId - ID của homestay
   * @param {Object} params - Các tham số tìm kiếm (page, limit, minRating, maxRating)
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getHomestayReviews: async (homestayId, params = {}) => {
    try {
      return await api.get(`/reviews/homestay/${homestayId}`, { params });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách homestay nổi bật
   * @param {number} limit - Số lượng homestay muốn lấy
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  getFeaturedHomestays: async (limit = 6) => {
    try {
      return await api.get('/homestays/featured', { params: { limit } });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đánh giá một homestay
   * @param {Object} data - Dữ liệu đánh giá (homestayId, rating, comment)
   * @returns {Promise} - Promise chứa kết quả từ API
   */
  createReview: async (data) => {
    try {
      return await api.post('/reviews', data);
    } catch (error) {
      throw error;
    }
  }
};

export default homestayService;
