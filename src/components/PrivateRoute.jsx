import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>;
  }

  // Nếu không đăng nhập, chuyển hướng đến trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Nếu yêu cầu quyền admin nhưng người dùng không phải admin
  if (requireAdmin && currentUser?.role !== 'admin') {
    return <Navigate to="/not-found" />;
  }

  return children;
};

export default PrivateRoute;
