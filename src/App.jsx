import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Promotions from './pages/Promotions';
import About from './pages/About';
import Login from './pages/Login';

function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '24px', fontSize: 13 }}>
      © 2025 VietTour · Khám phá Việt Nam cùng chúng tôi
    </footer>
  );
}

function AppShell() {
  const location = useLocation();
  const isLogin = location.pathname === '/dang-nhap';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/khuyen-mai" element={<Promotions />} />
          <Route path="/ve-chung-toi" element={<About />} />
          <Route path="/dang-nhap" element={<Login />} />
        </Routes>
      </div>
      {!isLogin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
