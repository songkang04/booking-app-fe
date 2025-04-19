import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Gradient decorative background */}
      <div
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
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

      {/* Not Found Content */}
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-6 lg:py-24">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-6 text-7xl font-extrabold tracking-tight text-indigo-600 lg:text-9xl dark:text-indigo-400">
              404
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Trang không tồn tại
            </p>
            <p className="mb-6 text-lg font-light text-gray-500 dark:text-gray-400">
              Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Bạn có thể quay lại
              trang chủ để khám phá thêm.
            </p>

            <div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                <FaHome className="mr-2" />
                Về trang chủ
              </Link>
              <Link
                to="/homestays"
                className="inline-flex items-center rounded-lg border border-indigo-600 bg-transparent px-5 py-2.5 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:ring-4 focus:ring-indigo-300 focus:outline-none dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-gray-800 dark:focus:ring-indigo-800"
              >
                <FaArrowLeft className="mr-2" />
                Xem homestay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
