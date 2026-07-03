import { MapPin, Users, Award, Heart } from 'lucide-react';

const stats = [
  { icon: <MapPin size={22} />, n: '63', label: 'Tỉnh thành phủ sóng' },
  { icon: <Users size={22} />, n: '50,000+', label: 'Khách hàng tin tưởng' },
  { icon: <Award size={22} />, n: '8', label: 'Năm kinh nghiệm' },
  { icon: <Heart size={22} />, n: '4.8/5', label: 'Đánh giá trung bình' },
];

const team = [
  { name: 'Nguyễn Minh Anh', role: 'Nhà sáng lập & CEO', emoji: '👩‍💼' },
  { name: 'Trần Quốc Bảo', role: 'Trưởng phòng Vận hành', emoji: '👨‍💼' },
  { name: 'Lê Thị Hương', role: 'Trưởng phòng Tư vấn', emoji: '👩‍💻' },
];

const values = [
  { title: 'Trải nghiệm chân thực', desc: 'Mỗi tour được thiết kế để khách hàng cảm nhận trọn vẹn văn hóa và con người địa phương.' },
  { title: 'Giá minh bạch', desc: 'Không phụ phí ẩn, giá hiển thị là giá cuối cùng bạn thanh toán.' },
  { title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng đồng hành cùng bạn trước, trong và sau chuyến đi.' },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--navy)', padding: '64px 24px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#00C896', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
            Câu chuyện của chúng tôi
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'white', marginBottom: 18, lineHeight: 1.2 }}>
            Kết nối người Việt với<br /><em style={{ color: '#00C896', fontStyle: 'italic' }}>vẻ đẹp quê hương</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
            VietTour ra đời năm 2018 với một niềm tin đơn giản: người Việt xứng đáng được khám phá
            chính đất nước mình một cách dễ dàng, minh bạch và đáng nhớ.
          </p>
        </div>
      </div>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20, marginBottom: 64,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 16,
              padding: '24px 20px', textAlign: 'center',
              border: '1px solid #EEEAE5',
            }}>
              <div style={{
                color: '#00C896', display: 'flex', justifyContent: 'center', marginBottom: 10,
              }}>
                {s.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--navy)' }}>
                {s.n}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--navy)', marginBottom: 28, textAlign: 'center' }}>
            Giá trị cốt lõi
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {values.map((v, i) => (
              <div key={v.title} style={{
                background: 'white', borderRadius: 16,
                padding: '24px', border: '1px solid #EEEAE5',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: '#E8F8F4', color: '#0A7A5E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
                  marginBottom: 14,
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--navy)', marginBottom: 28, textAlign: 'center' }}>
            Đội ngũ của chúng tôi
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {team.map(person => (
              <div key={person.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C896, #0A7A5E)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, margin: '0 auto 14px',
                }}>
                  {person.emoji}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{person.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{person.role}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
