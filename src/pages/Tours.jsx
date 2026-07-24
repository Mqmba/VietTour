import { useState, useEffect, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import TourGrid from '../components/TourGrid';
import TourDetail from '../components/TourDetail';
import BookingModal from '../components/BookingModal';
import { tourAPI } from '../services/api';

const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];

function normalizeTour(t) {
  const gradients = [
    'linear-gradient(135deg, #0A1628 0%, #1A2F4A 100%)',
    'linear-gradient(135deg, #05445E 0%, #189AB4 100%)',
    'linear-gradient(135deg, #023047 0%, #2A9D8F 100%)',
    'linear-gradient(135deg, #1B263B 0%, #415A77 100%)',
  ];

  const coverImg = t.images?.find(i => i.is_cover)?.url || t.images?.[0]?.url;

  return {
    id: t.id,
    title: t.title,
    subtitle: t.subtitle || (t.description ? t.description.substring(0, 75) + '...' : 'Tour nghỉ dưỡng dành cho Cá nhân & Gia đình'),
    description: t.description || '',
    price: Number(t.price) || 0,
    originalPrice: Number(t.original_price) || Number(t.price) || 0,
    days: t.duration_days || 3,
    region: t.region === 'mien-bac' ? 'Miền Bắc' : t.region === 'mien-trung' ? 'Miền Trung' : t.region === 'mien-nam' ? 'Miền Nam' : (t.region || 'Việt Nam'),
    rawRegion: t.region,
    rating: Number(t.avg_rating) || 5.0,
    reviews: t.review_count || 0,
    gradient: coverImg ? `url(${coverImg}) center/cover` : gradients[t.id % gradients.length],
    tags: t.category?.name ? [t.category.name, 'Cá nhân & Gia đình'] : ['Cá nhân & Gia đình'],
  };
}

export default function Tours() {
  const [dbTours, setDbTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('Tất cả');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);

  useEffect(() => {
    async function loadToursFromDB() {
      setLoading(true);
      try {
        const res = await tourAPI.getAll();
        const rawList = Array.isArray(res) ? res : (res?.data || []);
        const normalized = rawList.map(normalizeTour);
        setDbTours(normalized);
      } catch (err) {
        console.error('Không thể tải tour từ database:', err);
      } finally {
        setLoading(false);
      }
    }

    loadToursFromDB();
  }, []);

  const filtered = useMemo(() => {
    let list = [...dbTours];
    if (region !== 'Tất cả') list = list.filter(t => t.region === region);
    if (activeCategory !== 'all') list = list.filter(t => t.category === activeCategory);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [dbTours, region, activeCategory, sortBy]);

  const handleBook = (tour) => {
    setSelectedTour(null);
    setBookingTour(tour);
  };

  return (
    <>
      {/* Page header */}
      <div style={{ background: 'var(--navy)', padding: '56px 24px 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00C896', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            Danh Sách Tour Từ Database
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'white', marginBottom: 12 }}>
            Tour du lịch cho Cá nhân & Gia đình
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520 }}>
            Khám phá các hành trình thực tế từ cơ sở dữ liệu VietTour.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Region tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              style={{
                padding: '9px 20px',
                borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid',
                transition: 'all 0.18s',
                ...(region === r
                  ? { background: '#00C896', color: 'white', borderColor: '#00C896' }
                  : { background: 'white', color: 'var(--text-secondary)', borderColor: '#E2DDD8' }),
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          count={filtered.length}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Đang tải danh sách Tour từ Database...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'white', border: '1.5px solid #E2DDD8', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>
              Không tìm thấy tour phù hợp trong Database
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Hãy đăng nhập tài khoản <strong>Admin</strong> để thêm các tour mới!
            </p>
          </div>
        ) : (
          <TourGrid tours={filtered} onSelect={setSelectedTour} />
        )}
      </main>

      <TourDetail tour={selectedTour} onClose={() => setSelectedTour(null)} onBook={handleBook} />
      <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} />
    </>
  );
}

