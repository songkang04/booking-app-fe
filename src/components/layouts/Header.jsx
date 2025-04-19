import React, { useEffect, useRef, useState } from 'react';
import { FaBed, FaHome, FaSignInAlt, FaSignOutAlt, FaTimes, FaUserAlt, FaUserCircle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);

  // Kiểm tra trạng thái đăng nhập và lấy thông tin người dùng
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = authService.isAuthenticated();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData.user);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          authService.logout(); // Đăng xuất nếu token không hợp lệ
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Xử lý đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng menu chỉ khi click bên ngoài menu và bên ngoài nút toggle
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Đóng user menu khi click bên ngoài
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    // Đóng menu khi chuyển trang
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen, location.pathname]);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  // Lấy tên đầy đủ của người dùng
  const getFullName = () => {
    if (!user) return 'Người dùng';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Người dùng';
  };

  // Danh sách các mục menu
  const menuItems = [
    { name: 'Trang chủ', path: '/', icon: <FaHome className="mr-2" /> },
    { name: 'Homestay', path: '/homestays', icon: <FaBed className="mr-2" /> },
  ];

  return (
    <header className="inset-x-0 top-0 z-50">
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
            ref={buttonRef}
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <FaTimes className="size-6" aria-hidden="true" />
            ) : (
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
            )}
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex lg:gap-x-12">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold leading-6 ${
                location.pathname === item.path
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop User Menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isAuthenticated ? (
            <div className="relative">
              <button
                ref={userButtonRef}
                type="button"
                className="flex items-center text-sm font-semibold leading-6 text-gray-900 dark:text-white focus:outline-none"
                onClick={toggleUserMenu}
              >
                <span className="mr-2">{getFullName()}</span>
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={getFullName()}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-full w-full text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </button>

              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FaUserAlt className="inline mr-2" />
                    Tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <FaSignInAlt className="inline mr-2" />
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              ref={menuRef}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            >
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="-m-1.5 p-1.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="sr-only">BOK</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">BOOKING</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <FaTimes className="size-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  {/* Thông tin người dùng trong mobile menu */}
                  {isAuthenticated && (
                    <div className="py-4">
                      <div className="flex items-center gap-x-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={getFullName()}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="h-full w-full text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {getFullName()}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 py-6">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          location.pathname === item.path
                            ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}

                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className={`-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                            location.pathname === '/profile'
                              ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FaUserAlt className="mr-2" />
                          Tài khoản
                        </Link>
                        <button
                          className="-mx-3 flex w-full items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <FaSignOutAlt className="mr-2" />
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaSignInAlt className="mr-2" />
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
