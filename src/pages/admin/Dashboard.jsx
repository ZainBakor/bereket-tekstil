import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../data/products';
import './Dashboard.css';

const Dashboard = () => {
    const { user, isAdmin, logout, isLoading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user || !isAdmin) return;
            setIsLoading(true);
            try {
                const [prodRes, catRes, orderRes] = await Promise.all([
                    supabase.from('products').select('*').order('created_at', { ascending: false }),
                    supabase.from('categories').select('*'),
                    supabase.from('orders').select('*').order('created_at', { ascending: false })
                ]);

                if (prodRes.error) throw prodRes.error;
                if (catRes.error) throw catRes.error;
                if (orderRes.error) throw orderRes.error;

                setProducts(prodRes.data || []);
                setCategories(catRes.data || []);
                setOrders(orderRes.data || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, isAdmin]);

    if (authLoading || isLoading) {
        return (
            <div className="admin-loading-screen">
                <div className="admin-loading-content">
                    <span className="spinner"></span>
                    <p>Yükleniyor...</p>
                    <button onClick={logout} className="btn btn-sm btn-glass mt-md">
                        İptal Et / Çıkış Yap
                    </button>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    const stats = [
        {
            title: 'Toplam Ürün',
            value: products.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            ),
            color: '#d4af37'
        },
        {
            title: 'Kategoriler',
            value: categories.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            color: '#e94560'
        },
        {
            title: 'Bekleyen Sipariş',
            value: orders.filter(o => o.status === 'pending').length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            color: '#667eea'
        },
        {
            title: 'Öne Çıkan',
            value: products.filter(p => p.featured).length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            color: '#10b981'
        }
    ];

    const quickLinks = [
        { title: 'Ürün Ekle', path: '/admin/urunler', icon: '+' },
        { title: 'Tüm Ürünler', path: '/admin/urunler', icon: '📦' },
        { title: 'Siparişler', path: '/admin/siparisler', icon: '📋' },
        { title: 'Galeri Yönetimi', path: '/admin/galeri', icon: '🖼️' },
        { title: 'Siteye Git', path: '/', icon: '🌐' }
    ];

    return (
        <main className="admin-dashboard">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="container flex justify-between items-center">
                    <div className="admin-brand">
                        <Link to="/" className="admin-logo">
                            <span className="logo-text">BEREKET</span>
                            <span className="logo-accent">TEKSTİL</span>
                        </Link>
                        <span className="admin-badge">Admin Panel</span>
                    </div>
                    <div className="admin-user">
                        <span className="user-welcome">Hoş geldin, {user.name}</span>
                        <div className="admin-actions">
                            <button
                                onClick={() => logout(false)}
                                className="btn btn-sm btn-glass"
                                title="Bu cihazdan çıkış yap"
                            >
                                Çıkış Yap
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Tüm cihazlardaki oturumunuz kapatılacak. Emin misiniz?')) {
                                        logout(true);
                                    }
                                }}
                                className="btn btn-sm btn-danger ml-sm"
                                title="Tüm cihazlardan çıkış yap"
                            >
                                Güvenli Çıkış (Tüm Cihazlar)
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="admin-content">
                <div className="container">
                    <h1>Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-title">{stat.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <section className="quick-actions">
                        <h2>Hızlı İşlemler</h2>
                        <div className="actions-grid">
                            {quickLinks.map((link, index) => (
                                <Link key={index} to={link.path} className="action-card">
                                    <span className="action-icon">{link.icon}</span>
                                    <span>{link.title}</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Recent Products */}
                    <section className="recent-products">
                        <div className="section-header flex justify-between items-center">
                            <h2>Son Eklenen Ürünler</h2>
                            <Link to="/admin/urunler" className="btn btn-sm btn-glass">
                                Tümünü Gör
                            </Link>
                        </div>
                        <div className="products-table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Ürün</th>
                                        <th>Kategori</th>
                                        <th>Fiyat</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.slice(0, 5).map(product => {
                                        const category = categories.find(c => c.id === product.category_id);
                                        return (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="product-cell">
                                                        <img src={product.images?.[0]} alt={product.name} />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td>{category?.name || '-'}</td>
                                                <td>₺{product.price}</td>
                                                <td>
                                                    <span className={`status-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                                        {product.in_stock ? 'Stokta' : 'Tükendi'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Recent Orders */}
                    <section className="recent-products mt-xl">
                        <div className="section-header flex justify-between items-center">
                            <h2>Son Siparişler</h2>
                            <Link to="/admin/siparisler" className="btn btn-sm btn-glass">
                                Tümünü Gör
                            </Link>
                        </div>
                        <div className="products-table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Sipariş No</th>
                                        <th>Müşteri</th>
                                        <th>Tutar</th>
                                        <th>Durum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id}>
                                            <td><span className="order-id">#{order.order_number}</span></td>
                                            <td>{order.customer_name}</td>
                                            <td>{formatPrice(order.total_amount)}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status}`}>
                                                    {order.status === 'pending' ? 'Bekliyor' :
                                                        order.status === 'shipped' ? 'Kargoda' :
                                                            order.status === 'completed' ? 'Tamamlandı' :
                                                                order.status === 'cancelled' ? 'İptal' : order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="empty-table-msg">Sipariş bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
