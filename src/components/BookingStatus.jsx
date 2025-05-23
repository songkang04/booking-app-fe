import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaMoneyBill } from 'react-icons/fa';
import { formatCurrency } from '../utils/format';
import ConfirmPaymentButton from './ConfirmPaymentButton';

/**
 * Component hiển thị trạng thái đặt phòng
 * @param {Object} props - Component props
 * @param {Object} props.booking - Thông tin đặt phòng
 * @param {Object} props.homestay - Thông tin homestay
 * @param {string} props.className - className bổ sung
 * @param {Function} props.onPaymentConfirmed - Callback khi thanh toán được xác nhận
 */
const BookingStatus = ({ booking, homestay, className = '', onPaymentConfirmed }) => {
  const [updatedBooking, setUpdatedBooking] = useState(booking);

  // Xử lý khi xác nhận thanh toán thành công
  const handlePaymentConfirmSuccess = (updatedData) => {
    setUpdatedBooking({
      ...updatedBooking,
      paymentStatus: 'WAITING_APPROVAL' // Trạng thái chờ phê duyệt sau khi người dùng xác nhận đã thanh toán
    });

    if (onPaymentConfirmed) {
      onPaymentConfirmed(updatedData);
    }
  };

  // Hàm hiển thị trạng thái đặt phòng
  const renderStatusBadge = () => {
    if (!updatedBooking) return null;

    switch (updatedBooking.status) {
      case 'PENDING':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaHourglassHalf className="mr-1" />
            Đang chờ xác nhận
          </div>
        );
      case 'CONFIRMED':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Đã xác nhận
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" />
            Đã hủy
          </div>
        );
      default:
        return null;
    }
  };

  // Hàm hiển thị trạng thái thanh toán
  const renderPaymentStatusBadge = () => {
    if (!updatedBooking) return null;

    switch (updatedBooking.paymentStatus) {
      case 'PENDING':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaHourglassHalf className="mr-1" />
            Chưa thanh toán
          </div>
        );
      case 'WAITING_APPROVAL':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaHourglassHalf className="mr-1" />
            Chờ xác nhận thanh toán
          </div>
        );
      case 'PAID':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaMoneyBill className="mr-1" />
            Đã thanh toán
          </div>
        );
      default:
        return null;
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Tính số ngày lưu trú
  const calculateNights = () => {
    if (!updatedBooking) return 0;

    const startDate = new Date(updatedBooking.checkInDate);
    const endDate = new Date(updatedBooking.checkOutDate);

    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return nights;
  };

  // Nếu không có thông tin đặt phòng
  if (!updatedBooking) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Không có thông tin đặt phòng</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Thông tin đặt phòng của bạn</h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái đặt phòng:</span>
              {renderStatusBadge()}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái thanh toán:</span>
              {renderPaymentStatusBadge()}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center mb-4">
            <FaCalendarCheck className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <div>
              <p className="text-sm font-medium">Ngày nhận phòng</p>
              <p className="text-base">{formatDate(updatedBooking.checkInDate)}</p>
            </div>
            <div className="mx-4 text-gray-400">→</div>
            <div>
              <p className="text-sm font-medium">Ngày trả phòng</p>
              <p className="text-base">{formatDate(updatedBooking.checkOutDate)}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Số đêm:</span>
              <span className="text-sm font-medium">{calculateNights()} đêm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Số khách:</span>
              <span className="text-sm font-medium">{updatedBooking.guestCount} người</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Tổng tiền:</span>
              <span className="text-base font-medium">
                {formatCurrency(updatedBooking.totalPrice || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Hiển thị nút xác nhận đã thanh toán nếu đặt phòng đã xác nhận và chưa thanh toán */}
          {updatedBooking.status === 'CONFIRMED' &&
           updatedBooking.paymentStatus === 'PENDING' && (
            <div className="mb-4">
              <ConfirmPaymentButton
                booking={updatedBooking}
                onConfirmSuccess={handlePaymentConfirmSuccess}
              />
            </div>
          )}

          {updatedBooking.status === 'CONFIRMED' &&
           updatedBooking.paymentStatus === 'WAITING_APPROVAL' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Cảm ơn bạn đã xác nhận thanh toán. Chúng tôi sẽ kiểm tra và xác nhận trong thời gian sớm nhất.
              </p>
            </div>
          )}

          {updatedBooking.status === 'CONFIRMED' &&
           updatedBooking.paymentStatus === 'PENDING' && (
            <Link
              to={`/profile`}
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-md transition duration-300 mb-2"
            >
              Thanh toán ngay
            </Link>
          )}

          <Link
            to="/profile"
            className="block w-full text-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Xem chi tiết đặt phòng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
