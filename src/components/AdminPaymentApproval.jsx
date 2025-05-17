import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/format';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FaCheckCircle, FaTimesCircle, FaSearch, FaSync } from 'react-icons/fa';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';

/**
 * Component cho Admin phê duyệt các khoản thanh toán
 */
const AdminPaymentApproval = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lấy danh sách các khoản thanh toán chờ phê duyệt
  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Giả định API trả về danh sách các booking có trạng thái thanh toán là "WAITING_APPROVAL"
      const response = await bookingService.getPaymentApprovalList();

      if (response && response.success) {
        setPendingPayments(response.data);
      } else {
        throw new Error(response?.message || 'Không thể tải danh sách thanh toán chờ duyệt');
      }
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      setError('Không thể tải danh sách thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchPendingPayments();
  }, []);

  // Xử lý khi chọn một booking để xem chi tiết
  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
  };

  // Xử lý khi phê duyệt thanh toán
  const handleApprovePayment = async () => {
    if (!selectedBooking) return;

    try {
      setIsApproving(true);

      // Gọi API phê duyệt thanh toán
      const response = await paymentService.verifyPayment(selectedBooking.id, {
        approved: true,
        notes: 'Thanh toán đã được xác nhận bởi Admin'
      });

      if (response && response.success) {
        // Cập nhật danh sách sau khi phê duyệt
        setPendingPayments(prev => prev.filter(item => item.id !== selectedBooking.id));
        setSelectedBooking(null);

        // Hiển thị thông báo thành công
        alert('Thanh toán đã được phê duyệt thành công');
      } else {
        throw new Error(response?.message || 'Không thể phê duyệt thanh toán');
      }
    } catch (err) {
      console.error('Error approving payment:', err);
      alert('Có lỗi xảy ra khi phê duyệt thanh toán: ' + (err.message || err));
    } finally {
      setIsApproving(false);
    }
  };

  // Xử lý khi từ chối thanh toán
  const handleRejectPayment = async () => {
    if (!selectedBooking) return;

    const reason = prompt('Vui lòng nhập lý do từ chối thanh toán:');
    if (!reason) return;

    try {
      setIsRejecting(true);

      // Gọi API từ chối thanh toán
      const response = await paymentService.verifyPayment(selectedBooking.id, {
        approved: false,
        notes: reason
      });

      if (response && response.success) {
        // Cập nhật danh sách sau khi từ chối
        setPendingPayments(prev => prev.filter(item => item.id !== selectedBooking.id));
        setSelectedBooking(null);

        // Hiển thị thông báo thành công
        alert('Đã từ chối thanh toán');
      } else {
        throw new Error(response?.message || 'Không thể từ chối thanh toán');
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
      alert('Có lỗi xảy ra khi từ chối thanh toán: ' + (err.message || err));
    } finally {
      setIsRejecting(false);
    }
  };

  // Format ngày giờ
  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi });
  };

  // Lọc danh sách theo tìm kiếm
  const filteredPayments = pendingPayments.filter(
    payment =>
      payment.id.toString().includes(searchQuery) ||
      payment.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.homestay?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.paymentReference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Phê duyệt thanh toán</h2>
          <button
            onClick={fetchPendingPayments}
            className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <FaSync className="mr-1" />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Tìm kiếm */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, khách hàng, homestay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Danh sách các thanh toán chờ duyệt */}
        <div className="md:w-1/2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Không có thanh toán nào đang chờ phê duyệt'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map(booking => (
                <li
                  key={booking.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${selectedBooking?.id === booking.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                  onClick={() => handleSelectBooking(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">#{booking.id} - {booking.user?.fullName || 'N/A'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.homestay?.name || 'Homestay'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ngày tạo: {formatDateTime(booking.updatedAt || booking.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-right">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chi tiết thanh toán đã chọn */}
        <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
          {selectedBooking ? (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Chi tiết thanh toán #{selectedBooking.id}</h3>

              <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Khách hàng</p>
                    <p className="font-medium">{selectedBooking.user?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium">{selectedBooking.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Homestay</p>
                    <p className="font-medium">{selectedBooking.homestay?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền</p>
                    <p className="font-medium">{formatCurrency(selectedBooking.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ngày nhận phòng</p>
                    <p className="font-medium">{format(new Date(selectedBooking.checkInDate), 'dd/MM/yyyy', { locale: vi })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ngày trả phòng</p>
                    <p className="font-medium">{format(new Date(selectedBooking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mã tham chiếu thanh toán</p>
                  <p className="font-medium font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    {selectedBooking.paymentReference || 'N/A'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ngày khách xác nhận đã thanh toán</p>
                  <p className="font-medium">
                    {selectedBooking.paymentConfirmedAt ? formatDateTime(selectedBooking.paymentConfirmedAt) : 'N/A'}
                  </p>
                </div>

                {/* Nút phê duyệt/từ chối */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleApprovePayment}
                    disabled={isApproving || isRejecting}
                    className="flex-1 flex justify-center items-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none disabled:opacity-50"
                  >
                    {isApproving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Phê duyệt
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRejectPayment}
                    disabled={isApproving || isRejecting}
                    className="flex-1 flex justify-center items-center py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none disabled:opacity-50"
                  >
                    {isRejecting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="mr-2" />
                        Từ chối
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center p-8 h-full">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Vui lòng chọn một thanh toán từ danh sách</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentApproval;
