import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register'

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
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 28 }}>
          {mode === 'login' ? 'Đăng nhập để quản lý chuyến đi của bạn' : 'Tham gia VietTour để nhận ưu đãi đặc biệt'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F0EDE8', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {[{ id: 'login', label: 'Đăng nhập' }, { id: 'register', label: 'Đăng ký' }].map(t => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
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

        {/* Form */}
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div style={inputWrap}>
              <input type="text" placeholder="Họ và tên" style={inputStyle} />
            </div>
          )}
          <div style={inputWrap}>
            <Mail size={16} color="var(--text-muted)" />
            <input type="email" placeholder="Email" style={inputStyle} />
          </div>
          <div style={inputWrap}>
            <Lock size={16} color="var(--text-muted)" />
            <input type={showPw ? 'text' : 'password'} placeholder="Mật khẩu" style={inputStyle} />
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

          <button type="submit" style={{
            background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
            color: 'white', border: 'none', borderRadius: 10,
            padding: '13px', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', marginTop: 8,
          }}>
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
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

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
          Đây là giao diện demo — chưa kết nối hệ thống đăng nhập thật.
        </p>
      </div>
    </div>
  );
}
