import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import bookingService from '../services/bookingService';

const BookingVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(null);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Không tìm thấy mã xác thực đặt phòng. Vui lòng kiểm tra link trong email của bạn.');
      return;
    }

    const verifyBookingToken = async () => {
      try {
        const response = await bookingService.verifyBooking(token);

        if (response.success) {
          setStatus('success');
          setBooking(response.data);
          setMessage(response.message || 'Xác thực đặt phòng thành công!');

          // Thiết lập đếm ngược để chuyển hướng
          const countdown = setInterval(() => {
            setTimer((prevTimer) => {
              if (prevTimer <= 1) {
                clearInterval(countdown);
                navigate('/profile'); // Chuyển hướng đến trang profile để xem đặt phòng
                return 0;
              }
              return prevTimer - 1;
            });
          }, 1000);

          return () => clearInterval(countdown);
        } else {
          throw new Error(response.message || 'Có lỗi xảy ra khi xác thực đặt phòng');
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.message ||
          error.message ||
          'Có lỗi xảy ra khi xác thực đặt phòng. Vui lòng thử lại sau.'
        );
      }
    };

    verifyBookingToken();
  }, [location.search, navigate]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Header />

      {/* Gradient decorative background */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {status === 'processing' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">Đang xác thực đặt phòng của bạn...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Xác thực đặt phòng thành công!</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
                {booking && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-md font-medium">Thông tin đặt phòng:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Homestay: {booking.homestay?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ngày nhận phòng: {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ngày trả phòng: {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trạng thái: {booking.status === 'CONFIRMED' ? 'Đã xác nhận' : booking.status}
                    </p>
                  </div>
                )}
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Bạn sẽ được chuyển hướng đến trang cá nhân sau {timer} giây...
                </p>
                <div className="mt-6">
                  <Link
                    to="/profile"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Đi đến trang cá nhân ngay
                  </Link>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Xác thực không thành công</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
                <div className="mt-6">
                  <Link
                    to="/"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Quay về trang chủ
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingVerification;
