import React from 'react';
import { formatCurrency } from '../utils/format';

/**
 * Component hiển thị modal xác nhận trước khi đặt phòng
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Trạng thái hiển thị modal
 * @param {function} props.onClose - Hàm đóng modal
 * @param {function} props.onConfirm - Hàm xác nhận đặt phòng
 * @param {Object} props.bookingDetails - Chi tiết đặt phòng
 * @param {boolean} props.isProcessing - Trạng thái đang xử lý
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, bookingDetails, isProcessing }) => {
  if (!isOpen) return null;

  const {
    homestay,
    checkInDate,
    checkOutDate,
    guestCount,
    nights,
    totalPrice = 0,
  } = bookingDetails;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Xác nhận đặt phòng
          </h3>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Đóng</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Vui lòng xác nhận thông tin đặt phòng của bạn. Sau khi xác nhận,
            bạn sẽ nhận được thông tin thanh toán qua email và phòng sẽ được giữ chỗ trong 24 giờ.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">{homestay.name}</h4>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nhận phòng:</span>
                <span className="font-medium">{formatDate(checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Trả phòng:</span>
                <span className="font-medium">{formatDate(checkOutDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Số đêm:</span>
                <span className="font-medium">{nights} đêm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Số khách:</span>
                <span className="font-medium">{guestCount} người</span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2"></div>

              <div className="flex justify-between font-bold">
                <span>Tổng tiền:</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Bằng việc nhấn "Xác nhận đặt phòng", bạn đồng ý với các điều khoản đặt phòng và chính sách hủy phòng của homestay.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50 flex justify-center items-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận đặt phòng'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
