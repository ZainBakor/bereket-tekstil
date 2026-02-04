import { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const galleryImages = [
        {
            id: 1,
            src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
            title: 'Üniversite Mezuniyet Töreni',
            category: 'universite'
        },
        {
            id: 2,
            src: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&h=600&fit=crop',
            title: 'Mezuniyet Anı',
            category: 'universite'
        },
        {
            id: 3,
            src: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=600&fit=crop',
            title: 'Lise Mezuniyeti',
            category: 'lise'
        },
        {
            id: 4,
            src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop',
            title: 'Ortaokul Töreni',
            category: 'ortaokul'
        },
        {
            id: 5,
            src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
            title: 'İlkokul Mezuniyeti',
            category: 'ilkokul'
        },
        {
            id: 6,
            src: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=600&fit=crop',
            title: 'Anaokulu Töreni',
            category: 'anaokulu'
        },
        {
            id: 7,
            src: 'https://images.unsplash.com/photo-1564585222527-c2777e60752e?w=800&h=600&fit=crop',
            title: 'Mezuniyet Kepleri',
            category: 'kepler'
        },
        {
            id: 8,
            src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
            title: 'Toplu Mezuniyet',
            category: 'universite'
        },
        {
            id: 9,
            src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop',
            title: 'Akademisyen Cübbeleri',
            category: 'akademisyen'
        },
        {
            id: 10,
            src: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=800&h=600&fit=crop',
            title: 'Mutlu Anlar',
            category: 'universite'
        },
        {
            id: 11,
            src: 'https://images.unsplash.com/photo-1551836022-b06985bceb24?w=800&h=600&fit=crop',
            title: 'Tören Görüntüsü',
            category: 'lise'
        },
        {
            id: 12,
            src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=600&fit=crop',
            title: 'Kutlama Anı',
            category: 'universite'
        }
    ];

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';
    };

    const navigateImage = (direction) => {
        const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
        let newIndex;

        if (direction === 'prev') {
            newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
        } else {
            newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
        }

        setSelectedImage(galleryImages[newIndex]);
    };

    return (
        <main className="gallery-page">
            <section className="page-header">
                <div className="container">
                    <h1>Galeri</h1>
                    <p>Mezuniyet törenlerinden kareler</p>
                </div>
            </section>

            <section className="gallery-section">
                <div className="container">
                    <div className="gallery-grid">
                        {galleryImages.map((image, index) => (
                            <div
                                key={image.id}
                                className={`gallery-item ${index === 0 ? 'large' : ''}`}
                                onClick={() => openLightbox(image)}
                            >
                                <img src={image.src} alt={image.title} loading="lazy" />
                                <div className="gallery-overlay">
                                    <h4>{image.title}</h4>
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
                        <img src={selectedImage.src} alt={selectedImage.title} />
                        <h4>{selectedImage.title}</h4>
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
