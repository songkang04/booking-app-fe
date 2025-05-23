import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Không tìm thấy mã xác thực email. Vui lòng kiểm tra link trong email của bạn.');
      return;
    }

    const verifyEmailToken = async () => {
      try {
        const response = await authService.verifyEmail(token);

        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Xác thực email thành công!');

          // Thiết lập đếm ngược để chuyển hướng
          const countdown = setInterval(() => {
            setTimer((prevTimer) => {
              if (prevTimer <= 1) {
                clearInterval(countdown);
                navigate(isAuthenticated ? '/homestays' : '/login');
                return 0;
              }
              return prevTimer - 1;
            });
          }, 1000);

          return () => clearInterval(countdown);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.message ||
          error.message ||
          'Có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.'
        );
      }
    };

    verifyEmailToken();
  }, [location.search, navigate, isAuthenticated]);

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
                <p className="mt-4 text-gray-700 dark:text-gray-300">Đang xác thực email của bạn...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Xác thực thành công!</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{message}</p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Bạn sẽ được chuyển hướng sau {timer} giây...
                </p>
                <div className="mt-6">
                  <Link
                    to={isAuthenticated ? '/homestays' : '/login'}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    {isAuthenticated ? 'Xem danh sách homestay' : 'Đăng nhập ngay'}
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
                <div className="mt-6 space-y-3">
                  <Link
                    to="/login"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    Về trang chủ
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

export default VerifyEmail;
