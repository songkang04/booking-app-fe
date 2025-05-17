import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import PaymentVerification from '../../components/admin/PaymentVerification';
import { formatCurrency } from '../../utils/format';
import axios from '../../services/axiosConfig';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Trạng thái thanh toán và đặt phòng
  const bookingStatusMap = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    payment_pending: { label: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-800' },
    rented: { label: 'Đã cho thuê', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
  };

  const paymentStatusMap = {
    unpaid: { label: 'Chưa thanh toán', color: 'text-red-500', icon: <FaTimesCircle /> },
    pending_verification: { label: 'Chờ xác nhận', color: 'text-yellow-500', icon: <FaClock /> },
    paid: { label: 'Đã thanh toán', color: 'text-green-500', icon: <FaCheckCircle /> },
    refunded: { label: 'Đã hoàn tiền', color: 'text-blue-500', icon: <FaCheckCircle /> }
  };

  // Lấy danh sách đặt phòng
  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      // Thêm filter status nếu không phải 'all'
      const queryParams = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
      const response = await axios.get(`/admin/bookings${queryParams}`);

      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        throw new Error(response.data.message || 'Không thể lấy danh sách đặt phòng');
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách đặt phòng:', error);
      setError('Đã xảy ra lỗi khi tải danh sách đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi xác nhận thanh toán thành công
  const handlePaymentVerified = (updatedBooking) => {
    // Cập nhật booking trong danh sách
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );

    // Đóng chi tiết đặt phòng
    setSelectedBooking(null);

    // Hiển thị thông báo thành công (có thể thay bằng toast notification)
    alert('Xác nhận thanh toán thành công!');
  };

  // Hiển thị trạng thái đặt phòng
  const renderBookingStatus = (status) => {
    const statusInfo = bookingStatusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Hiển thị thông tin đặt phòng được chọn
  const renderSelectedBooking = () => {
    if (!selectedBooking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold">
              Chi tiết đặt phòng
              <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">#{selectedBooking.id.substring(0, 8)}</span>
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => setSelectedBooking(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Thông tin đặt phòng</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Homestay:</span>
                  <p className="font-medium">{selectedBooking.homestay?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ngày nhận phòng:</span>
                  <p>{format(new Date(selectedBooking.checkInDate), 'dd/MM/yyyy', { locale: vi })}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ngày trả phòng:</span>
                  <p>{format(new Date(selectedBooking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Số khách:</span>
                  <p>{selectedBooking.guestCount} người</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                  <p className="font-bold">{formatCurrency(selectedBooking.totalPrice)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái đặt phòng:</span>
                  <div className="mt-1">{renderBookingStatus(selectedBooking.status)}</div>
                </div>
                {selectedBooking.notes && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ghi chú:</span>
                    <p className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm mt-1">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Thông tin khách hàng</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tên khách hàng:</span>
                  <p className="font-medium">{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                  <p>{selectedBooking.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Điện thoại:</span>
                  <p>{selectedBooking.user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ngày đặt phòng:</span>
                  <p>{format(new Date(selectedBooking.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Component xác nhận thanh toán */}
          <div className="mt-6">
            <PaymentVerification
              booking={selectedBooking}
              onVerified={handlePaymentVerified}
            />
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => setSelectedBooking(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đặt phòng</h1>
        <div className="flex items-center">
          <span className="mr-2">Lọc theo trạng thái:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="payment_pending">Chờ thanh toán</option>
            <option value="rented">Đã cho thuê</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <button
            onClick={fetchBookings}
            className="ml-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none"
          >
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-md text-center">
          <p className="text-gray-600 dark:text-gray-400">Không có đặt phòng nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Homestay</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check-in</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check-out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số tiền</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thanh toán</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                    {booking.id.substring(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {booking.homestay?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {format(new Date(booking.checkInDate), 'dd/MM/yyyy', { locale: vi })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {format(new Date(booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    {formatCurrency(booking.totalPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {renderBookingStatus(booking.status)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`flex items-center ${paymentStatusMap[booking.paymentStatus]?.color || 'text-gray-500'}`}>
                      {paymentStatusMap[booking.paymentStatus]?.icon}
                      <span className="ml-1">{paymentStatusMap[booking.paymentStatus]?.label || 'N/A'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
                    >
                      <FaEye className="mr-1" /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Chi tiết đặt phòng */}
      {renderSelectedBooking()}
    </div>
  );
};

export default BookingManagement;
