import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './About.css';

const About = () => {
    const [heroMedia, setHeroMedia] = useState(null);

    useEffect(() => {
        const fetchHeroMedia = async () => {
            try {
                const { data, error } = await supabase
                    .from('works_gallery')
                    .select('media_url, media_type')
                    .eq('category', 'about_hero')
                    .maybeSingle();

                if (error) throw error;
                if (data) setHeroMedia(data);
            } catch (err) {
                console.error('Error fetching about hero:', err);
            }
        };

        fetchHeroMedia();
    }, []);

    const stats = [
        { number: '10+', label: 'Yıllık Deneyim' },
        { number: '5000+', label: 'Mutlu Müşteri' },
        { number: '100+', label: 'Okul İşbirliği' },
        { number: '50+', label: 'Ürün Çeşidi' }
    ];

    const values = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
            title: 'Kalite',
            description: 'En kaliteli kumaşlar ve özenli işçilik ile üretim yapıyoruz.'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            ),
            title: 'Müşteri Memnuniyeti',
            description: 'Müşteri memnuniyeti en büyük önceliğimizdir.'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            title: 'Hızlı Teslimat',
            description: 'Siparişlerinizi en kısa sürede kapınıza ulaştırıyoruz.'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: 'Güvenilirlik',
            description: 'Yıllardır sektörde güvenle hizmet veriyoruz.'
        }
    ];

    return (
        <main className="about-page">
            <section className="page-header">
                <div className="container">
                    <h1>Hakkımızda</h1>
                    <p>Bereket Tekstil'i yakından tanıyın</p>
                </div>
            </section>

            {/* About Content */}
            <section className="about-content section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <h2>Mezuniyet Törenlerinizin <span className="text-gradient">Güvenilir Adresi</span></h2>
                            <p>
                                Bereket Tekstil olarak, üniversiteden anaokuluna kadar tüm eğitim kademelerinde
                                mezuniyet cübbe ve kep ihtiyaçlarınızı karşılıyoruz. Yılların tecrübesiyle
                                kaliteli ürünler ve uygun fiyatlar sunuyoruz.
                            </p>
                            <p>
                                Öğrencilerin en özel günlerinden biri olan mezuniyet törenlerinde,
                                kaliteli ve şık görünümlü cübbe ve kepler ile anları unutulmaz kılmak
                                için çalışıyoruz. Her beden ve her yaş grubuna uygun geniş ürün
                                yelpazemizle hizmetinizdeyiz.
                            </p>
                            <p>
                                Toptan ve perakende satış seçeneklerimizle okullar, kurumlar ve
                                bireysel müşterilerimize hizmet veriyoruz. Özel tasarım talepleriniz
                                için de ekibimizle iletişime geçebilirsiniz.
                            </p>
                            <Link to="/iletisim" className="btn btn-gold">
                                Bizimle İletişime Geçin
                            </Link>
                        </div>
                        <div className="about-image">
                            {heroMedia ? (
                                heroMedia.media_type === 'video' ? (
                                    <video
                                        src={heroMedia.media_url}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="about-hero-media"
                                    />
                                ) : (
                                    <img
                                        src={heroMedia.media_url}
                                        alt="Mezuniyet töreni"
                                        className="about-hero-media"
                                    />
                                )
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=700&fit=crop"
                                    alt="Mezuniyet töreni"
                                    className="about-hero-media"
                                />
                            )}
                            <div className="about-image-overlay">
                                <span className="text-gradient">10+ Yıllık Tecrübe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="values-section section">
                <div className="container">
                    <div className="section-header">
                        <h2>Değerlerimiz</h2>
                        <p>Bizi biz yapan temel ilkelerimiz</p>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Sizinle Çalışmak İstiyoruz</h2>
                        <p>Mezuniyet cübbe ve kep ihtiyaçlarınız için hemen bizimle iletişime geçin.</p>
                        <div className="cta-buttons">
                            <Link to="/urunler" className="btn btn-gold btn-lg">
                                Ürünleri İncele
                            </Link>
                            <Link to="/iletisim" className="btn btn-secondary btn-lg">
                                İletişime Geç
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
