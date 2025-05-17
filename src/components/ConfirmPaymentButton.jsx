import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { formatCurrency } from '../utils/format';

/**
 * Component cho phép người dùng xác nhận đã thanh toán
 * @param {Object} props - Component props
 * @param {Object} props.booking - Thông tin đặt phòng
 * @param {Function} props.onConfirmSuccess - Callback khi xác nhận thanh toán thành công
 */
const ConfirmPaymentButton = ({ booking, onConfirmSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Kiểm tra nếu booking không tồn tại hoặc đã được thanh toán rồi
  if (!booking || booking.paymentStatus === 'PAID') {
    return null;
  }

  const handleConfirmClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Gọi API xác nhận người dùng đã thanh toán
      const response = await bookingService.confirmUserPayment(booking.id);

      if (response.success) {
        // Gọi callback để cập nhật UI
        if (onConfirmSuccess) {
          onConfirmSuccess(response.data);
        }

        // Ẩn modal xác nhận
        setShowConfirm(false);
      } else {
        throw new Error(response.message || 'Không thể xác nhận thanh toán');
      }
    } catch (err) {
      console.error('Lỗi khi xác nhận thanh toán:', err);
      setError(err.message || 'Đã xảy ra lỗi khi xác nhận thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleConfirmClick}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition w-full sm:w-auto"
      >
        Tôi đã thanh toán
      </button>

      {/* Modal xác nhận đã thanh toán */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Xác nhận thanh toán
              </h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Bạn xác nhận rằng đã hoàn tất thanh toán số tiền <strong>{formatCurrency(booking.totalPrice)}</strong> cho đặt phòng này?
              </p>

              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Sau khi xác nhận, chúng tôi sẽ kiểm tra và xác nhận thanh toán của bạn trong thời gian sớm nhất.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận đã thanh toán'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmPaymentButton;
