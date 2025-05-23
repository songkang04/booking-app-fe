import api from './axiosConfig';

/**
 * Service for handling booking-related API calls
 */
const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - The booking data
   * @returns {Promise} - Promise with booking response
   */
  createBooking: async (bookingData) => {
    try {
      console.log('Creating booking with data:', bookingData);
      // Thêm validation trước khi gửi đi
      if (!bookingData.homestayId || !bookingData.checkInDate || !bookingData.checkOutDate || !bookingData.guestCount) {
        throw new Error('Dữ liệu đặt phòng không đúng định dạng');
      }

      // Lưu ý: axios interceptor đã trả về data, không cần .data nữa
      const response = await api.post('/bookings', bookingData);
      console.log('Booking creation response:', response);

      // Điều chỉnh response để đảm bảo tương thích với BookingWidget
      // BookingWidget đang kỳ vọng response.success và response.data
      return {
        success: true,
        data: response,
        message: response.message || 'Đặt phòng thành công'
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received, request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  /**
   * Get a booking by ID
   * @param {string} bookingId - The booking ID
   * @returns {Promise} - Promise with booking details
   */
  getBookingById: async (bookingId) => {
    try {
      console.log('Getting booking details for ID:', bookingId);
      const response = await api.get(`/bookings/${bookingId}`);
      console.log('Booking details response:', response);

      // Điều chỉnh response format
      return {
        success: true,
        data: response,
        message: 'Lấy thông tin đặt phòng thành công'
      };
    } catch (error) {
      console.error('Error getting booking details:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Get all bookings for the current user
   * @returns {Promise} - Promise with user's bookings
   */
  getUserBookings: async () => {
    try {
      console.log('Getting user bookings');
      const response = await api.get('/bookings/user');
      console.log('User bookings response:', response);

      // Chi tiết response để debug
      console.log('Response type:', typeof response);
      console.log('Response structure:', Object.keys(response));

      // Kiểm tra cấu trúc dữ liệu và xử lý tương ứng
      let processedData = [];

      if (Array.isArray(response)) {
        processedData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        processedData = response.data;
      } else if (response && Array.isArray(response.bookings)) {
        processedData = response.bookings;
      } else {
        console.warn('Response format not recognized:', response);
        // Trả về response gốc nếu không nhận dạng được cấu trúc
        processedData = response;
      }

      // Điều chỉnh response format
      return {
        success: true,
        data: processedData,
        message: 'Lấy danh sách đặt phòng thành công'
      };
    } catch (error) {
      console.error('Error getting user bookings:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Verify a booking using the verification token
   * @param {string} token - The verification token
   * @returns {Promise} - Promise with verification result
   */
  verifyBooking: async (token) => {
    try {
      console.log('Verifying booking with token:', token);
      const response = await api.get(`/bookings/verify/${token}`);
      console.log('Booking verification response:', response);

      return {
        success: true,
        data: response,
        message: response.message || 'Xác thực đặt phòng thành công'
      };
    } catch (error) {
      console.error('Error verifying booking:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Check if the current user has already booked a specific homestay
   * @param {number} homestayId - The ID of the homestay to check
   * @returns {Promise} - Promise with booking info if exists
   */
  checkUserHomestayBooking: async (homestayId) => {
    try {
      console.log('Checking if user has booked homestay:', homestayId);
      const response = await api.get('/bookings/user');
      console.log('User bookings response:', response);

      // Filter bookings for this specific homestay
      let userBookings = Array.isArray(response) ? response : [];

      // Find active bookings for this homestay (PENDING, CONFIRMED)
      const activeBooking = userBookings.find(booking =>
        booking.homestayId === parseInt(homestayId) &&
        ['PENDING', 'CONFIRMED'].includes(booking.status)
      );

      return {
        success: true,
        hasBooking: !!activeBooking,
        bookingDetails: activeBooking || null
      };
    } catch (error) {
      console.error('Error checking user homestay booking:', error);
      // Return false instead of throwing error to avoid breaking the UI
      return {
        success: false,
        hasBooking: false,
        bookingDetails: null,
        error: error.message || 'Không thể kiểm tra thông tin đặt phòng'
      };
    }
  },

  /**
   * Confirm user has made payment for a booking
   * @param {string} bookingId - The booking ID
   * @returns {Promise} - Promise with booking update response
   */
  confirmUserPayment: async (bookingId) => {
    try {
      console.log('Confirming user payment for booking ID:', bookingId);
      const response = await api.post(`/bookings/${bookingId}/payment-confirmation`);
      console.log('Payment confirmation response:', response);

      return {
        success: true,
        data: response,
        message: 'Xác nhận thanh toán thành công. Chúng tôi sẽ kiểm tra và phê duyệt đặt phòng của bạn.'
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      throw error;
    }
  },

  /**
   * Get list of bookings with payment waiting for approval (Admin only)
   * @returns {Promise} - Promise with list of bookings waiting for payment approval
   */
  getPaymentApprovalList: async () => {
    try {
      console.log('Getting payment approval list');
      const response = await api.get('/admin/bookings/payment-approvals');
      console.log('Payment approval list response:', response);

      // Kiểm tra cấu trúc dữ liệu và xử lý tương ứng
      let processedData = [];

      if (Array.isArray(response)) {
        processedData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        processedData = response.data;
      } else {
        console.warn('Response format not recognized:', response);
        // Trả về response gốc nếu không nhận dạng được cấu trúc
        processedData = response;
      }

      return {
        success: true,
        data: processedData,
        message: 'Lấy danh sách thanh toán chờ duyệt thành công'
      };
    } catch (error) {
      console.error('Error getting payment approval list:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
      throw error;
    }
  }
};

export default bookingService;
