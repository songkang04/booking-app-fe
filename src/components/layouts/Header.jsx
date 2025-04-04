import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between bg-white p-6 lg:px-8 dark:bg-gray-900"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">BOK</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">BOOKING</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link 
            to="/" 
            className={`text-sm/6 font-semibold ${
              location.pathname === '/' 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-900 dark:text-white'
            }`}
          >
            Trang chủ
          </Link>
          <Link 
            to="/homestays" 
            className={`text-sm/6 font-semibold ${
              location.pathname === '/homestays' 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-900 dark:text-white'
            }`}
          >
            Homestays
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to="/login" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
            Đăng nhập <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
      {/* Mobile menu, show/hide based on menu open state. */}
      <div className="hidden lg:hidden" role="dialog" aria-modal="false">
        {/* Background backdrop, show/hide based on slide-over state. */}
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-700">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">BOK</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">BOOKING</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
              <div className="space-y-2 py-6">
                <Link
                  to="/"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    location.pathname === '/' 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/homestays"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    location.pathname === '/homestays' 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  Homestays
                </Link>
              </div>
              <div className="py-6">
                <Link
                  to="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
