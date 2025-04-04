import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Home, Login, NotFound, Register } from './pages';
import Homestays from './pages/Homestays';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homestays" element={<Homestays />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
