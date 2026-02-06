import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AnimatedBackground from './components/layout/AnimatedBackground';
import CartSidebar from './components/ui/CartSidebar';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import Gallery from './pages/Gallery';
import SizeGuide from './pages/SizeGuide';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';

import './App.css';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <AnimatedBackground />
      <ScrollToTop />

      {!isAdminRoute && (
        <>
          <Header />
          <CartSidebar />
          <FloatingWhatsApp />
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/urunler" element={<Products />} />
        <Route path="/urun/:id" element={<ProductDetail />} />
        <Route path="/sepet" element={<Cart />} />
        <Route path="/siparis" element={<Checkout />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/galeri" element={<Gallery />} />
        <Route path="/beden-olculeri" element={<SizeGuide />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/urunler" element={<ProductManager />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
