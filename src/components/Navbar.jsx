import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut, ChevronDown, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

const navLinks = [
  { to: '/tours', label: 'Tour trong nước' },
  { to: '/khuyen-mai', label: 'Khuyến mãi' },
  { to: '/ve-chung-toi', label: 'Về chúng tôi' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleOpenProfile = () => {
    setDropdownOpen(false);
    setIsProfileOpen(true);
  };

  // Get initial for avatar fallback
  const getInitial = () => {
    if (user?.full_name) {
      return user.full_name.trim().charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.trim().charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(247, 243, 238, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2DDD8',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
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

        {/* Navigation & Auth */}
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

          {user ? (
            /* User Profile Dropdown Menu */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'white',
                  border: '1.5px solid #E2DDD8',
                  borderRadius: 24,
                  padding: '5px 14px 5px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: dropdownOpen ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {/* User Avatar */}
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || 'User'}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0A1628, #1A2F4A)',
                    color: 'white',
                    fontWeight: 700, fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {getInitial()}
                  </div>
                )}

                {/* User Name */}
                <span style={{
                  fontSize: 13.5, fontWeight: 600, color: 'var(--navy)',
                  maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.full_name || user.email}
                </span>

                <ChevronDown
                  size={15}
                  color="var(--text-secondary)"
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
                />
              </button>

              {/* Dropdown Menu Popup */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: 240, background: 'white',
                  borderRadius: 14,
                  boxShadow: '0 12px 32px rgba(10,22,40,0.15)',
                  border: '1px solid #E2DDD8',
                  padding: '8px 0',
                  zIndex: 200,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease-out',
                }}>
                  {/* Header Info */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EDE8' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>
                      {user.full_name || 'Khách hàng'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                    {user.role && user.role !== 'customer' && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        marginTop: 6, padding: '2px 8px', borderRadius: 6,
                        background: '#E8F8F4', color: '#00A87A',
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      }}>
                        <ShieldCheck size={12} /> {user.role}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '4px 0' }}>
                    {/* Item: Thông tin cá nhân */}
                    <button
                      onClick={handleOpenProfile}
                      style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px',
                        border: 'none', background: 'transparent',
                        color: 'var(--navy)', fontSize: 13.5, fontWeight: 600,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FAF8F5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <UserCheck size={16} color="#00C896" />
                      Thông tin cá nhân
                    </button>

                    <div style={{ height: 1, background: '#F0EDE8', margin: '4px 0' }} />

                    {/* Item: Đăng xuất */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px',
                        border: 'none', background: 'transparent',
                        color: '#DC2626', fontSize: 13.5, fontWeight: 600,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} color="#DC2626" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login Button if not authenticated */
            <Link to="/dang-nhap" style={{
              background: 'var(--navy)', color: 'white',
              border: 'none', borderRadius: 8,
              padding: '8px 18px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', textDecoration: 'none',
              display: 'inline-block',
            }}>
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
