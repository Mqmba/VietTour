import { Star, Clock, Users, ChevronRight } from 'lucide-react';

function fmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

const badgeColors = {
  'Bán chạy':       { bg: '#FFF3E0', text: '#E65100' },
  'Mới':            { bg: '#E8F5E9', text: '#2E7D32' },
  'Đánh giá cao nhất': { bg: '#FCE4EC', text: '#AD1457' },
  'Premium':        { bg: '#EDE7F6', text: '#512DA8' },
  'Giá tốt':        { bg: '#E3F2FD', text: '#1565C0' },
};

export default function TourCard({ tour, onClick }) {
  const bc = badgeColors[tour.badge] || {};
  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);

  return (
    <article
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        boxShadow: '0 2px 8px rgba(10,22,40,0.07)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(10,22,40,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(10,22,40,0.07)';
      }}
    >
      {/* Card visual */}
      <div style={{
        background: tour.gradient,
        height: 180,
        position: 'relative',
        display: 'flex', alignItems: 'flex-end',
        padding: 16,
      }}>
        {/* Discount chip */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: '#FF6B35', color: 'white',
            fontSize: 11, fontWeight: 700,
            padding: '3px 9px', borderRadius: 999,
          }}>
            -{discount}%
          </div>
        )}

        {/* Badge */}
        {tour.badge && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: bc.bg, color: bc.text,
            fontSize: 11, fontWeight: 600,
            padding: '3px 9px', borderRadius: 999,
          }}>
            {tour.badge}
          </div>
        )}

        {/* Region pill */}
        <div style={{
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'white', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 999,
        }}>
          {tour.region}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 18px 18px' }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {tour.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: 'var(--text-muted)',
              background: '#F5F5F5', padding: '2px 8px',
              borderRadius: 4, fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 19, fontWeight: 700,
          color: 'var(--navy)', marginBottom: 3,
          lineHeight: 1.25,
        }}>
          {tour.title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
          {tour.subtitle}
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Clock size={14} color="var(--text-muted)" />
            {tour.days} ngày
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            {tour.rating} <span style={{ color: 'var(--text-muted)' }}>({tour.reviews})</span>
          </span>
        </div>

        {/* Price + CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 14, borderTop: '1px solid #F0EDE8',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {fmt(tour.originalPrice)}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20, fontWeight: 700, color: 'var(--navy)',
            }}>
              {fmt(tour.price)}
              <span style={{ fontSize: 12, fontWeight: 400, fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>/người</span>
            </div>
          </div>
          <button style={{
            background: 'var(--navy)', color: 'white',
            border: 'none', borderRadius: 10,
            padding: '9px 16px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            transition: 'background 0.18s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#00C896'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
          >
            Xem chi tiết <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
