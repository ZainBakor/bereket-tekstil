import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatPrice, colors as availableColors, sizes as availableSizes } from '../../data/products';
import './ProductManager.css';

const ProductManager = () => {
    const { user, isAdmin, logout, isLoading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        in_stock: true,
        featured: false,
        image_file: null,
        colors: [],
        sizes: []
    });

    useEffect(() => {
        if (user && isAdmin) {
            fetchInitialData();
        }
    }, [user, isAdmin]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                supabase.from('products').select('*').order('created_at', { ascending: false }),
                supabase.from('categories').select('*').order('name')
            ]);

            if (prodRes.error) throw prodRes.error;
            if (catRes.error) throw catRes.error;

            setProducts(prodRes.data || []);
            setCategories(catRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error.message);
            alert('Veriler yüklenirken bir hata oluştu: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

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

    // Filter products
    const filteredProducts = products.filter(product => {
        const name = product.name || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            try {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) throw error;
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error.message);
                alert('Ürün silinirken bir hata oluştu.');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category_id,
            description: product.description || '',
            in_stock: product.in_stock,
            featured: product.featured,
            image_file: null,
            colors: product.colors || [],
            sizes: product.sizes || []
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            category: categories[0]?.id || '',
            description: '',
            in_stock: true,
            featured: false,
            image_file: null,
            colors: [],
            sizes: []
        });
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image_file: e.target.files[0] });
        }
    };

    const handleColorToggle = (colorId) => {
        const currentColors = [...formData.colors];
        const index = currentColors.indexOf(colorId);
        if (index > -1) {
            currentColors.splice(index, 1);
        } else {
            currentColors.push(colorId);
        }
        setFormData({ ...formData, colors: currentColors });
    };

    const handleSizeToggle = (sizeId) => {
        const currentSizes = [...formData.sizes];
        const index = currentSizes.indexOf(sizeId);
        if (index > -1) {
            currentSizes.splice(index, 1);
        } else {
            currentSizes.push(sizeId);
        }
        setFormData({ ...formData, sizes: currentSizes });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let imageUrl = editingProduct?.images?.[0] || '';

            // Handle image upload if new file is selected
            if (formData.image_file) {
                const file = formData.image_file;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                category_id: formData.category,
                description: formData.description,
                in_stock: formData.in_stock,
                featured: formData.featured,
                images: imageUrl ? [imageUrl] : editingProduct?.images || [],
                colors: formData.colors,
                sizes: formData.sizes
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            setShowModal(false);
            fetchInitialData(); // Refresh list
        } catch (error) {
            console.error('Error saving product:', error.message);
            alert('Ürün kaydedilirken bir hata oluştu: ' + error.message);
        } finally {
            setIsSaving(false);
        }
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
                                    const category = categories.find(c => c.id === product.category_id);
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
                                                    <span className="current">{formatPrice(product.price || 0)}</span>
                                                    {product.old_price && (
                                                        <span className="old">{formatPrice(product.old_price)}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                                    {product.in_stock ? 'Stokta' : 'Tükendi'}
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
                <div className="modal-overlay" onClick={() => !isSaving && setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
                            <button className="modal-close" onClick={() => !isSaving && setShowModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Ürün Adı</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ürün adı girin"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Fiyat (₺)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Kategori</label>
                                        <select
                                            className="form-select"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Kategori Seçin</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Renkler</label>
                                    <div className="color-selection-grid">
                                        {availableColors.map(color => (
                                            <label key={color.id} className={`color-checkbox-label ${formData.colors.includes(color.id) ? 'active' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.colors.includes(color.id)}
                                                    onChange={() => handleColorToggle(color.id)}
                                                    hidden
                                                />
                                                <span className="color-swatch" style={{ backgroundColor: color.hex }}></span>
                                                <span className="color-name">{color.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bedenler</label>
                                    <div className="size-selection-grid">
                                        {availableSizes.filter(s => ['s', 'm', 'l', 'xl'].includes(s.id)).map(size => (
                                            <label key={size.id} className={`size-checkbox-label ${formData.sizes.includes(size.id) ? 'active' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.sizes.includes(size.id)}
                                                    onChange={() => handleSizeToggle(size.id)}
                                                    hidden
                                                />
                                                <span className="size-name">{size.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ürün Resmi</label>
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {editingProduct?.images?.[0] && !formData.image_file && (
                                        <p className="mt-xs text-sm opacity-70">Mevcut resim korunacak.</p>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Ürün açıklaması"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group flex-row gap-sm items-center">
                                        <input
                                            type="checkbox"
                                            id="in_stock"
                                            checked={formData.in_stock}
                                            onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                        />
                                        <label htmlFor="in_stock" className="form-label mb-0">Stokta Var</label>
                                    </div>
                                    <div className="form-group flex-row gap-sm items-center">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        />
                                        <label htmlFor="featured" className="form-label mb-0">Öne Çıkar</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-glass" onClick={() => setShowModal(false)} disabled={isSaving}>İptal</button>
                                <button type="submit" className="btn btn-gold" disabled={isSaving}>
                                    {isSaving ? 'Kaydediliyor...' : (editingProduct ? 'Güncelle' : 'Ekle')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductManager;
