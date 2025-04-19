import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { registerSchema } from '../validations/authSchema';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Xóa lỗi khi người dùng thay đổi giá trị
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    try {
      // Sử dụng Zod để validate form
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      // Xử lý lỗi validation từ Zod
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      
      setErrors(formattedErrors);
      
      // Hiển thị lỗi đầu tiên
      if (error.errors.length > 0) {
        toast.error(error.errors[0].message);
      }
      
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Xác thực form bằng Zod
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await register(formData);
      
      if (result.success) {
        // Hiển thị thông báo thành công
        toast.success('Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        setEmailSent(true);
      } else {
        toast.error(result.message || 'Đăng ký không thành công');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng ký không thành công, vui lòng thử lại';
      toast.error(errorMessage);
      console.error('Lỗi đăng ký:', err);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Xác thực email
              </h1>
              <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                <p>Đăng ký thành công! Chúng tôi đã gửi một email xác thực đến địa chỉ email của bạn.</p>
                <p className="mt-2">Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác thực để hoàn tất đăng ký.</p>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4"
                >
                  Về trang chủ
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-300 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 md:max-w-2xl xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng ký tài khoản mới
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border p-2.5 text-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                      errors.firstName 
                        ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-700' 
                        : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    placeholder="Họ của bạn"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border p-2.5 text-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                      errors.lastName 
                        ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-700' 
                        : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    placeholder="Tên của bạn"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email của bạn
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border p-2.5 text-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                      errors.email 
                        ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-700' 
                        : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border p-2.5 text-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                      errors.password 
                        ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-700' 
                        : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className={`focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border p-2.5 text-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                      errors.confirmPassword 
                        ? 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-700' 
                        : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:outline-none"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Bạn đã có tài khoản?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
