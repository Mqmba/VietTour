import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // State lưu dữ liệu ô nhập liệu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // State quản lý phản hồi API (loading, thông báo lỗi / thành công)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Xử lý gửi form (Đăng nhập / Đăng ký)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        // --- XỬ LÝ ĐĂNG NHẬP ---
        const res = await authAPI.login({ email, password });
        const userObj = res?.user || res?.data?.user || res;
        const tokenStr = res?.token || res?.data?.token;
        
        // 1. Cập nhật Auth State và lưu Token/User vào localStorage
        authLogin(userObj, tokenStr);

        setSuccessMsg('Đăng nhập thành công!');
        
        // 2. Chuyển hướng về trang chủ sau 1 giây
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // --- XỬ LÝ ĐĂNG KÝ ---
        const res = await authAPI.register({
          email,
          password,
          full_name: fullName,
          phone,
        });

        const userObj = res?.user || res?.data?.user || res;
        const tokenStr = res?.token || res?.data?.token;

        // Tự động đăng nhập luôn sau khi đăng ký thành công
        authLogin(userObj, tokenStr);

        setSuccessMsg('Tạo tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      // Hiển thị lỗi từ backend trả về (ví dụ: "Email hoặc mật khẩu không đúng")
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Đổi tab (Clear hết dữ liệu cũ và thông báo lỗi)
  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
  };

  const inputWrap = {
    display: 'flex', alignItems: 'center', gap: 10,
    border: '1.5px solid #E2DDD8', borderRadius: 10,
    padding: '12px 14px', background: '#FAF8F5',
  };
  const inputStyle = {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: 14, color: 'var(--navy)', width: '100%',
    fontFamily: 'var(--font-ui)',
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--navy)',
      padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -80, left: -80,
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.15) 0%, transparent 70%)',
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'white', borderRadius: 20,
        padding: '40px 36px',
        position: 'relative', zIndex: 1,
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 28, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>
            Viet<span style={{ color: '#00C896' }}>Tour</span>
          </span>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--navy)', textAlign: 'center', marginBottom: 6 }}>
          {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
        </h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
          {mode === 'login' ? 'Đăng nhập để quản lý chuyến đi của bạn' : 'Tham gia VietTour để nhận ưu đãi đặc biệt'}
        </p>

        {/* Tabs Đăng nhập / Đăng ký */}
        <div style={{ display: 'flex', background: '#F0EDE8', borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {[{ id: 'login', label: 'Đăng nhập' }, { id: 'register', label: 'Đăng ký' }].map(t => (
            <button
              key={t.id}
              onClick={() => handleSwitchMode(t.id)}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: mode === t.id ? 'white' : 'transparent',
                color: mode === t.id ? 'var(--navy)' : 'var(--text-muted)',
                boxShadow: mode === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.18s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10,
            background: '#FEE2E2', color: '#DC2626',
            fontSize: 13, marginBottom: 16, border: '1px solid #FCA5A5'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Thông báo thành công nếu có */}
        {successMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10,
            background: '#D1FAE5', color: '#059669',
            fontSize: 13, marginBottom: 16, border: '1px solid #6EE7B7'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Ô Họ tên (Chỉ hiện khi Đăng ký) */}
          {mode === 'register' && (
            <div style={inputWrap}>
              <User size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Họ và tên *"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {/* Ô Số điện thoại (Chỉ hiện khi Đăng ký) */}
          {mode === 'register' && (
            <div style={inputWrap}>
              <Phone size={16} color="var(--text-muted)" />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {/* Ô Email */}
          <div style={inputWrap}>
            <Mail size={16} color="var(--text-muted)" />
            <input
              type="email"
              placeholder="Email *"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Ô Mật khẩu */}
          <div style={inputWrap}>
            <Lock size={16} color="var(--text-muted)" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Mật khẩu *"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              {showPw ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
            </button>
          </div>

          {mode === 'login' && (
            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: 12.5, color: '#00C896', fontWeight: 600, textDecoration: 'none' }}>
                Quên mật khẩu?
              </a>
            </div>
          )}

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #00C896, #0A7A5E)',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '13px', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E2DDD8' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>hoặc</span>
          <div style={{ flex: 1, height: 1, background: '#E2DDD8' }} />
        </div>

        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          border: '1.5px solid #E2DDD8', borderRadius: 10,
          padding: '11px', background: 'white', cursor: 'pointer',
          fontSize: 13.5, fontWeight: 600, color: 'var(--navy)',
        }}>
          🔍 Tiếp tục với Google
        </button>
      </div>
    </div>
  );
}

