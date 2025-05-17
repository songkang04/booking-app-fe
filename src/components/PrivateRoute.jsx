import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hoặc loading spinner của bạn
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
