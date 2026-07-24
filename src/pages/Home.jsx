import { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import TourGrid from '../components/TourGrid';
import TourDetail from '../components/TourDetail';
import BookingModal from '../components/BookingModal';
import { tourAPI } from '../services/api';

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
    subtitle: t.subtitle || (t.description ? t.description.substring(0, 75) + '...' : 'Chuyến đi nghỉ dưỡng lý tưởng dành cho Cá nhân & Gia đình'),
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

export default function Home() {
  const [dbTours, setDbTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);

  // Gọi API lấy dữ liệu Tour thật từ MySQL Database qua Go Backend
  useEffect(() => {
    async function loadToursFromDB() {
      setLoading(true);
      try {
        const res = await tourAPI.getAll();
        // Backend trả về mảng tour hoặc object { data: [...] }
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
    if (regionFilter) list = list.filter(t => t.rawRegion === regionFilter || t.region.toLowerCase().includes(regionFilter.toLowerCase()));
    if (activeCategory !== 'all') list = list.filter(t => t.category === activeCategory);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [dbTours, regionFilter, activeCategory, sortBy]);

  const handleBook = (tour) => {
    setSelectedTour(null);
    setBookingTour(tour);
  };

  return (
    <>
      <Hero onSearch={(dest) => {
        setRegionFilter(dest);
        document.getElementById('tours-section')?.scrollIntoView({ behavior: 'smooth' });
      }} />

      <main id="tours-section" style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00C896', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
            Tour Du Lịch Thực Tế Từ Database
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>
            Hành trình dành cho Cá nhân & Gia đình
          </h2>
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
            <div style={{ fontSize: 16, fontWeight: 600 }}>Đang kết nối Database lấy danh sách Tour...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'white', border: '1.5px solid #E2DDD8', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--navy)', marginBottom: 8 }}>
              Chưa có tour nào trong Database
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Hãy truy cập trang <strong>Quản lý Tour (Admin)</strong> để thêm các tour mới cho Cá nhân & Gia đình!
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

