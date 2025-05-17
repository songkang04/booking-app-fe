import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import Toast from './components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { Home, Login, NotFound, Profile, Register, VerifyEmail } from './pages';
import Homestays from './pages/Homestays';
import HomestayDetail from './pages/HomestayDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homestays" element={<Homestays />} />
          <Route path="/homestays/:id" element={<HomestayDetail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
