import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import authService from '../services/authService';
import BookingHistory from '../components/BookingHistory';
import Header from '../components/layouts/Header';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    avatar: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        setUser(userData.user);
        setFormData({
          fullName: userData.user.firstName + ' ' + userData.user.lastName || '',
          phone: userData.user.phone || '',
          address: userData.user.address || '',
          avatar: userData.user.avatar || ''
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Giả lập API cập nhật thông tin
      // const response = await userService.updateProfile(formData);

      // Cập nhật user state với dữ liệu mới
      setUser({
        ...user,
        ...formData
      });

      setEdit(false);
      setUpdateSuccess(true);

      // Ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating user data:', err);
      setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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

      <div className="pt-24 pb-12 px-4 md:px-0">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông tin cá nhân</h1>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {updateSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Cập nhật thông tin thành công!
            </div>
          )}

          {!loading && !error && user && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                    <div className="relative">
                      <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName || 'Người dùng'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-gray-400 dark:text-gray-500 text-5xl" />
                        )}
                      </div>
                      {edit && (
                        <div className="mt-2 text-center">
                          <input
                            type="text"
                            name="avatar"
                            placeholder="Nhập URL avatar"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={formData.avatar}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FaUser className="inline mr-2" />
                            Họ và tên
                          </label>
                          {edit ? (
                            <input
                              type="text"
                              name="fullName"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{user.firstName + ' ' + user.lastName || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FaEnvelope className="inline mr-2" />
                            Email
                          </label>
                          <p className="text-gray-900 dark:text-white">{user.email}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FaPhone className="inline mr-2" />
                            Số điện thoại
                          </label>
                          {edit ? (
                            <input
                              type="tel"
                              name="phone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{user.phone || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <FaMapMarkerAlt className="inline mr-2" />
                            Địa chỉ
                          </label>
                          {edit ? (
                            <textarea
                              name="address"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              value={formData.address}
                              onChange={handleInputChange}
                              rows="3"
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white">{user.address || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div className="flex justify-between pt-4">
                          {edit ? (
                            <>
                              <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                onClick={() => {
                                  setEdit(false);
                                  setFormData({
                                    fullName: user.fullName || '',
                                    phone: user.phone || '',
                                    address: user.address || '',
                                    avatar: user.avatar || ''
                                  });
                                }}
                              >
                                Hủy
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                                disabled={loading}
                              >
                                <FaSave className="mr-2" />
                                Lưu thay đổi
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                onClick={handleLogout}
                              >
                                <FaSignOutAlt className="mr-2" />
                                Đăng xuất
                              </button>
                              <button
                                type="button"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                                onClick={() => setEdit(true)}
                              >
                                <FaEdit className="mr-2" />
                                Chỉnh sửa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaHistory className="mr-2" />
              Lịch sử đặt phòng và giao dịch
            </h2>
            <BookingHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
