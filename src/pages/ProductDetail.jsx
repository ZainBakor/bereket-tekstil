import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductsByCategory, getColorById, getSizeById, formatPrice, getCategoryById } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart, setIsCartOpen } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const productData = getProductById(id);
        if (productData) {
            setProduct(productData);
            setSelectedColor(productData.colors?.[0] || '');
            setSelectedSize(productData.sizes?.[0] || '');

            // Get related products
            const related = getProductsByCategory(productData.category)
                .filter(p => p.id !== productData.id)
                .slice(0, 4);
            setRelatedProducts(related);
        }

        // Reset state
        setSelectedImage(0);
        setQuantity(1);
        setAddedToCart(false);

        // Scroll to top
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <main className="product-detail-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Ürün bulunamadı</h2>
                        <Link to="/urunler" className="btn btn-primary">Ürünlere Dön</Link>
                    </div>
                </div>
            </main>
        );
    }

    const category = getCategoryById(product.category);

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert('Lütfen renk ve beden seçiniz.');
            return;
        }

        addToCart(product, quantity, selectedColor, selectedSize);
        setAddedToCart(true);

        setTimeout(() => {
            setIsCartOpen(true);
        }, 300);
    };

    return (
        <main className="product-detail-page">
            {/* Breadcrumb */}
            <section className="breadcrumb-section">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Ana Sayfa</Link>
                        <span>/</span>
                        <Link to="/urunler">Ürünler</Link>
                        <span>/</span>
                        {category && (
                            <>
                                <Link to={`/urunler?kategori=${category.id}`}>{category.name}</Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="current">{product.name}</span>
                    </nav>
                </div>
            </section>

            {/* Product Detail */}
            <section className="product-detail-section">
                <div className="container">
                    <div className="product-detail-grid">
                        {/* Images */}
                        <div className="product-images">
                            <div className="main-image">
                                <img
                                    src={product.images?.[selectedImage] || product.images?.[0]}
                                    alt={product.name}
                                />
                                {product.oldPrice && (
                                    <span className="discount-badge">
                                        %{Math.round((1 - product.price / product.oldPrice) * 100)} İndirim
                                    </span>
                                )}
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="image-thumbnails">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={img} alt={`${product.name} ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                            <div className="product-badges">
                                {product.bestseller && <span className="badge badge-accent">Çok Satan</span>}
                                {product.featured && <span className="badge badge-glass">Öne Çıkan</span>}
                            </div>

                            <h1>{product.name}</h1>

                            <div className="product-price-box">
                                <span className="current-price">{formatPrice(product.price)}</span>
                                {product.oldPrice && (
                                    <span className="old-price">{formatPrice(product.oldPrice)}</span>
                                )}
                            </div>

                            <p className="product-description">{product.description}</p>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="product-features">
                                    <h4>Özellikler</h4>
                                    <ul>
                                        {product.features.map((feature, index) => (
                                            <li key={index}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="option-group">
                                    <label>Renk Seçimi</label>
                                    <div className="color-options">
                                        {product.colors.map(colorId => {
                                            const color = getColorById(colorId);
                                            return color ? (
                                                <button
                                                    key={colorId}
                                                    className={`color-option ${selectedColor === colorId ? 'active' : ''}`}
                                                    style={{ backgroundColor: color.hex }}
                                                    onClick={() => setSelectedColor(colorId)}
                                                    title={color.name}
                                                >
                                                    {selectedColor === colorId && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                    <span className="selected-label">
                                        {getColorById(selectedColor)?.name}
                                    </span>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="option-group">
                                    <label>Beden Seçimi</label>
                                    <div className="size-options">
                                        {product.sizes.map(sizeId => {
                                            const size = getSizeById(sizeId);
                                            return size ? (
                                                <button
                                                    key={sizeId}
                                                    className={`size-option ${selectedSize === sizeId ? 'active' : ''}`}
                                                    onClick={() => setSelectedSize(sizeId)}
                                                >
                                                    {size.name}
                                                </button>
                                            ) : null;
                                        })}
                                    </div>
                                    {getSizeById(selectedSize)?.description && (
                                        <span className="selected-label">
                                            {getSizeById(selectedSize).description}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="purchase-section">
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>

                                <button
                                    className={`btn btn-gold btn-lg add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={addedToCart}
                                >
                                    {addedToCart ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Sepete Eklendi
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1" />
                                                <circle cx="20" cy="21" r="1" />
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            </svg>
                                            Sepete Ekle
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/905511636983?text=${encodeURIComponent(`Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whatsapp-inquiry"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp ile Bilgi Al
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="section related-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Benzer Ürünler</h2>
                        </div>
                        <div className="products-grid">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default ProductDetail;
