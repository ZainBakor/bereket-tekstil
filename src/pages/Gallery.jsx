import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Gallery.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('works_gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGalleryItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const openLightbox = (item) => {
        setSelectedImage(item);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';
    };

    const navigateImage = (direction) => {
        if (!selectedImage) return;
        const currentIndex = galleryItems.findIndex(img => img.id === selectedImage.id);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === galleryItems.length - 1 ? 0 : currentIndex + 1;
        }

        setSelectedImage(galleryItems[newIndex]);
    };

    return (
        <main className="gallery-page">
            <section className="page-header">
                <div className="container">
                    <h1>Galeri</h1>
                    <p>Mezuniyet törenlerinden kareler ve videolar</p>
                </div>
            </section>

            <section className="gallery-section">
                <div className="container">
                    {isLoading ? (
                        <div className="gallery-loading">
                            <span className="spinner"></span>
                            <p>Yükleniyor...</p>
                        </div>
                    ) : galleryItems.length > 0 ? (
                        <div className="gallery-grid">
                            {galleryItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`gallery-item ${index === 0 ? 'large' : ''}`}
                                    onClick={() => openLightbox(item)}
                                >
                                    {item.media_type === 'video' ? (
                                        <div className="video-thumbnail">
                                            <video src={item.media_url} muted />
                                            <div className="video-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={item.media_url} alt={item.caption} loading="lazy" />
                                    )}
                                    <div className="gallery-overlay">
                                        <h4>{item.caption}</h4>
                                        <span className="gallery-zoom">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                                <line x1="11" y1="8" x2="11" y2="14" />
                                                <line x1="8" y1="11" x2="14" y2="11" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="gallery-empty">
                            <p>Henüz içerik eklenmemiş.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        {selectedImage.media_type === 'video' ? (
                            <video src={selectedImage.media_url} controls autoPlay />
                        ) : (
                            <img src={selectedImage.media_url} alt={selectedImage.caption} />
                        )}
                        <h4>{selectedImage.caption}</h4>
                    </div>

                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            )}
        </main>
    );
};

export default Gallery;
