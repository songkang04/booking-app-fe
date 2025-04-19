import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../validations/authSchema';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      loginSchema.parse(formData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xác thực form bằng Zod
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Lưu trạng thái "Ghi nhớ đăng nhập" nếu được chọn
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // Hiển thị thông báo thành công
        toast.success('Đăng nhập thành công!');
        
        // Chuyển hướng về trang chủ
        navigate('/');
      } else {
        toast.error(result.message || 'Đăng nhập không thành công');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập không thành công, vui lòng thử lại';
      toast.error(errorMessage);
      console.error('Lỗi đăng nhập:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl leading-tight font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng nhập vào tài khoản của bạn
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      aria-describedby="rememberMe"
                      type="checkbox"
                      className="focus:ring-primary-300 dark:focus:ring-primary-600 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-3 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="rememberMe" className="text-gray-500 dark:text-gray-300">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:outline-none"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Bạn chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Đăng ký
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
