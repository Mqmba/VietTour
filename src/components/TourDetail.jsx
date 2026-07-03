import { X, Star, Clock, Users, CheckCircle, ChevronRight, MapPin } from 'lucide-react';

function fmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export default function TourDetail({ tour, onClose, onBook }) {
  if (!tour) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(10,22,40,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(560px, 100vw)',
        background: 'var(--cream)',
        zIndex: 201,
        overflowY: 'auto',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header visual */}
        <div style={{
          background: tour.gradient,
          height: 220,
          position: 'relative',
          display: 'flex', alignItems: 'flex-end',
          padding: '20px 28px',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white',
            }}
          >
            <X size={18} />
          </button>
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', fontSize: 11, fontWeight: 600,
              padding: '3px 10px', borderRadius: 999,
              display: 'inline-block', marginBottom: 8,
            }}>
              {tour.region}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30, fontWeight: 700,
              color: 'white', lineHeight: 1.2,
            }}>
              {tour.title}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
              {tour.subtitle}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Meta chips */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { icon: <Clock size={14} />, label: `${tour.days} ngày` },
              { icon: <Star size={14} color="#F59E0B" fill="#F59E0B" />, label: `${tour.rating}/5 (${tour.reviews} đánh giá)` },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1px solid #E2DDD8',
                borderRadius: 8, padding: '7px 14px',
                fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
              }}>
                {item.icon} {item.label}
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Điểm nổi bật
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {tour.highlights.map(h => (
                <div key={h} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'white', borderRadius: 8,
                  padding: '9px 12px', fontSize: 13, color: 'var(--text-primary)',
                  border: '1px solid #EEEAE5',
                }}>
                  <CheckCircle size={14} color="#00C896" strokeWidth={2.5} />
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
              Lịch trình
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {tour.itinerary.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < tour.itinerary.length - 1 ? 20 : 0 }}>
                  {/* Timeline dot + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--navy)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {item.day}
                    </div>
                    {i < tour.itinerary.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: '#E2DDD8', marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 4 }}>{item.title}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Đã bao gồm
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tour.includes.map(inc => (
                <span key={inc} style={{
                  background: '#E8F8F4', color: '#0A7A5E',
                  fontSize: 12, fontWeight: 600,
                  padding: '5px 12px', borderRadius: 999,
                  border: '1px solid #B2E8D8',
                }}>
                  ✓ {inc}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: 'var(--navy)', borderRadius: 16,
            padding: '20px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                {fmt(tour.originalPrice)}/người
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26, fontWeight: 700, color: 'white',
              }}>
                {fmt(tour.price)}
                <span style={{ fontSize: 13, fontWeight: 400, fontFamily: 'var(--font-ui)', color: 'rgba(255,255,255,0.5)' }}>/người</span>
              </div>
            </div>
            <button
              onClick={() => onBook(tour)}
              style={{
                background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
                color: 'white', border: 'none',
                borderRadius: 12, padding: '14px 24px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Đặt tour ngay <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
