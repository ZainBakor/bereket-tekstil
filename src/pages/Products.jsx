import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || 'all');
    const [sortBy, setSortBy] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let result = [...products];

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Sort products
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredProducts(result);
    }, [selectedCategory, sortBy, searchQuery]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId === 'all') {
            searchParams.delete('kategori');
        } else {
            searchParams.set('kategori', categoryId);
        }
        setSearchParams(searchParams);
    };

    return (
        <main className="products-page">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Ürünler</h1>
                    <p>Kaliteli ve uygun fiyatlı mezuniyet cübbe ve kep modelleri</p>
                </div>
            </section>

            <section className="products-section">
                <div className="container">
                    <div className="products-layout">
                        {/* Sidebar Filters */}
                        <aside className="products-sidebar">
                            {/* Search */}
                            <div className="filter-group">
                                <h4>Ürün Ara</h4>
                                <div className="search-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Ürün adı ara..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="filter-group">
                                <h4>Kategoriler</h4>
                                <ul className="category-filter">
                                    <li>
                                        <button
                                            className={selectedCategory === 'all' ? 'active' : ''}
                                            onClick={() => handleCategoryChange('all')}
                                        >
                                            <span>Tüm Ürünler</span>
                                            <span className="count">{products.length}</span>
                                        </button>
                                    </li>
                                    {categories.map(category => (
                                        <li key={category.id}>
                                            <button
                                                className={selectedCategory === category.id ? 'active' : ''}
                                                onClick={() => handleCategoryChange(category.id)}
                                            >
                                                <span>{category.name}</span>
                                                <span className="count">
                                                    {products.filter(p => p.category === category.id).length}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Products Content */}
                        <div className="products-content">
                            {/* Toolbar */}
                            <div className="products-toolbar">
                                <p className="products-count">
                                    <strong>{filteredProducts.length}</strong> ürün gösteriliyor
                                </p>
                                <div className="sort-select">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="default">Varsayılan Sıralama</option>
                                        <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                                        <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                                        <option value="name">İsme Göre</option>
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {filteredProducts.length > 0 ? (
                                <div className="products-grid">
                                    {filteredProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="animate-fadeInUp"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <h3>Ürün bulunamadı</h3>
                                    <p>Arama kriterlerinize uygun ürün bulunamadı.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setSearchQuery('');
                                            searchParams.delete('kategori');
                                            setSearchParams(searchParams);
                                        }}
                                    >
                                        Filtreleri Temizle
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Products;
