import { Link } from 'react-router-dom';
import { categories, getFeaturedProducts, formatPrice } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import './Home.css';

const Home = () => {
    const featuredProducts = getFeaturedProducts();

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            ),
            title: 'Hızlı Teslimat',
            description: 'Siparişleriniz en kısa sürede kapınıza ulaşır'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            title: 'Uygun Fiyat',
            description: 'Fiyat-kalite avantajlı ürünler'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            title: 'Özel Tasarımlar',
            description: 'Model ve renk seçenekleri'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            ),
            title: 'Müşteri Memnuniyeti',
            description: 'Memnuniyet garantisi önceliğimiz'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'Destek 24/7',
            description: 'Sipariş öncesi ve sonrası iletişim'
        }
    ];

    return (
        <main className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-badge animate-fadeInDown">En Uygun Fiyata</span>
                        <h1 className="animate-fadeInUp">
                            Mezuniyet <span className="text-gradient">Cübbe ve Kep</span> Modellerimizle
                        </h1>
                        <p className="hero-subtitle animate-fadeInUp delay-200">
                            Tören coşkunuz unutulmaz bir anıya dönüşsün. Kalite, performans ve fiyat avantajlı ürünlerimizle tanışın.
                        </p>
                        <div className="hero-buttons animate-fadeInUp delay-300">
                            <Link to="/urunler" className="btn btn-gold btn-lg">
                                Kataloğu İncele
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                            <Link to="/iletisim" className="btn btn-secondary btn-lg">
                                İletişime Geç
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="hero-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Ürün <span className="text-gradient">Kategorileri</span></h2>
                        <p>Her seviye için özel tasarlanmış cübbe ve kep modelleri</p>
                    </div>

                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <Link
                                to={`/urunler?kategori=${category.id}`}
                                key={category.id}
                                className="category-card animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="category-image">
                                    <img src={category.image} alt={category.name} loading="lazy" />
                                    <div className="category-overlay">
                                        <span className="category-count">{category.productCount} Ürün</span>
                                    </div>
                                </div>
                                <div className="category-content">
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                    <span className="category-link">
                                        İncele
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Öne Çıkan <span className="text-gradient">Ürünler</span></h2>
                        <p>En çok tercih edilen cübbe ve kep modelleri</p>
                    </div>

                    <div className="products-grid">
                        {featuredProducts.slice(0, 8).map((product, index) => (
                            <div
                                key={product.id}
                                className="animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <div className="section-footer">
                        <Link to="/urunler" className="btn btn-secondary btn-lg">
                            Tüm Ürünleri Görüntüle
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2>Mezuniyet Cübbesi Seçmek Çok mu Zor?</h2>
                            <p>Zaman kaybetmeden kataloğumuzu inceleyerek mezuniyet cübbe ve keplerinize karar verin.</p>
                            <div className="cta-buttons">
                                <Link to="/urunler" className="btn btn-gold btn-lg">
                                    Kataloğu İncele
                                </Link>
                                <a
                                    href="https://wa.me/905511636983?text=Merhaba%2C%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-lg"
                                >
                                    WhatsApp İletişim
                                </a>
                            </div>
                        </div>
                        <div className="cta-decoration">
                            <div className="cta-circle"></div>
                            <div className="cta-circle"></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
