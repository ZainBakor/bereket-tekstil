import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './GalleryManager.css';

const GalleryManager = () => {
    const { user, isAdmin, isLoading: authLoading } = useAuth();
    const [galleryItems, setGalleryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const [newFile, setNewFile] = useState(null);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('image'); // image or video
    const [aboutHero, setAboutHero] = useState(null);
    const [isAboutUploading, setIsAboutUploading] = useState(false);

    useEffect(() => {
        if (user && isAdmin) {
            fetchGallery();
            fetchAboutHero();
        }
    }, [user, isAdmin]);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('works_gallery')
                .select('*')
                .neq('category', 'about_hero')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGalleryItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAboutHero = async () => {
        try {
            const { data, error } = await supabase
                .from('works_gallery')
                .select('*')
                .eq('category', 'about_hero')
                .maybeSingle();

            if (error) throw error;
            setAboutHero(data);
        } catch (error) {
            console.error('Error fetching about hero:', error.message);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewFile(file);
            if (file.type.startsWith('video/')) {
                setType('video');
            } else {
                setType('image');
            }
            if (!title) {
                const fileName = file.name.split('.')[0];
                setTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
            }
        }
    };

    const handleUpload = async (e, category = 'general') => {
        if (e) e.preventDefault();
        if (!newFile) return;

        const isAboutUpdate = category === 'about_hero';
        if (isAboutUpdate) setIsAboutUploading(true);
        else setIsUploading(true);

        try {
            // 1. Upload to Storage
            const fileExt = newFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `gallery/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(filePath, newFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(filePath);

            // 3. Save to Database
            if (isAboutUpdate && aboutHero) {
                // Update existing
                const { error: dbError } = await supabase
                    .from('works_gallery')
                    .update({
                        media_url: publicUrl,
                        media_type: type,
                        thumbnail_url: publicUrl
                    })
                    .eq('id', aboutHero.id);
                if (dbError) throw dbError;
            } else {
                // Insert new
                const { error: dbError } = await supabase
                    .from('works_gallery')
                    .insert([
                        {
                            caption: isAboutUpdate ? 'Hakkımızda Öne Çıkan' : title,
                            media_url: publicUrl,
                            media_type: type,
                            thumbnail_url: publicUrl,
                            display_order: 0,
                            category: category
                        }
                    ]);
                if (dbError) throw dbError;
            }

            setNewFile(null);
            setTitle('');
            if (isAboutUpdate) {
                fetchAboutHero();
                alert('Hakkımızda görseli güncellendi!');
            } else {
                fetchGallery();
                alert('Galeriye eklendi!');
            }

        } catch (error) {
            console.error('Upload error:', error.message);
            alert(`Hata: ${error.message}`);
        } finally {
            setIsAboutUploading(false);
            setIsUploading(false);
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`"${item.caption}" öğesini silmek istediğinize emin misiniz?`)) return;

        try {
            // Delete from DB (Storage path is not saved in this schema but we can deduce it from URL if needed)
            // But for simplicity let's just delete from DB.
            const { error } = await supabase
                .from('works_gallery')
                .delete()
                .eq('id', item.id);

            if (error) throw error;

            setGalleryItems(galleryItems.filter(i => i.id !== item.id));
        } catch (error) {
            console.error('Delete error:', error.message);
            alert('Silme işlemi başarısız oldu.');
        }
    };

    if (authLoading) return <div className="admin-loading-screen">Yükleniyor...</div>;
    if (!user || !isAdmin) return <Navigate to="/admin" replace />;

    return (
        <main className="gallery-manager animate-fadeIn">
            <header className="admin-header">
                <div className="container flex justify-between items-center">
                    <div className="admin-brand">
                        <Link to="/admin/dashboard" className="admin-logo">
                            <span className="logo-text">BEREKET</span>
                            <span className="logo-accent">TEKSTİL</span>
                        </Link>
                        <span className="admin-badge">Yönetim Paneli</span>
                    </div>
                    <div className="admin-user">
                        <Link to="/admin/dashboard" className="btn btn-sm btn-glass">Dashboard'a Dön</Link>
                    </div>
                </div>
            </header>

            <div className="admin-content container">
                <div className="page-title-section">
                    <h1 className="text-gradient">Galeri Yönetimi</h1>
                    <p className="text-muted">Web sitenizdeki görselleri ve videoları buradan yönetebilirsiniz.</p>
                </div>

                {/* About Page Hero Management */}
                <section className="about-hero-manager section animate-fadeInUp">
                    <div className="card-luxury p-xl">
                        <div className="section-header text-left mb-xl">
                            <h2 className="h3">Hakkımızda Sayfası Öne Çıkan</h2>
                            <p>Bu görsel veya video "Hakkımızda" sayfasındaki tecrübe bölümünde gösterilir.</p>
                        </div>

                        <div className="about-hero-layout">
                            <div className="hero-preview-container">
                                {aboutHero ? (
                                    <div className="hero-media-wrapper">
                                        {aboutHero.media_type === 'video' ? (
                                            <video src={aboutHero.media_url} controls muted />
                                        ) : (
                                            <img src={aboutHero.media_url} alt="About Hero" />
                                        )}
                                        <div className="media-type-badge">
                                            {aboutHero.media_type === 'video' ? 'VIDEO' : 'IMAGE'}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="hero-preview-placeholder">
                                        <div className="placeholder-content">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                            <p>Varsayılan görsel kullanılıyor</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="hero-upload-controls">
                                <div className="control-header">
                                    <h4>{aboutHero ? 'Görseli Güncelle' : 'Görsel Ayarla'}</h4>
                                    <p className="text-sm">En iyi görünüm için dikey (portre) bir görsel kullanın.</p>
                                </div>
                                <div className="custom-file-upload">
                                    <input
                                        type="file"
                                        id="about-hero-input"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        className="hidden-input"
                                    />
                                    <label htmlFor="about-hero-input" className="file-label">
                                        <div className="file-info">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            <span>{newFile && !title ? newFile.name : 'Dosya Seç'}</span>
                                        </div>
                                    </label>
                                    <button
                                        onClick={() => handleUpload(null, 'about_hero')}
                                        className="btn btn-gold w-full mt-md"
                                        disabled={isAboutUploading || !newFile}
                                    >
                                        {isAboutUploading ? 'Yükleniyor...' : 'Değişiklikleri Kaydet'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="divider-luxury my-2xl"></div>

                <section className="gallery-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="section-header flex justify-between items-end mb-xl">
                        <div className="text-left">
                            <h2 className="h3">Genel Galeri</h2>
                            <p>İşlerimizden örnekler ve özel gün fotoğrafları.</p>
                        </div>
                        <button
                            className="btn btn-outline-gold btn-sm"
                            onClick={() => document.getElementById('gallery-upload-form').scrollIntoView({ behavior: 'smooth' })}
                        >
                            + Yeni Ekle
                        </button>
                    </div>

                    <div id="gallery-upload-form" className="upload-section card mb-2xl">
                        <h3 className="h5 mb-lg">Yeni Galeri Ögesi Ekle</h3>
                        <form className="upload-form" onSubmit={(e) => handleUpload(e, 'general')}>
                            <div className="form-group">
                                <label className="form-label">Medya Dosyası</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Başlık / Açıklama</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Örn: 2024 Mezuniyet..."
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Medya Türü</label>
                                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="image">Fotoğraf</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                            <div className="form-actions mt-auto">
                                <button type="submit" className="btn btn-gold w-full" disabled={isUploading}>
                                    {isUploading ? 'Ekleniyor...' : 'Galeriye Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="manager-grid">
                        {galleryItems.map(item => (
                            <div key={item.id} className="manager-item card-luxury">
                                <div className="preview-container">
                                    {item.media_type === 'video' ? (
                                        <video src={item.media_url} muted />
                                    ) : (
                                        <img src={item.media_url} alt={item.caption} />
                                    )}
                                    <div className="item-overlay">
                                        <button
                                            className="delete-icon-btn"
                                            onClick={() => handleDelete(item)}
                                            title="Sil"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="item-details p-md">
                                    <div className="flex justify-between items-start">
                                        <h4>{item.caption}</h4>
                                        <span className={`badge ${item.media_type === 'video' ? 'badge-burgundy' : 'badge-gold'}`}>
                                            {item.media_type === 'video' ? 'Video' : 'Foto'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {galleryItems.length === 0 && !isLoading && (
                            <div className="empty-state">
                                <div className="empty-content card-luxury p-3xl text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-light mb-md">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="9" y1="21" x2="9" y2="9" />
                                    </svg>
                                    <p className="text-lg font-medium">Henüz içerik eklenmemiş.</p>
                                    <p className="text-muted">Yukarıdaki formu kullanarak ilk galeri ögenizi ekleyin.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {isLoading && <div className="text-center p-3xl">Yükleniyor...</div>}
                </section>
            </div>
        </main>
    );
};

export default GalleryManager;
