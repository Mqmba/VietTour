import { SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/tours';

export default function FilterBar({ activeCategory, setActiveCategory, sortBy, setSortBy, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12, marginBottom: 28,
    }}>
      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              border: '1.5px solid',
              transition: 'all 0.18s',
              ...(activeCategory === cat.id
                ? {
                    background: 'var(--navy)', color: 'white',
                    borderColor: 'var(--navy)',
                  }
                : {
                    background: 'white', color: 'var(--text-secondary)',
                    borderColor: '#E2DDD8',
                  }),
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Right side: count + sort */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {count} tour
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SlidersHorizontal size={14} color="var(--text-muted)" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              border: '1.5px solid #E2DDD8', borderRadius: 8,
              padding: '6px 10px', fontSize: 13, fontWeight: 500,
              color: 'var(--navy)', background: 'white',
              cursor: 'pointer', outline: 'none',
              fontFamily: 'var(--font-ui)',
            }}
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="price-asc">Giá thấp → cao</option>
            <option value="price-desc">Giá cao → thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
}
