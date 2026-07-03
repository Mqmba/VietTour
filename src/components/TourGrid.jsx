import TourCard from './TourCard';

export default function TourGrid({ tours, onSelect, emptyMessage = 'Không tìm thấy tour phù hợp.' }) {
  if (tours.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
      gap: 24,
    }}>
      {tours.map(tour => (
        <TourCard key={tour.id} tour={tour} onClick={() => onSelect(tour)} />
      ))}
    </div>
  );
}
