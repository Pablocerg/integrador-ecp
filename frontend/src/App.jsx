import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext.jsx';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Specialties from './components/Specialties';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminPanel from './pages/AdminPanel';
import MiPerfil from './pages/MiPerfil';
import DetalleProducto from './pages/DetalleProducto';
import Features from './components/Features';
import Benefits from './components/Benefits';
import Location from './components/Location';
import Contactform from './components/Contactform';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Pequeño delay para asegurar que la página se renderice
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <CartProvider>
      
        <Navbar />
      <div className="min-h-screen bg-[#1A1A1A] pt-24">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div id="inicio">
                  <Hero />
                </div>
                <Features />
                <div id="menu"> 
                  <Specialties />
                  <Benefits />
                </div>
                <div id="nosotros"> 
                  <Location />
                </div>
                <Contactform />
                <Footer />
              </>
            }
          />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MiPerfil /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </div>
    </CartProvider>
  );
}

export default App; 