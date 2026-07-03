import { useState, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import TourGrid from '../components/TourGrid';
import TourDetail from '../components/TourDetail';
import BookingModal from '../components/BookingModal';
import { tours, regions } from '../data/tours';

export default function Tours() {
  const [region, setRegion] = useState('Tất cả');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);

  const filtered = useMemo(() => {
    let list = [...tours];
    if (region !== 'Tất cả') list = list.filter(t => t.region === region);
    if (activeCategory !== 'all') list = list.filter(t => t.category === activeCategory);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [region, activeCategory, sortBy]);

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
            Toàn bộ tour
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'white', marginBottom: 12 }}>
            Tour du lịch trong nước
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520 }}>
            Khám phá {tours.length} hành trình được tuyển chọn khắp 3 miền Việt Nam.
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

        <TourGrid tours={filtered} onSelect={setSelectedTour} />
      </main>

      <TourDetail tour={selectedTour} onClose={() => setSelectedTour(null)} onBook={handleBook} />
      <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} />
    </>
  );
}
