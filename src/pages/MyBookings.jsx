import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, AlertCircle, XCircle, CheckCircle2, ChevronRight, User, Phone, Mail } from 'lucide-react';
import { bookingAPI } from '../services/api';

function fmtMoney(n) {
  if (!n) return '0đ';
  return Math.round(n).toLocaleString('vi-VN') + 'đ';
}

function getStatusBadge(status) {
  switch (status) {
    case 'pending':
      return { label: 'Chờ xác nhận', bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
    case 'confirmed':
      return { label: 'Đã xác nhận', bg: '#D1FAE5', color: '#059669', border: '#6EE7B7' };
    case 'in_progress':
      return { label: 'Đang diễn ra', bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' };
    case 'completed':
      return { label: 'Đã hoàn thành', bg: '#F3E8FF', color: '#9333EA', border: '#E9D5FF' };
    case 'cancelled':
      return { label: 'Đã hủy', bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' };
    default:
      return { label: status, bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' };
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);

  // Fetch lịch sử đơn hàng từ Backend
  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingAPI.getAll();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách đơn đặt tour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Xử lý Hủy Tour
  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setCancellingId(selectedBookingForCancel.id);
    try {
      await bookingAPI.cancel(selectedBookingForCancel.id, cancelReason);
      // Reload lại danh sách sau khi hủy thành công
      await fetchMyBookings();
      setSelectedBookingForCancel(null);
      setCancelReason('');
    } catch (err) {
      alert('Lỗi hủy tour: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px - 70px)',
      background: '#FAF8F5',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Header trang */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#00C896', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            <Calendar size={16} /> Lịch sử chuyến đi
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--navy)', marginTop: 6 }}>
            Đơn đặt tour của tôi
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Quản lý danh sách các tour đã đặt, theo dõi trạng thái hoặc hủy chuyến khi có nhu cầu.
          </p>
        </div>

        {/* Trạng thái Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Đang tải danh sách chuyến đi...</div>
          </div>
        )}

        {/* Trạng thái Error */}
        {error && !loading && (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626',
            borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Trạng thái Trống (Chưa đặt tour nào) */}
        {!loading && !error && bookings.length === 0 && (
          <div style={{
            background: 'white', borderRadius: 20, border: '1.5px solid #E2DDD8',
            padding: '60px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: '#F0EDE8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <MapPin size={28} color="var(--navy)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
              Bạn chưa có đơn đặt tour nào
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Hãy khám phá ngay các tour du lịch hấp dẫn trên VietTour!
            </p>
            <Link to="/tours" style={{
              background: 'linear-gradient(135deg, #00C896, #0A7A5E)', color: 'white',
              padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14,
              display: 'inline-block',
            }}>
              Khám phá Tour ngay →
            </Link>
          </div>
        )}

        {/* Danh sách các đơn Đặt Tour */}
        {!loading && !error && bookings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bookings.map(b => {
              const badge = getStatusBadge(b.status);
              const tourTitle = b.tour?.title || `Tour #${b.tour_id}`;
              const departureDateFormatted = new Date(b.departure_date).toLocaleDateString('vi-VN');

              return (
                <div key={b.id} style={{
                  background: 'white', borderRadius: 16, border: '1.5px solid #E2DDD8',
                  overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, boxShadow 0.2s',
                }}>
                  {/* Card Top Header */}
                  <div style={{
                    padding: '16px 24px', background: '#FAF8F5', borderBottom: '1px solid #E2DDD8',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', fontFamily: 'monospace' }}>
                        MÃ ĐƠN: #{b.booking_code || b.id}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        • Đặt ngày {new Date(b.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div style={{
                      padding: '4px 12px', borderRadius: 20, background: badge.bg,
                      color: badge.color, border: `1px solid ${badge.border}`,
                      fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}>
                      {badge.label}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>
                        {tourTitle}
                      </h3>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={15} color="#00C896" />
                          <span>Khởi hành: <strong>{departureDateFormatted}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <User size={15} color="#00C896" />
                          <span>Hành khách: <strong>{b.adults} người lớn{b.children > 0 ? `, ${b.children} trẻ em` : ''}</strong></span>
                        </div>
                      </div>

                      {/* Thông tin liên hệ */}
                      <div style={{ marginTop: 12, padding: '10px 14px', background: '#F7F4F0', borderRadius: 8, fontSize: 12.5, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        <span>👤 <strong>{b.contact_name}</strong></span>
                        <span>📞 {b.contact_phone}</span>
                        <span>✉️ {b.contact_email}</span>
                      </div>
                    </div>

                    {/* Tổng tiền & Nút Thao tác */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng thanh toán</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#00A87A' }}>
                          {fmtMoney(b.total_price)}
                        </div>
                      </div>

                      {/* Nút Hủy (Chỉ hiện khi trạng thái là pending hoặc confirmed) */}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button
                          onClick={() => setSelectedBookingForCancel(b)}
                          style={{
                            marginTop: 16, background: '#FEE2E2', color: '#DC2626',
                            border: '1px solid #FCA5A5', borderRadius: 8,
                            padding: '7px 14px', fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          <XCircle size={15} />
                          Hủy đặt tour
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal Popup xác nhận Hủy Tour */}
      {selectedBookingForCancel && (
        <>
          <div onClick={() => setSelectedBookingForCancel(null)} style={{
            position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(4px)', zIndex: 400,
          }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 'min(440px, calc(100vw - 32px))', background: 'white', borderRadius: 20,
            padding: '28px 24px', zIndex: 401, boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>
              Xác nhận hủy đặt tour?
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              Bạn đang yêu cầu hủy đơn <strong>#{selectedBookingForCancel.booking_code || selectedBookingForCancel.id}</strong>.
            </p>

            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>
              Lý do hủy (không bắt buộc):
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Nhập lý do thay đổi kế hoạch..."
              style={{
                width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid #E2DDD8',
                fontSize: 13, outline: 'none', marginBottom: 20, fontFamily: 'sans-serif'
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                style={{
                  flex: 1, padding: '11px', background: 'white', border: '1.5px solid #E2DDD8',
                  borderRadius: 10, fontSize: 13.5, fontWeight: 600, color: 'var(--navy)', cursor: 'pointer'
                }}
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancellingId !== null}
                style={{
                  flex: 1, padding: '11px', background: '#DC2626', color: 'white',
                  border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: 'pointer'
                }}
              >
                {cancellingId ? 'Đang hủy...' : 'Xác nhận Hủy'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
