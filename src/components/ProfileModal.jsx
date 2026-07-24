import { useState, useEffect } from 'react';
import { X, User, Phone, Image, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize form values when user changes or modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatar_url || '');
      setError('');
      setSuccessMsg('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const updatedUser = await authAPI.updateMe({
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
      });

      // Update global context state
      updateUser(updatedUser);
      setSuccessMsg('Cập nhật thông tin thành công!');

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getInitial = () => {
    if (fullName) return fullName.trim().charAt(0).toUpperCase();
    if (user?.email) return user.email.trim().charAt(0).toUpperCase();
    return 'U';
  };

  const inputWrap = {
    display: 'flex', alignItems: 'center', gap: 10,
    border: '1.5px solid #E2DDD8', borderRadius: 10,
    padding: '11px 14px', background: '#FAF8F5',
  };

  const inputStyle = {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: 14, color: 'var(--navy)', width: '100%',
    fontFamily: 'var(--font-ui)',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,22,40,0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(460px, calc(100vw - 32px))',
        background: 'white', borderRadius: 20,
        zIndex: 301,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A1628, #1A2F4A)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'white' }}>
              Thông tin cá nhân
            </h3>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              Cập nhật thông tin tài khoản VietTour của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', transition: 'background 0.2s',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Avatar Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #00C896', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            ) : (
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
                color: 'white', fontWeight: 700, fontSize: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,200,150,0.25)',
              }}>
                {getInitial()}
              </div>
            )}
          </div>

          {/* Status Banners */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Read-only Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Email (không thể thay đổi)
              </label>
              <div style={{ ...inputWrap, background: '#E2DDD8', opacity: 0.8 }}>
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ ...inputStyle, cursor: 'not-allowed', color: 'var(--text-secondary)' }}
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Họ và tên
              </label>
              <div style={inputWrap}>
                <User size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Số điện thoại
              </label>
              <div style={inputWrap}>
                <Phone size={16} color="var(--text-muted)" />
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Avatar URL */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Link Ảnh đại diện (URL)
              </label>
              <div style={inputWrap}>
                <Image size={16} color="var(--text-muted)" />
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1, padding: '12px', background: 'white',
                  border: '1.5px solid #E2DDD8', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: '12px',
                  background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #00C896, #0A7A5E)',
                  border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
