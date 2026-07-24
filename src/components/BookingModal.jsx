import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { bookingAPI } from '../services/api';

function fmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export default function BookingModal({ tour, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', adults: '2', children: '0', specialRequests: '' });

  // Tự động điền tên, email, sđt từ user đã đăng nhập
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        setForm(prev => ({
          ...prev,
          name: u.full_name || '',
          email: u.email || '',
          phone: u.phone || '',
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!tour) return null;

  const total = tour.price * (parseInt(form.adults) + parseInt(form.children) * 0.5);

  const handleSubmit = async () => {
    setError('');
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập trước khi đặt tour!');
      onClose();
      navigate('/dang-nhap');
      return;
    }

    if (!form.name || !form.phone || !form.date) {
      setError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Ngày khởi hành!');
      return;
    }

    setLoading(true);
    try {
      await bookingAPI.create({
        tour_id: Number(tour.id),
        departure_date: form.date, // ISO date string "YYYY-MM-DD"
        adults: parseInt(form.adults),
        children: parseInt(form.children),
        contact_name: form.name,
        contact_phone: form.phone,
        contact_email: form.email,
        special_requests: form.specialRequests,
      });

      setStep(2);
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi tạo đơn đặt tour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,22,40,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 300,
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(480px, calc(100vw - 40px))',
        background: 'white', borderRadius: 20,
        zIndex: 301,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
      }}>
        {step === 1 ? (
          <>
            {/* Modal header */}
            <div style={{
              background: tour.gradient || 'linear-gradient(135deg, #0A1628, #1A2F4A)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Đặt tour</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'white' }}>
                  {tour.title}
                </div>
              </div>
              <button onClick={onClose} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: '50%', width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white',
              }}>
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {error && (
                <div style={{
                  background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626',
                  borderRadius: 10, padding: '10px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Họ và tên *" placeholder="Nguyễn Văn An"
                  value={form.name} onChange={v => setForm({ ...form, name: v })} />
                <Field label="Số điện thoại *" placeholder="0901 234 567" type="tel"
                  value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
              </div>
              <Field label="Email" placeholder="email@gmail.com" type="email"
                value={form.email} onChange={v => setForm({ ...form, email: v })} />
              <Field label="Ngày khởi hành *" type="date"
                value={form.date} onChange={v => setForm({ ...form, date: v })} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Người lớn
                  </label>
                  <select value={form.adults} onChange={e => setForm({ ...form, adults: e.target.value })}
                    style={selectStyle}>
                    {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} người</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Trẻ em (50%)
                  </label>
                  <select value={form.children} onChange={e => setForm({ ...form, children: e.target.value })}
                    style={selectStyle}>
                    {['0','1','2','3'].map(n => <option key={n} value={n}>{n} trẻ</option>)}
                  </select>
                </div>
              </div>

              {/* Total */}
              <div style={{
                background: '#F7F3EE', borderRadius: 12,
                padding: '14px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Tổng tiền ({form.adults} người lớn{parseInt(form.children) > 0 ? ` + ${form.children} trẻ em` : ''})
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>
                  {fmt(Math.round(total))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: '12px', background: 'white',
                  border: '1.5px solid #E2DDD8', borderRadius: 10,
                  fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}>
                  Hủy
                </button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex: 2, padding: '12px',
                  background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #00C896, #0A7A5E)',
                  border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Đang gửi đơn...' : 'Xác nhận đặt tour →'}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Success Step */
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#E8F8F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={36} color="#00C896" strokeWidth={2} />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24, fontWeight: 700, color: 'var(--navy)',
              marginBottom: 10,
            }}>
              Đặt tour thành công!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
              Đơn đặt tour <strong>{tour.title}</strong> đã được ghi nhận.<br />
              Bạn có thể theo dõi trong lịch sử chuyến đi.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => { onClose(); navigate('/lich-su-dat-tour'); }} style={{
                background: 'linear-gradient(135deg, #00C896, #0A7A5E)', color: 'white',
                border: 'none', borderRadius: 10,
                padding: '12px 20px', fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
              }}>
                Xem lịch sử chuyến đi →
              </button>
              <button onClick={onClose} style={{
                background: 'white', color: 'var(--navy)',
                border: '1.5px solid #E2DDD8', borderRadius: 10,
                padding: '12px 20px', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
              }}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px',
  border: '1.5px solid #E2DDD8', borderRadius: 8,
  fontSize: 14, color: 'var(--navy)',
  background: 'white', outline: 'none',
  fontFamily: 'var(--font-ui)',
};

const selectStyle = {
  ...inputStyle, cursor: 'pointer',
};

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#00C896'}
        onBlur={e => e.target.style.borderColor = '#E2DDD8'}
      />
    </div>
  );
}
