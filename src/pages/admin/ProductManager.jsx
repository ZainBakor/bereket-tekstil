import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { products as initialProducts, categories, formatPrice } from '../../data/products';
import './ProductManager.css';

const ProductManager = () => {
    const { user, isAdmin, logout, isLoading } = useAuth();
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    if (isLoading) {
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

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    return (
        <main className="admin-page product-manager">
            {/* Admin Header */}
            <header className="admin-header">
                <div className="container flex justify-between items-center">
                    <div className="admin-brand">
                        <Link to="/admin/dashboard" className="admin-logo">
                            <span className="logo-text">BEREKET</span>
                            <span className="logo-accent">TEKSTİL</span>
                        </Link>
                        <span className="admin-badge">Ürün Yönetimi</span>
                    </div>
                    <div className="admin-nav">
                        <Link to="/admin/dashboard" className="btn btn-sm btn-glass">
                            Dashboard
                        </Link>
                        <button onClick={logout} className="btn btn-sm btn-glass">
                            Çıkış
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="admin-content">
                <div className="container">
                    {/* Page Header */}
                    <div className="page-header-inline">
                        <h1>Ürün Yönetimi</h1>
                        <button className="btn btn-gold" onClick={handleAdd}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Yeni Ürün Ekle
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="filters-bar">
                        <div className="search-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">Tüm Kategoriler</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Products Table */}
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Ürün</th>
                                    <th>Kategori</th>
                                    <th>Fiyat</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => {
                                    const category = categories.find(c => c.id === product.category);
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="product-cell">
                                                    <img src={product.images?.[0]} alt={product.name} />
                                                    <div>
                                                        <span className="product-name">{product.name}</span>
                                                        <span className="product-id">ID: {product.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{category?.name || '-'}</td>
                                            <td>
                                                <div className="price-cell">
                                                    <span className="current">{formatPrice(product.price)}</span>
                                                    {product.oldPrice && (
                                                        <span className="old">{formatPrice(product.oldPrice)}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                                    {product.inStock ? 'Stokta' : 'Tükendi'}
                                                </span>
                                                {product.featured && <span className="featured-badge">Öne Çıkan</span>}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => handleEdit(product)}
                                                        title="Düzenle"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleDelete(product.id)}
                                                        title="Sil"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredProducts.length === 0 && (
                            <div className="no-results">
                                <p>Ürün bulunamadı</p>
                            </div>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="results-info">
                        Toplam {filteredProducts.length} ürün
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal Placeholder */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-note">
                                Bu demo sürümde ürün ekleme/düzenleme işlemi simüle edilmektedir.
                                Gerçek bir veritabanı entegrasyonu için Supabase kullanabilirsiniz.
                            </p>
                            <div className="form-group">
                                <label className="form-label">Ürün Adı</label>
                                <input type="text" className="form-input" defaultValue={editingProduct?.name || ''} placeholder="Ürün adı girin" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Fiyat (₺)</label>
                                    <input type="number" className="form-input" defaultValue={editingProduct?.price || ''} placeholder="0" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Kategori</label>
                                    <select className="form-select" defaultValue={editingProduct?.category || ''}>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Açıklama</label>
                                <textarea className="form-textarea" defaultValue={editingProduct?.description || ''} placeholder="Ürün açıklaması" rows="3" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-glass" onClick={() => setShowModal(false)}>İptal</button>
                            <button className="btn btn-gold" onClick={() => setShowModal(false)}>
                                {editingProduct ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductManager;
