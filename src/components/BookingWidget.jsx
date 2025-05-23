import React, { useState } from 'react';
import { FaCalendarAlt, FaUserFriends } from 'react-icons/fa';
import { formatCurrency } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';
import bookingService from '../services/bookingService';

/**
 * Component hiển thị widget đặt phòng
 * @param {Object} props - Component props
 * @param {Object} props.homestay - Thông tin homestay
 * @param {string} props.className - className bổ sung
 */
const BookingWidget = ({ homestay, className = '' }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Tính số đêm
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Kiểm tra ngày hợp lệ
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;

    // Tính số mili giây giữa hai ngày và chuyển thành số ngày
    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return nights > 0 ? nights : 0;
  };

  // Số đêm lưu trú
  const nights = calculateNights();

  // Tính tổng giá
  const calculateTotal = () => {
    // Giá một đêm
    const pricePerNight = homestay.price || 0;

    // Giá cơ bản = số đêm * giá một đêm
    const basePrice = nights * pricePerNight;

    // Phí dịch vụ (giả định 10% giá cơ bản)
    const serviceFee = basePrice * 0.1;

    // Phí dọn dẹp (giả định là cố định)
    const cleaningFee = 200000;

    // Tổng cộng
    return basePrice + serviceFee + cleaningFee;
  };

  // Xử lý khi click nút đặt phòng
  const handleBookNow = () => {
    // Kiểm tra ngày check-in và check-out
    if (!checkIn || !checkOut) {
      setBookingError('Vui lòng chọn ngày nhận phòng và trả phòng');
      return;
    }

    // Kiểm tra số đêm lưu trú
    if (nights <= 0) {
      setBookingError('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }

    // Xóa lỗi nếu có
    setBookingError('');

    // Hiển thị modal xác nhận
    setShowConfirmationModal(true);
  };

  // Xử lý khi xác nhận đặt phòng từ modal
  const handleConfirmBooking = async () => {
    setIsBooking(true);

    try {
      // Tính số ngày đặt phòng
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Kiểm tra thời gian đặt phòng không quá 365 ngày
      if (diffDays > 365) {
        setBookingError('Thời gian đặt phòng không được quá 365 ngày');
        setShowConfirmationModal(false);
        setIsBooking(false);
        return;
      }

      // Tạo object booking data với định dạng ngày tháng chuẩn
      const bookingData = {
        homestayId: parseInt(homestay.id, 10),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: parseInt(guests, 10),
        notes: ''
      };

      console.log('Sending booking data:', bookingData);
      // Gọi API tạo booking
      const response = await bookingService.createBooking(bookingData);
      console.log('Response from booking creation:', response);

      // Nếu tạo booking thành công
      if (response && response.success) {
        // Lấy booking ID từ phản hồi
        const bookingId = response.data.id;
        setBookingId(bookingId);
        console.log('Booking created successfully with ID:', bookingId);

        // Đóng modal xác nhận và chuyển hướng đến trang thông tin đặt phòng
        setShowConfirmationModal(false);

        // Hiển thị thông báo thành công
        alert('Đặt phòng thành công! Vui lòng tiến hành thanh toán để hoàn tất.');

        // Chuyển hướng đến trang thông tin đặt phòng
        navigate('/profile');
      } else {
        // Hiển thị lỗi từ server
        console.error('Error in booking response:', response);
        setBookingError(response?.message || 'Không thể đặt phòng. Vui lòng thử lại sau.');
        setShowConfirmationModal(false);
      }
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error);

      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        // Lỗi từ server với response
        const serverMessage = error.response.data?.message || 'Lỗi máy chủ khi xử lý đặt phòng';
        console.error('Server error details:', error.response.data);

        // Xử lý cụ thể cho lỗi totalPrice
        if (error.response.data?.message?.includes('Out of range value for column') &&
            error.response.data?.message?.includes('totalPrice')) {
          setBookingError('Thời gian đặt phòng quá dài dẫn đến tổng giá trị vượt quá giới hạn. Vui lòng đặt phòng với thời gian ngắn hơn.');
        } else {
          setBookingError(serverMessage);
        }
      } else if (error.request) {
        // Không nhận được response từ server
        console.error('No response received:', error.request);
        setBookingError('Không nhận được phản hồi từ máy chủ, vui lòng thử lại sau.');
      } else {
        // Lỗi không xác định
        setBookingError(error.message || 'Đã xảy ra lỗi không xác định khi đặt phòng.');
      }

      // Đóng modal xác nhận trong mọi trường hợp lỗi
      setShowConfirmationModal(false);
    } finally {
      setIsBooking(false);
    }
  };

  // Không cần xử lý thanh toán tại đây nữa

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-6 ${className}`}>
      <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
        {formatCurrency(homestay.price)}
        <span className="text-sm font-normal text-gray-600 dark:text-gray-400"> / đêm</span>
      </div>

      {/* Đánh giá */}
      <div className="flex items-center mb-4">
        <span className="flex items-center">
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">{homestay.rating || '4.5'}</span>
        </span>
        <span className="mx-1.5 text-gray-500 dark:text-gray-400">•</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{homestay.reviewCount || '0'} đánh giá</span>
      </div>

      {/* Form đặt phòng */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
        {/* Ngày nhận/trả phòng */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
          <div className="p-3 bg-gray-50 dark:bg-gray-800">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">NHẬN PHÒNG</label>
            <div className="flex items-center">
              <FaCalendarAlt className="text-amber-500 dark:text-amber-400 mr-2" />
              <input
                type="date"
                className="w-full border-0 focus:ring-0 p-0 text-sm bg-transparent text-gray-900 dark:text-white"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setBookingError('');
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">TRẢ PHÒNG</label>
            <div className="flex items-center">
              <FaCalendarAlt className="text-amber-500 dark:text-amber-400 mr-2" />
              <input
                type="date"
                className="w-full border-0 focus:ring-0 p-0 text-sm bg-transparent text-gray-900 dark:text-white"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setBookingError('');
                }}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Số lượng khách */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">KHÁCH</label>
          <div className="flex items-center">
            <FaUserFriends className="text-amber-500 dark:text-amber-400 mr-2" />
            <select
              className="w-full border-0 focus:ring-0 p-0 text-sm bg-transparent text-gray-900 dark:text-white appearance-none cursor-pointer"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {num} khách
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {bookingError && (
        <div className="text-red-500 text-sm mb-4">
          {bookingError}
        </div>
      )}

      {/* Nút đặt phòng */}
      <button
        className={`w-full py-3 rounded-lg font-medium text-white
          ${isBooking
            ? 'bg-indigo-500/70 cursor-wait'
            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'}`}
        onClick={handleBookNow}
        disabled={isBooking}
      >
        {isBooking ? 'Đang xử lý...' : 'Đặt phòng'}
      </button>

      {/* Thông tin giá */}
      {nights > 0 && (
        <div className="mt-6 space-y-3">
          <div className="text-base font-medium text-gray-900 dark:text-white">Chi tiết giá</div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              {formatCurrency(homestay.price)} x {nights} đêm
            </div>
            <div className="text-gray-900 dark:text-white">{formatCurrency(homestay.price * nights)}</div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-700 dark:text-gray-300">Phí dịch vụ</div>
            <div className="text-gray-900 dark:text-white">{formatCurrency(homestay.price * nights * 0.1)}</div>
          </div>

          <div className="flex justify-between text-sm">
            <div className="text-gray-700 dark:text-gray-300">Phí dọn dẹp</div>
            <div className="text-gray-900 dark:text-white">{formatCurrency(200000)}</div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 flex justify-between font-bold">
            <div className="text-gray-900 dark:text-white">Tổng</div>
            <div className="text-indigo-600 dark:text-indigo-400">{formatCurrency(calculateTotal())}</div>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            Bạn chưa bị trừ tiền
          </div>
        </div>
      )}

      {/* Modal xác nhận đặt phòng */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmBooking}
        isProcessing={isBooking}
        bookingDetails={{
          homestay,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCount: guests,
          nights,
          totalPrice: calculateTotal(),
        }}
      />

      {/* Đã loại bỏ Modal thanh toán */}
    </div>
  );
};

export default BookingWidget;
