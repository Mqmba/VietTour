import { useState } from 'react';
import { Search, Calendar, Users, ChevronDown } from 'lucide-react';
import { regions } from '../data/tours';

export default function Hero({ onSearch }) {
  const [dest, setDest] = useState('');
  const [date, setDate] = useState('');
  const [pax, setPax] = useState('2');

  return (
    <section style={{
      background: 'var(--navy)',
      padding: '80px 2rem 100px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,150,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: '30%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,200,150,0.15)',
          border: '1px solid rgba(0,200,150,0.3)',
          borderRadius: 999, padding: '5px 14px',
          marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C896', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#00C896', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            Khám phá Việt Nam
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(38px, 5vw, 64px)',
          fontWeight: 700,
          color: 'white',
          lineHeight: 1.15,
          marginBottom: 20,
          letterSpacing: '-1px',
        }}>
          Mỗi hành trình là<br />
          <em style={{ color: '#00C896', fontStyle: 'italic' }}>một câu chuyện</em>
        </h1>

        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.6)',
          fontWeight: 400, marginBottom: 48,
          maxWidth: 480, lineHeight: 1.7,
        }}>
          Khám phá 63 tỉnh thành với hơn 200 tour được tuyển chọn. Từ vịnh biển
          huyền bí đến bản làng núi cao — Việt Nam đang chờ bạn.
        </p>

        {/* Search box */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '6px 6px 6px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: 0,
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        }}>
          {/* Destination */}
          <div style={{ padding: '12px 20px', borderRight: '1px solid #E2DDD8' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Điểm đến
            </div>
            <select
              value={dest}
              onChange={e => setDest(e.target.value)}
              style={{
                border: 'none', outline: 'none', width: '100%',
                fontSize: 14, fontWeight: 600, color: 'var(--navy)',
                background: 'transparent', cursor: 'pointer',
              }}
            >
              <option value="">Chọn miền...</option>
              {regions.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Date */}
          <div style={{ padding: '12px 20px', borderRight: '1px solid #E2DDD8' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Ngày khởi hành
            </div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                border: 'none', outline: 'none', width: '100%',
                fontSize: 14, fontWeight: 600, color: 'var(--navy)',
                background: 'transparent', cursor: 'pointer',
              }}
            />
          </div>

          {/* Pax */}
          <div style={{ padding: '12px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              Số người
            </div>
            <select
              value={pax}
              onChange={e => setPax(e.target.value)}
              style={{
                border: 'none', outline: 'none', width: '100%',
                fontSize: 14, fontWeight: 600, color: 'var(--navy)',
                background: 'transparent', cursor: 'pointer',
              }}
            >
              {['1', '2', '3', '4', '5+'].map(n => (
                <option key={n} value={n}>{n} người</option>
              ))}
            </select>
          </div>

          {/* Button */}
          <div style={{ padding: '6px 6px 6px 6px' }}>
            <button
              onClick={() => onSearch(dest)}
              style={{
                background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
                color: 'white', border: 'none',
                borderRadius: 12, padding: '14px 24px',
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer', height: '100%',
                display: 'flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Search size={16} />
              Tìm tour
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
          {[
            { n: '200+', label: 'Tour được tuyển chọn' },
            { n: '50K+', label: 'Khách hài lòng' },
            { n: '63', label: 'Tỉnh thành' },
          ].map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'white' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
