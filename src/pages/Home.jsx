import { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import TourGrid from '../components/TourGrid';
import TourDetail from '../components/TourDetail';
import BookingModal from '../components/BookingModal';
import { tours } from '../data/tours';

export default function Home() {
  const [regionFilter, setRegionFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);

  const filtered = useMemo(() => {
    let list = [...tours];
    if (regionFilter) list = list.filter(t => t.region === regionFilter);
    if (activeCategory !== 'all') list = list.filter(t => t.category === activeCategory);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [regionFilter, activeCategory, sortBy]);

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
            Tour nổi bật
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2 }}>
            Hành trình dành cho bạn
          </h2>
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
