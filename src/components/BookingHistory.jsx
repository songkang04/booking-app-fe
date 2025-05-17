import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FaCalendar, FaInfoCircle, FaRegMoneyBillAlt, FaEllipsisH, FaCheckCircle, FaHourglass, FaTimes } from 'react-icons/fa';
import { formatCurrency } from '../utils/format';
import bookingService from '../services/bookingService';
import ConfirmPaymentButton from './ConfirmPaymentButton';

/**
 * Component hiển thị lịch sử đặt phòng và giao dịch
 */
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Fetch dữ liệu đặt phòng
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getUserBookings();
        console.log('BookingHistory - User bookings response:', response);

        if (response.success) {
          // Xử lý cấu trúc dữ liệu API (kiểm tra các cấp lồng nhau có thể có)
          let bookingsData = [];

          if (response.data && Array.isArray(response.data)) {
            bookingsData = response.data;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            bookingsData = response.data.data;
          } else if (response.data && typeof response.data === 'object') {
            // Trường hợp API trả về object mà không phải array
            console.log('API returned object instead of array, trying to extract data');

            if (response.data.bookings && Array.isArray(response.data.bookings)) {
              bookingsData = response.data.bookings;
            } else {
              console.warn('No valid booking array found in API response');
            }
          }

          // Sắp xếp theo thời gian gần nhất
          const sortedBookings = bookingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          console.log('Sorted bookings:', sortedBookings);
          setBookings(sortedBookings);
        } else {
          throw new Error(response.message || 'Không thể tải lịch sử đặt phòng');
        }
      } catch (err) {
        console.error('Lỗi khi tải lịch sử đặt phòng:', err);
        setError('Không thể tải lịch sử đặt phòng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Toggle hiển thị chi tiết đặt phòng
  const toggleExpand = (bookingId) => {
    setExpanded(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  // Format ngày giờ
  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi });
  };

  // Xử lý khi xác nhận thanh toán thành công
  const handlePaymentConfirmSuccess = (bookingId, updatedData) => {
    setBookings(prev => prev.map(booking =>
      booking.id === bookingId
        ? { ...booking, paymentStatus: 'WAITING_APPROVAL' }
        : booking
    ));

    // Hiển thị thông báo thành công
    alert('Xác nhận thanh toán thành công! Chúng tôi sẽ kiểm tra và phê duyệt trong thời gian sớm nhất.');
  };

  // Format trạng thái đặt phòng
  const renderBookingStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
            <FaHourglass className="mr-1" />
            Chờ xác nhận
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Đã xác nhận
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
            <FaTimes className="mr-1" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Format trạng thái thanh toán
  const renderPaymentStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            <FaHourglass className="mr-1" />
            Chưa thanh toán
          </span>
        );
      case 'WAITING_APPROVAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
            <FaHourglass className="mr-1" />
            Chờ xác nhận thanh toán
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Đã thanh toán
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
            <FaRegMoneyBillAlt className="mr-1" />
            Đã hoàn tiền
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">Đang tải lịch sử đặt phòng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-center text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tải lại
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-center text-gray-600 dark:text-gray-400">Bạn chưa có đặt phòng nào.</p>
        <Link
          to="/homestays"
          className="mt-4 block w-full text-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tìm homestay ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Lịch sử đặt phòng và giao dịch
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Danh sách các đặt phòng và thanh toán của bạn
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <div className="flex items-center mb-2 sm:mb-0">
                <FaCalendar className="text-indigo-600 dark:text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Đặt ngày: {formatDateTime(booking.createdAt)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Mã đặt phòng: #{booking.id}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end">
                <div className="mb-1">{renderBookingStatus(booking.status)}</div>
                <div>{renderPaymentStatus(booking.paymentStatus || 'PENDING')}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between mt-2">
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
                <p className="font-medium">{booking.homestay?.name || 'Homestay'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(booking.checkInDate), 'dd/MM/yyyy', { locale: vi })} - {format(new Date(booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
              <div className="flex items-center">
                <p className="font-semibold text-lg mr-4">{formatCurrency(booking.totalPrice)}</p>
                <button
                  onClick={() => toggleExpand(booking.id)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <FaEllipsisH className="text-gray-500" />
                </button>
              </div>
            </div>

            {expanded[booking.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <FaInfoCircle className="mr-2 text-indigo-500" />
                      Chi tiết đặt phòng
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Homestay:</span> {booking.homestay?.name || 'N/A'}</p>
                      <p><span className="font-medium">Địa chỉ:</span> {booking.homestay?.address || 'N/A'}</p>
                      <p><span className="font-medium">Ngày nhận phòng:</span> {format(new Date(booking.checkInDate), 'dd/MM/yyyy', { locale: vi })}</p>
                      <p><span className="font-medium">Ngày trả phòng:</span> {format(new Date(booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}</p>
                      <p><span className="font-medium">Số khách:</span> {booking.guestCount} người</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <FaRegMoneyBillAlt className="mr-2 text-green-500" />
                      Chi tiết thanh toán
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Tổng tiền:</span> {formatCurrency(booking.totalPrice)}</p>
                      <p><span className="font-medium">Phương thức:</span> {booking.paymentMethod || 'Chưa thanh toán'}</p>
                      <p><span className="font-medium">Trạng thái:</span> {booking.paymentStatus || 'PENDING'}</p>
                      {booking.paymentReference && (
                        <p><span className="font-medium">Mã giao dịch:</span> {booking.paymentReference}</p>
                      )}
                      {booking.paymentDate && (
                        <p><span className="font-medium">Ngày thanh toán:</span> {formatDateTime(booking.paymentDate)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {/* Hiển thị nút xác nhận đã thanh toán nếu đặt phòng đã xác nhận và chưa thanh toán */}
                  {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PENDING' && (
                    <ConfirmPaymentButton
                      booking={booking}
                      onConfirmSuccess={(data) => handlePaymentConfirmSuccess(booking.id, data)}
                    />
                  )}

                  {booking.status === 'PENDING' && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition">
                      Hủy đặt phòng
                    </button>
                  )}

                  <Link
                    to={`/homestays/${booking.homestayId}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
                  >
                    Xem homestay
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
