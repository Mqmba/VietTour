import { Link, NavLink } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const navLinks = [
  { to: '/tours', label: 'Tour trong nước' },
  { to: '/khuyen-mai', label: 'Khuyến mãi' },
  { to: '/ve-chung-toi', label: 'Về chúng tôi' },
];

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(247, 243, 238, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2DDD8',
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        textDecoration: 'none', cursor: 'pointer',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPin size={16} color="white" strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 700,
          color: 'var(--navy)',
          letterSpacing: '-0.5px',
        }}>
          Viet<span style={{ color: '#00C896' }}>Tour</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {navLinks.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              fontFamily: 'var(--font-ui)',
              fontSize: 14, fontWeight: 500,
              color: isActive ? 'var(--navy)' : 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              borderBottom: isActive ? '2px solid #00C896' : '2px solid transparent',
              paddingBottom: 4,
            })}
          >
            {item.label}
          </NavLink>
        ))}
        <Link to="/dang-nhap" style={{
          background: 'var(--navy)', color: 'white',
          border: 'none', borderRadius: 8,
          padding: '8px 18px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', textDecoration: 'none',
          display: 'inline-block',
        }}>
          Đăng nhập
        </Link>
      </div>
    </nav>
  );
}
