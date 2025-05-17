import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import paymentService from '../../services/paymentService';
import { formatCurrency } from '../../utils/format';

/**
 * Component cho admin xác nhận thanh toán
 * @param {Object} props - Component props
 * @param {Object} props.booking - Thông tin đặt phòng
 * @param {Function} props.onVerified - Callback khi xác nhận thanh toán thành công
 */
const PaymentVerification = ({ booking, onVerified }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  // Map trạng thái thanh toán sang hiển thị UI
  const paymentStatusMap = {
    unpaid: { label: 'Chưa thanh toán', color: 'text-red-500', icon: <FaTimesCircle className="mr-1" /> },
    pending_verification: { label: 'Chờ xác nhận', color: 'text-yellow-500', icon: <FaClock className="mr-1" /> },
    paid: { label: 'Đã thanh toán', color: 'text-green-500', icon: <FaCheckCircle className="mr-1" /> },
    refunded: { label: 'Đã hoàn tiền', color: 'text-blue-500', icon: <FaCheckCircle className="mr-1" /> }
  };

  // Xác nhận thanh toán
  const handleVerifyPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await paymentService.verifyPayment(booking.id, { notes });

      if (result.success) {
        onVerified && onVerified(result.data);
      } else {
        throw new Error(result.message || 'Không thể xác nhận thanh toán');
      }
    } catch (error) {
      console.error('Lỗi xác nhận thanh toán:', error);
      setError(error.message || 'Đã xảy ra lỗi khi xác nhận thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái thanh toán
  const renderPaymentStatus = () => {
    const status = booking.paymentStatus || 'unpaid';
    const statusData = paymentStatusMap[status] || paymentStatusMap.unpaid;

    return (
      <div className={`flex items-center ${statusData.color}`}>
        {statusData.icon}
        <span>{statusData.label}</span>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Thông tin thanh toán</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">ID đặt phòng:</p>
          <p className="font-medium">{booking.id}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Trạng thái thanh toán:</p>
          {renderPaymentStatus()}
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Số tiền:</p>
          <p className="font-bold">{formatCurrency(booking.totalPrice)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mã thanh toán:</p>
          <p className="font-mono bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded">{booking.paymentReference || 'N/A'}</p>
        </div>

        {booking.paymentQrCode && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mã QR thanh toán:</p>
            <img src={booking.paymentQrCode} alt="QR Code" className="max-w-xs rounded border" />
          </div>
        )}
      </div>

      {/* Chỉ hiển thị phần xác nhận nếu đang chờ xác nhận */}
      {booking.paymentStatus === 'pending_verification' && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <h4 className="font-medium mb-2">Xác nhận thanh toán</h4>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mb-3 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="payment-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ghi chú (không bắt buộc)
            </label>
            <textarea
              id="payment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Thêm ghi chú về thanh toán này (ví dụ: Mã giao dịch ngân hàng)"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className={`px-4 py-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/40 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              Từ chối
            </button>
            <button
              type="button"
              onClick={handleVerifyPayment}
              className={`px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none ${loading ? 'opacity-50 cursor-wait' : ''}`}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
