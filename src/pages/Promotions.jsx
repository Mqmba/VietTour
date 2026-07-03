import { useState, useMemo } from 'react';
import { Flame, Clock } from 'lucide-react';
import TourGrid from '../components/TourGrid';
import TourDetail from '../components/TourDetail';
import BookingModal from '../components/BookingModal';
import { tours } from '../data/tours';

export default function Promotions() {
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);

  // Sort by discount % descending
  const discounted = useMemo(() => {
    return [...tours]
      .map(t => ({ ...t, discount: Math.round((1 - t.price / t.originalPrice) * 100) }))
      .filter(t => t.discount > 0)
      .sort((a, b) => b.discount - a.discount);
  }, []);

  const topDeal = discounted[0];
  const handleBook = (tour) => {
    setSelectedTour(null);
    setBookingTour(tour);
  };

  return (
    <>
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1208 0%, #0A1628 60%)',
        padding: '56px 24px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,107,53,0.15)',
            border: '1px solid rgba(255,107,53,0.35)',
            borderRadius: 999, padding: '5px 14px',
            marginBottom: 18,
          }}>
            <Flame size={13} color="#FF6B35" />
            <span style={{ fontSize: 12, color: '#FF6B35', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Ưu đãi có hạn
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'white', marginBottom: 12 }}>
            Khuyến mãi tháng này
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520 }}>
            Giảm giá lên đến {topDeal?.discount}% cho các tour được yêu thích nhất. Số lượng chỗ có hạn!
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Top deal banner */}
        {topDeal && (
          <div
            onClick={() => setSelectedTour(topDeal)}
            style={{
              background: topDeal.gradient,
              borderRadius: 20,
              padding: '32px 36px',
              marginBottom: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', flexWrap: 'wrap', gap: 20,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                background: '#FF6B35', color: 'white',
                fontSize: 12, fontWeight: 700,
                padding: '4px 12px', borderRadius: 999,
                display: 'inline-block', marginBottom: 14,
              }}>
                🔥 DEAL HOT NHẤT -{topDeal.discount}%
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                {topDeal.title} · {topDeal.subtitle}
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                Chỉ còn {topDeal.price.toLocaleString('vi-VN')}đ/người — tiết kiệm {(topDeal.originalPrice - topDeal.price).toLocaleString('vi-VN')}đ
              </p>
            </div>
            <button style={{
              background: 'white', color: 'var(--navy)',
              border: 'none', borderRadius: 12,
              padding: '13px 26px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', position: 'relative', zIndex: 1,
              whiteSpace: 'nowrap',
            }}>
              Xem ưu đãi →
            </button>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--navy)', marginBottom: 6 }}>
            Tất cả ưu đãi
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{discounted.length} tour đang giảm giá</p>
        </div>

        <TourGrid tours={discounted} onSelect={setSelectedTour} />
      </main>

      <TourDetail tour={selectedTour} onClose={() => setSelectedTour(null)} onBook={handleBook} />
      <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} />
    </>
  );
}
