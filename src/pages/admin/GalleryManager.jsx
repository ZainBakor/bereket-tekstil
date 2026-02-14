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

    useEffect(() => {
        if (user && isAdmin) {
            fetchGallery();
        }
    }, [user, isAdmin]);

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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newFile || !title) return;

        setIsUploading(true);

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

            // 3. Save to Database using the correct schema
            const { error: dbError } = await supabase
                .from('works_gallery')
                .insert([
                    {
                        caption: title,
                        media_url: publicUrl,
                        media_type: type,
                        thumbnail_url: publicUrl,
                        display_order: 0
                    }
                ]);

            if (dbError) throw dbError;

            setTitle('');
            setNewFile(null);
            fetchGallery();
            alert('Başarıyla yüklendi!');

        } catch (error) {
            console.error('Upload error:', error.message);
            alert(`Hata: ${error.message}`);
        } finally {
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
        <main className="gallery-manager">
            <header className="admin-header">
                <div className="container flex justify-between items-center">
                    <div className="admin-brand">
                        <Link to="/admin/dashboard" className="admin-logo">
                            <span className="logo-text">BEREKET</span>
                            <span className="logo-accent">TEKSTİL</span>
                        </Link>
                        <span className="admin-badge">Galeri Yönetimi</span>
                    </div>
                    <div className="admin-user">
                        <Link to="/admin/dashboard" className="btn btn-sm btn-glass">Dashboard'a Dön</Link>
                    </div>
                </div>
            </header>

            <div className="admin-content container">
                <h1>Galeri Yönetimi</h1>

                <section className="upload-section">
                    <h2>Yeni Ekle</h2>
                    <form className="upload-form" onSubmit={handleUpload}>
                        <div className="form-group">
                            <label>Dosya Seç (Fotoğraf veya Video)</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Başlık / Açıklama</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Örn: 2024 Mezuniyet Töreni"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tür</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="image">Fotoğraf</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        <button type="submit" className="upload-btn" disabled={isUploading}>
                            {isUploading ? 'Yükleniyor...' : 'Ekle'}
                        </button>
                    </form>
                </section>

                <section className="gallery-list">
                    <h2>Mevcut Öğeler</h2>
                    {isLoading ? (
                        <p>Yükleniyor...</p>
                    ) : (
                        <div className="manager-grid">
                            {galleryItems.map(item => (
                                <div key={item.id} className="manager-item">
                                    <div className="preview-container">
                                        {item.media_type === 'video' ? (
                                            <video src={item.media_url} muted />
                                        ) : (
                                            <img src={item.media_url} alt={item.caption} />
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.caption}</h4>
                                        <span className="item-category">
                                            {item.media_type === 'video' ? 'Video' : 'Fotoğraf'}
                                        </span>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item)}
                                        title="Sil"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {galleryItems.length === 0 && (
                                <div className="empty-state">
                                    Henüz fotoğraf veya video eklenmemiş.
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default GalleryManager;
