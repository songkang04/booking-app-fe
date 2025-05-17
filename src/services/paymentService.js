import api from './axiosConfig';

/**
 * Service for handling payment-related API calls
 */
const paymentService = {
  /**
   * Khởi tạo thanh toán cho đặt phòng
   * @param {string} bookingId - ID của đặt phòng
   * @returns {Promise} - Promise với thông tin thanh toán
   */
  initiatePayment: async (bookingId) => {
    try {
      console.log('Initiating payment for booking ID:', bookingId);
      const response = await api.post(`/bookings/${bookingId}/payments`);
      console.log('Payment initiation response:', response);

      // Thêm format đồng nhất cho response
      return {
        success: true,
        data: response,
        message: 'Khởi tạo thanh toán thành công'
      };
    } catch (error) {
      console.error("Payment initiation error:", error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Lấy thông tin thanh toán của đặt phòng
   * @param {string} bookingId - ID của đặt phòng
   * @returns {Promise} - Promise với thông tin thanh toán
   */
  getPaymentInfo: async (bookingId) => {
    try {
      console.log('Getting payment info for booking ID:', bookingId);
      const response = await api.get(`/bookings/${bookingId}/payments`);
      console.log('Payment info response:', response);

      // Thêm format đồng nhất cho response
      return {
        success: true,
        data: response,
        message: 'Lấy thông tin thanh toán thành công'
      };
    } catch (error) {
      console.error("Get payment info error:", error);
      if (error.response) {
        console.error('Server error details:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Xác nhận thanh toán (chỉ dành cho admin)
   * @param {string} bookingId - ID của đặt phòng
   * @param {Object} verificationData - Thông tin xác nhận thanh toán
   * @returns {Promise} - Promise với thông tin đặt phòng đã cập nhật
   */
  verifyPayment: async (bookingId, verificationData) => {
    try {
      console.log('Verifying payment for booking ID:', bookingId, 'with data:', verificationData);
      const response = await api.post(`/bookings/${bookingId}/payments/verify`, verificationData);
      console.log('Payment verification response:', response);

      // Thêm format đồng nhất cho response
      return {
        success: true,
        data: response,
        message: 'Xác nhận thanh toán thành công'
      };
    } catch (error) {
      console.error("Payment verification error:", error);
      if (error.response) {
        console.error('Server error details:', error.response.data);
      }
      throw error;
    }
  }
};

export default paymentService;
