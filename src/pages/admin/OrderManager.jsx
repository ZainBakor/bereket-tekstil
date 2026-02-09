import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../data/products';
import { Link, Navigate } from 'react-router-dom';
import './OrderManager.css';

const OrderManager = () => {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user || !isAdmin) return;
        fetchOrders();
    }, [user, isAdmin]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const { data, error } = await supabase
                .from('order_items')
                .select(`
                    *,
                    products (
                        name,
                        images
                    )
                `)
                .eq('order_id', orderId);

            if (error) throw error;
            setOrderItems(data || []);
        } catch (error) {
            console.error('Error fetching order items:', error.message);
        }
    };

    const handleViewOrder = async (order) => {
        setSelectedOrder(order);
        setShowModal(true); // Open modal immediately for better responsiveness
        setOrderItems([]); // Clear old items while loading
        try {
            await fetchOrderDetails(order.id);
        } catch (error) {
            console.error('Error in handleViewOrder:', error);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error.message);
            alert('Durum güncellenirken hata oluştu.');
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="admin-loading-screen">
                <div className="admin-loading-content">
                    <span className="spinner"></span>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <main className="order-manager">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="container flex justify-between items-center">
                    <div className="admin-brand">
                        <Link to="/admin/dashboard" className="admin-logo">
                            <span className="logo-text">BEREKET</span>
                            <span className="logo-accent">TEKSTİL</span>
                        </Link>
                        <span className="admin-badge">Sipariş Yönetimi</span>
                    </div>
                    <div className="admin-user">
                        <span>{user.name}</span>
                        <Link to="/admin/dashboard" className="btn btn-sm btn-glass">Dashboard</Link>
                    </div>
                </div>
            </header>

            <div className="admin-content">
                <div className="container">
                    <div className="section-header flex justify-between items-center">
                        <h1>Siparişler</h1>
                        <div className="order-filters">
                            <span className="order-count">Toplam: {orders.length}</span>
                        </div>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sipariş No</th>
                                    <th>Müşteri</th>
                                    <th>Tutar</th>
                                    <th>Tarih</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td><span className="order-id">#{order.order_number}</span></td>
                                        <td>
                                            <div className="customer-cell">
                                                <span className="customer-name">{order.customer_name}</span>
                                                <span className="customer-phone">{order.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td><span className="order-total">{formatPrice(order.total_amount)}</span></td>
                                        <td>{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status === 'pending' ? 'Bekliyor' :
                                                    order.status === 'shipped' ? 'Kargoda' :
                                                        order.status === 'completed' ? 'Tamamlandı' :
                                                            order.status === 'cancelled' ? 'İptal' : order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                Detaylar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-table-msg">Sipariş bulunamadı.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content order-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Sipariş Detayı #{selectedOrder.order_number}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="order-details-grid">
                                <div className="customer-info-box">
                                    <h3>Müşteri Bilgileri</h3>
                                    <p><strong>Ad Soyad:</strong> {selectedOrder.customer_name}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                                    <p><strong>Telefon:</strong> {selectedOrder.customer_phone}</p>
                                    <p><strong>Adres:</strong> {selectedOrder.shipping_address || selectedOrder.customer_address}</p>
                                    <p><strong>İlçe/İl:</strong> {selectedOrder.district} / {selectedOrder.city}</p>
                                    <p><strong>Posta Kodu:</strong> {selectedOrder.postal_code || '-'}</p>
                                    {selectedOrder.notes && (
                                        <div className="order-notes">
                                            <strong>Sipariş Notu:</strong>
                                            <p>{selectedOrder.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="order-status-box">
                                    <h3>Sipariş Durumu</h3>
                                    <div className="status-selector">
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                                            className={`status-select status-${selectedOrder.status}`}
                                        >
                                            <option value="pending">Bekliyor</option>
                                            <option value="shipped">Kargoda</option>
                                            <option value="completed">Tamamlandı</option>
                                            <option value="cancelled">İptal</option>
                                        </select>
                                    </div>
                                    <div className="whatsapp-action mt-lg">
                                        <a
                                            href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}`}
                                            className="btn btn-gold w-full"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Müşteriyle WhatsApp'tan İletişime Geç
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="order-items-list mt-xl">
                                <h3>Sipariş Edilen Ürünler</h3>
                                <div className="items-table-container">
                                    <table className="items-table">
                                        <thead>
                                            <tr>
                                                <th>Ürün</th>
                                                <th>Varyant</th>
                                                <th>Adet</th>
                                                <th>Fiyat</th>
                                                <th>Toplam</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="product-item-cell">
                                                            <img src={item.products?.images?.[0]} alt={item.products?.name} />
                                                            <span>{item.products?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="variant-badges">
                                                            {item.selected_color && <span className="variant-badge">{item.selected_color}</span>}
                                                            {item.selected_size && <span className="variant-badge">{item.selected_size}</span>}
                                                        </div>
                                                    </td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatPrice(item.unit_price)}</td>
                                                    <td><strong>{formatPrice(item.unit_price * item.quantity)}</strong></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="order-summary-total">
                                    <div className="summary-row">
                                        <span>Ara Toplam:</span>
                                        <span>{formatPrice(selectedOrder.total_amount)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Kargo:</span>
                                        <span className="text-success">Ücretsiz</span>
                                    </div>
                                    <div className="summary-row grand-total">
                                        <span>Genel Toplam:</span>
                                        <span>{formatPrice(selectedOrder.cart_total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default OrderManager;
