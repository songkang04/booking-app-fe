import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import paymentService from '../services/paymentService';
import { formatCurrency } from '../utils/format';

/**
 * Component hiển thị modal thanh toán với mã QR
 * @param {Object} props - Component props
 * @param {string} props.bookingId - ID đặt phòng cần thanh toán
 * @param {boolean} props.isOpen - Trạng thái hiển thị modal
 * @param {Function} props.onClose - Hàm đóng modal
 * @param {Function} props.onPaymentSuccess - Hàm gọi khi thanh toán thành công
 */
const PaymentModal = ({ bookingId, isOpen, onClose, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Trạng thái thanh toán
  const paymentStatusMap = {
    unpaid: { label: 'Chưa thanh toán', color: 'text-red-500', icon: <FaTimesCircle className="mr-1" /> },
    pending_verification: { label: 'Chờ xác nhận', color: 'text-yellow-500', icon: <FaClock className="mr-1" /> },
    paid: { label: 'Đã thanh toán', color: 'text-green-500', icon: <FaCheckCircle className="mr-1" /> },
    refunded: { label: 'Đã hoàn tiền', color: 'text-blue-500', icon: <FaCheckCircle className="mr-1" /> }
  };

  // Lấy thông tin thanh toán khi modal mở
  useEffect(() => {
    if (isOpen && bookingId) {
      fetchPaymentInfo();
    }
  }, [isOpen, bookingId]);

  // Lấy thông tin thanh toán từ API
  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      setError('');

      // Nếu chưa có thông tin thanh toán, khởi tạo
      let response = await paymentService.getPaymentInfo(bookingId);
      console.log('Payment info response in modal:', response);

      // Nếu chưa có mã QR, khởi tạo thanh toán
      if (response.success && !response.data.paymentQrCode) {
        console.log('No QR code found, initiating payment');
        response = await paymentService.initiatePayment(bookingId);
      }

      if (response.success) {
        setPaymentData(response.data);
      } else {
        setError(response.message || 'Không thể lấy thông tin thanh toán');
      }
    } catch (error) {
      console.error('Lỗi lấy thông tin thanh toán:', error);
      setError(error.message || 'Không thể lấy thông tin thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Sao chép mã tham chiếu vào clipboard
  const copyReferenceToClipboard = () => {
    if (paymentData?.paymentReference) {
      navigator.clipboard.writeText(paymentData.paymentReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Kiểm tra lại trạng thái thanh toán
  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentInfo(bookingId);

      if (response.success) {
        setPaymentData(response.data);

        // Nếu đã thanh toán, thông báo thành công
        if (response.data.paymentStatus === 'paid') {
          onPaymentSuccess && onPaymentSuccess(response.data);
        }
      } else {
        console.error('Lỗi kiểm tra trạng thái:', response.message);
        setError(response.message || 'Không thể kiểm tra trạng thái thanh toán');
      }
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái thanh toán:', error);
      setError(error.message || 'Không thể kiểm tra trạng thái thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Nếu modal không mở, không hiển thị gì
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Thanh toán đặt phòng
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Đóng</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 p-4 rounded-md">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => fetchPaymentInfo()}
                className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              {/* Trạng thái thanh toán */}
              {paymentData && (
                <div className="mb-4">
                  <div className="flex items-center mb-2 justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">Trạng thái:</span>
                      <span className={`ml-2 flex items-center ${paymentStatusMap[paymentData.paymentStatus]?.color || 'text-gray-500'}`}>
                        {paymentStatusMap[paymentData.paymentStatus]?.icon}
                        {paymentStatusMap[paymentData.paymentStatus]?.label || 'Không xác định'}
                      </span>
                    </div>
                    <button
                      onClick={checkPaymentStatus}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Kiểm tra lại
                    </button>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(paymentData.totalPrice)}
                  </p>
                </div>
              )}

              {/* Mã QR để thanh toán */}
              {paymentData && paymentData.paymentQrCode && (
                <div className="mb-6 flex flex-col items-center justify-center py-4 border rounded-lg">
                  {/* Thông báo */}
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                    Quét mã QR bằng ứng dụng ngân hàng của bạn để tiến hành thanh toán
                  </p>

                  {/* Mã QR */}
                  <div className="p-2 bg-white rounded-lg shadow-md mb-4">
                    <QRCode
                      value={`${paymentData.paymentReference}`}
                      size={200}
                      level="H"
                    />
                  </div>

                  {/* Mã thanh toán */}
                  <div className="w-full px-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nội dung chuyển khoản:</p>
                    <div className="flex">
                      <input
                        type="text"
                        value={paymentData.paymentReference || ''}
                        readOnly
                        className="flex-grow bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        onClick={copyReferenceToClipboard}
                        className="px-3 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-r-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none"
                      >
                        {copied ? 'Đã chép!' : 'Chép'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hướng dẫn thanh toán */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium mb-2">Hướng dẫn thanh toán:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Mở ứng dụng ngân hàng trên điện thoại của bạn.</li>
                  <li>Chọn chức năng quét mã QR để thanh toán.</li>
                  <li>Quét mã QR hiển thị ở trên.</li>
                  <li>Kiểm tra và xác nhận thông tin thanh toán, đặc biệt là <strong>nội dung chuyển khoản</strong>.</li>
                  <li>Sau khi hoàn tất thanh toán, bấm "Kiểm tra lại" để cập nhật trạng thái.</li>
                  <li>Quản lý sẽ xác nhận giao dịch của bạn sau khi nhận được thanh toán.</li>
                </ol>
              </div>

              {/* Thông tin liên hệ */}
              <div className="mt-4 pt-2 text-sm text-gray-600 dark:text-gray-300">
                <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: <a href="tel:+84901234567" className="text-indigo-600 dark:text-indigo-400">090 123 4567</a> hoặc <a href="mailto:support@hdhomestay.com" className="text-indigo-600 dark:text-indigo-400">support@hdhomestay.com</a></p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;