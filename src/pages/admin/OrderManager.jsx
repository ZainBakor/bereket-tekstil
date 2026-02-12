import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../data/products';
import { Link, Navigate } from 'react-router-dom';
import './OrderManager.css';

const OrderManager = () => {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
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
        setIsLoadingItems(true);
        try {
            // First, get the items to ensure we have the basic data
            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            if (itemsError) throw itemsError;

            if (!items || items.length === 0) {
                setOrderItems([]);
                return;
            }

            // Now, try to enrich with product data
            const productIds = [...new Set(items.map(item => item.product_id))];
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('id, name, images')
                .in('id', productIds);

            // Map products back to items
            const enrichedItems = items.map(item => ({
                ...item,
                products: products?.find(p => p.id === item.product_id) || null
            }));

            console.log('Enriched order items:', enrichedItems);
            setOrderItems(enrichedItems);
        } catch (error) {
            console.error('Error fetching order items:', error.message);
            // Final fallback: try the original join if the manual enrichment failed for some reason
            try {
                const { data, error: joinError } = await supabase
                    .from('order_items')
                    .select('*, products(id, name, images)')
                    .eq('order_id', orderId);
                if (!joinError) setOrderItems(data || []);
            } catch (innerError) {
                console.error('Fallback join failed:', innerError);
            }
        } finally {
            setIsLoadingItems(false);
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

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            // 1. Delete order items first (due to foreign key)
            const { error: itemsError } = await supabase
                .from('order_items')
                .delete()
                .eq('order_id', orderId);

            if (itemsError) throw itemsError;

            // 2. Delete the order
            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (orderError) throw orderError;

            setOrders(prev => prev.filter(o => o.id !== orderId));
            setShowModal(false);
            alert('Sipariş başarıyla silindi.');
        } catch (error) {
            console.error('Error deleting order:', error.message);
            alert('Sipariş silinirken hata oluştu: ' + error.message);
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

    const handleDownloadPDF = () => {
        window.print();
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
                        {/* Desktop Table View */}
                        <table className="admin-table desktop-only">
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
                                            <div className="flex gap-sm">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    Detaylar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteOrder(order.id);
                                                    }}
                                                    title="Siparişi Sil"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="order-cards mobile-only">
                            {orders.map(order => (
                                <div key={order.id} className="order-card" onClick={() => handleViewOrder(order)}>
                                    <div className="order-card-header">
                                        <span className="order-id">#{order.order_number}</span>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status === 'pending' ? 'Bekliyor' :
                                                order.status === 'shipped' ? 'Kargoda' :
                                                    order.status === 'completed' ? 'Tamamlandı' :
                                                        order.status === 'cancelled' ? 'İptal' : order.status}
                                        </span>
                                    </div>
                                    <div className="order-card-body">
                                        <div className="info-row">
                                            <span className="label">Müşteri:</span>
                                            <span className="value">{order.customer_name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Tarih:</span>
                                            <span className="value">{new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Tutar:</span>
                                            <span className="value order-total">{formatPrice(order.total_amount)}</span>
                                        </div>
                                    </div>
                                    <div className="order-card-footer">
                                        <button
                                            className="btn-delete-card"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteOrder(order.id);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                        </button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {orders.length === 0 && (
                            <div className="empty-table-msg">Sipariş bulunamadı.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content order-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-group">
                                <h2>Sipariş Detayı #{selectedOrder.order_number}</h2>
                                <button className="btn-print no-print" onClick={handleDownloadPDF}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                                    </svg>
                                    PDF / Yazdır
                                </button>
                            </div>
                            <button className="close-btn no-print" onClick={() => setShowModal(false)}>&times;</button>
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
                                    <div className="whatsapp-action mt-lg no-print">
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
                                <div className="modal-items-container">
                                    {isLoadingItems ? (
                                        <div className="items-loading">
                                            <span className="spinner"></span>
                                            <p>Ürünler yükleniyor...</p>
                                        </div>
                                    ) : orderItems.length > 0 ? (
                                        <>
                                            {/* Desktop Table View */}
                                            <table className="items-table items-table-desktop">
                                                <thead>
                                                    <tr>
                                                        <th>Ürün</th>
                                                        <th>Varyant</th>
                                                        <th>Adet</th>
                                                        <th>Fiyat</th>
                                                        <th>Toplam</th>
                                                        <th>Link</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderItems.map(item => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <div className="product-item-cell">
                                                                    <img
                                                                        src={item.products?.images?.[0] || 'https://via.placeholder.com/50'}
                                                                        alt={item.products?.name || 'Ürün'}
                                                                    />
                                                                    <span>{item.products?.name || `Ürün (ID: ${item.product_id})`}</span>
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
                                                            <td>
                                                                <a
                                                                    href={`${window.location.origin}/urun/${item.product_id}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="item-product-link no-print"
                                                                >
                                                                    Ürüne Git
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Mobile Item Cards View */}
                                            <div className="items-cards-mobile">
                                                {orderItems.map(item => (
                                                    <div key={item.id} className="item-mobile-card">
                                                        <div className="item-card-main">
                                                            <img
                                                                src={item.products?.images?.[0] || 'https://via.placeholder.com/50'}
                                                                alt={item.products?.name || 'Ürün'}
                                                            />
                                                            <div className="item-card-info">
                                                                <h4>{item.products?.name || `Ürün (ID: ${item.product_id})`}</h4>
                                                                <div className="item-card-variants">
                                                                    {item.selected_color && <span className="v-tag">{item.selected_color}</span>}
                                                                    {item.selected_size && <span className="v-tag">{item.selected_size}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="item-card-details">
                                                            <div className="detail-line">
                                                                <span>Birim Fiyat:</span>
                                                                <span>{formatPrice(item.unit_price)}</span>
                                                            </div>
                                                            <div className="detail-line">
                                                                <span>Adet:</span>
                                                                <span>x{item.quantity}</span>
                                                            </div>
                                                            <div className="detail-line total">
                                                                <span>Toplam:</span>
                                                                <span>{formatPrice(item.unit_price * item.quantity)}</span>
                                                            </div>
                                                            <a
                                                                href={`${window.location.origin}/urun/${item.product_id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="card-link"
                                                            >
                                                                Ürünü Gör
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="items-empty">
                                            <p>Bu siparişe ait ürün bulunamadı veya silinmiş olabilir.</p>
                                        </div>
                                    )}
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
                                        <span>{formatPrice(selectedOrder.total_amount)}</span>
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
