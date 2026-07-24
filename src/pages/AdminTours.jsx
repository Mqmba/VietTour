import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ShieldCheck, Search, Check, AlertCircle, Eye, RefreshCw, Users, MapPin } from 'lucide-react';
import { adminAPI, tourAPI } from '../services/api';

function fmtMoney(n) {
    if (!n) return '0đ';
    return Math.round(n).toLocaleString('vi-VN') + 'đ';
}

export default function AdminTours() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Modal State (Thêm / Sửa)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        category_id: 1,
        region: 'mien-bac',
        duration_days: 3,
        price: 3500000,
        original_price: 4200000,
        max_pax: 15,
        status: 'published',
    });

    // Tải danh sách tour từ Backend Admin API
    const fetchAdminTours = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await adminAPI.getTours();
            setTours(Array.isArray(data) ? data : []);

            // Lấy danh mục
            const cats = await tourAPI.getCategories();
            setCategories(Array.isArray(cats) ? cats : []);
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách tour quản trị.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Kiểm tra quyền Admin
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (!user || user.role !== 'admin') {
                // Nếu không phải admin, mở thông báo hoặc vẫn cho xem để test demo
                console.warn('Lưu ý: Bạn đang vào trang Admin với quyền:', user?.role || 'Chưa đăng nhập');
            }
        } catch (e) {
            console.error(e);
        }

        fetchAdminTours();
    }, []);

    // Mở modal Thêm Tour mới
    const handleOpenAdd = () => {
        setEditingTour(null);
        setForm({
            title: '',
            subtitle: 'Tour du lịch hấp dẫn dành cho Cá nhân & Gia đình',
            description: 'Lịch trình phong phú, trải nghiệm trọn vẹn và an toàn...',
            category_id: categories[0]?.id || 1,
            region: 'mien-bac',
            duration_days: 3,
            price: 3500000,
            original_price: 4200000,
            max_pax: 15,
            status: 'published',
        });
        setIsModalOpen(true);
    };

    // Mở modal Sửa Tour
    const handleOpenEdit = (tour) => {
        setEditingTour(tour);
        setForm({
            title: tour.title || '',
            subtitle: tour.subtitle || '',
            description: tour.description || '',
            category_id: tour.category_id || 1,
            region: tour.region || 'mien-bac',
            duration_days: tour.duration_days || 3,
            price: tour.price || 0,
            original_price: tour.original_price || tour.price || 0,
            max_pax: tour.max_pax || 20,
            status: tour.status || 'published',
        });
        setIsModalOpen(true);
    };

    // Xóa Tour
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tour này khỏi hệ thống?')) return;
        try {
            await adminAPI.deleteTour(id);
            await fetchAdminTours();
        } catch (err) {
            alert('Lỗi xóa tour: ' + err.message);
        }
    };

    // Submit Form (Tạo mới hoặc Cập nhật)
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...form,
            category_id: Number(form.category_id),
            duration_days: Number(form.duration_days),
            price: Number(form.price),
            original_price: Number(form.original_price),
            max_pax: Number(form.max_pax),
            slug: form.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        };

        try {
            if (editingTour) {
                await adminAPI.updateTour(editingTour.id, payload);
            } else {
                await adminAPI.createTour(payload);
            }
            setIsModalOpen(false);
            await fetchAdminTours();
        } catch (err) {
            alert('Lỗi lưu tour: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Lọc tour theo tìm kiếm
    const filteredTours = tours.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.region?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 64px - 70px)', background: '#FAF8F5', padding: '40px 24px' }}>
            <div style={{ maxWidth: 1120, margin: '0 auto' }}>

                {/* Top Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#00C896', textTransform: 'uppercase', letterSpacing: 1 }}>
                            <ShieldCheck size={16} /> Trang Quản Trị Admin
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>
                            Quản lý Tour Du Lịch
                        </h1>
                        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                            Dành cho đối tượng khách hàng: <strong>Cá nhân & Gia đình</strong>
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={fetchAdminTours}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                                background: 'white', border: '1.5px solid #E2DDD8', borderRadius: 10,
                                fontSize: 13.5, fontWeight: 600, color: 'var(--navy)', cursor: 'pointer',
                            }}
                        >
                            <RefreshCw size={15} /> Làm mới
                        </button>
                        <button
                            onClick={handleOpenAdd}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                                background: 'linear-gradient(135deg, #00C896, #0A7A5E)', color: 'white',
                                border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(0,200,150,0.3)',
                            }}
                        >
                            <Plus size={18} /> Thêm Tour Mới
                        </button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', border: '1.5px solid #E2DDD8', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tour theo tên hoặc miền..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, fontFamily: 'var(--font-ui)', color: 'var(--navy)' }}
                    />
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: 16, fontWeight: 600 }}>Đang tải dữ liệu Tour từ Database...</div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Tour Table */}
                {!loading && !error && (
                    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E2DDD8', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
                            <thead>
                                <tr style={{ background: '#FAF8F5', borderBottom: '1.5px solid #E2DDD8', color: 'var(--navy)', fontWeight: 700 }}>
                                    <th style={{ padding: '14px 20px' }}>Tên Tour & Miền</th>
                                    <th style={{ padding: '14px 16px' }}>Thời gian / Khách</th>
                                    <th style={{ padding: '14px 16px' }}>Giá vé / Người</th>
                                    <th style={{ padding: '14px 16px' }}>Nhóm khách hàng</th>
                                    <th style={{ padding: '14px 16px' }}>Trạng thái</th>
                                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTours.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            Chưa có tour nào trong Database. Bấm <strong>"Thêm Tour Mới"</strong> để tạo tour đầu tiên!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTours.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #F0EDE8', transition: 'background 0.15s' }}>
                                            <td style={{ padding: '16px 20px' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14.5 }}>{t.title}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MapPin size={12} color="#00C896" />
                                                    <span>Miền: {t.region}</span>
                                                    <span>• ID: #{t.id}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                                                <div>{t.duration_days} ngày</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tối đa {t.max_pax || 20} người</div>
                                            </td>
                                            <td style={{ padding: '16px 16px' }}>
                                                <div style={{ fontWeight: 700, color: '#00A87A', fontSize: 14 }}>{fmtMoney(t.price)}</div>
                                                {t.original_price > t.price && (
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                                        {fmtMoney(t.original_price)}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px 16px' }}>
                                                <span style={{
                                                    fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 6,
                                                    background: '#E0F2FE', color: '#0369A1', display: 'inline-block'
                                                }}>
                                                    👨‍👩‍👧‍👦 Cá nhân & Gia đình
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 16px' }}>
                                                <span style={{
                                                    fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                                                    background: t.status === 'published' ? '#D1FAE5' : '#FEF3C7',
                                                    color: t.status === 'published' ? '#059669' : '#D97706',
                                                }}>
                                                    {t.status === 'published' ? 'Công khai' : 'Nháp'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleOpenEdit(t)}
                                                        title="Sửa tour"
                                                        style={{
                                                            background: '#F0EDE8', border: 'none', borderRadius: 8, padding: '8px',
                                                            cursor: 'pointer', color: 'var(--navy)'
                                                        }}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(t.id)}
                                                        title="Xóa tour"
                                                        style={{
                                                            background: '#FEE2E2', border: 'none', borderRadius: 8, padding: '8px',
                                                            cursor: 'pointer', color: '#DC2626'
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Popup Form Thêm / Sửa Tour */}
            {isModalOpen && (
                <>
                    <div onClick={() => setIsModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(4px)', zIndex: 400 }} />
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 'min(580px, calc(100vw - 32px))', background: 'white', borderRadius: 20,
                        padding: '28px 28px', zIndex: 401, boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 18 }}>
                            {editingTour ? `Chỉnh Sửa Tour #${editingTour.id}` : 'Thêm Tour Du Lịch Mới'}
                        </h2>

                        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Tên Tour *</label>
                                <input
                                    type="text" required placeholder="Ví dụ: Du Thuyền Hạ Long 5 Sao 2N1Đ"
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Tiêu đề phụ / Mô tả ngắn</label>
                                <input
                                    type="text" placeholder="Dành cho Cá nhân & Gia đình nghỉ dưỡng..."
                                    value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Miền *</label>
                                    <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={inputStyle}>
                                        <option value="mien-bac">Miền Bắc</option>
                                        <option value="mien-trung">Miền Trung</option>
                                        <option value="mien-nam">Miền Nam</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Số ngày đi *</label>
                                    <input
                                        type="number" min={1} required value={form.duration_days}
                                        onChange={e => setForm({ ...form, duration_days: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Giá bán (VNĐ) *</label>
                                    <input
                                        type="number" min={0} required value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Giá gốc (Gốc chưa giảm)</label>
                                    <input
                                        type="number" min={0} value={form.original_price}
                                        onChange={e => setForm({ ...form, original_price: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Số khách tối đa</label>
                                    <input
                                        type="number" min={1} value={form.max_pax}
                                        onChange={e => setForm({ ...form, max_pax: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Trạng thái</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                                        <option value="published">Công khai (Published)</option>
                                        <option value="draft">Bản nháp (Draft)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 4 }}>Mô tả chi tiết Tour</label>
                                <textarea
                                    rows={4} value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Lịch trình chi tiết ngày 1, ngày 2..."
                                    style={{ ...inputStyle, fontFamily: 'sans-serif' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                <button
                                    type="button" onClick={() => setIsModalOpen(false)}
                                    style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #E2DDD8', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit" disabled={submitting}
                                    style={{ flex: 1.5, padding: '12px', background: 'linear-gradient(135deg, #00C896, #0A7A5E)', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                                >
                                    {submitting ? 'Đang lưu...' : (editingTour ? 'Cập Nhật Tour' : 'Thêm Tour Mới')}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #E2DDD8', borderRadius: 8,
    fontSize: 13.5, color: 'var(--navy)', outline: 'none', fontFamily: 'var(--font-ui)',
};
