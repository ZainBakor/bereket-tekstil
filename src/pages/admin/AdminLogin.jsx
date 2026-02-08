import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { user, isAdmin, login, logout, isLoading, error: authError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);

    // If already logged in as admin, go to dashboard
    if (user && isAdmin && !isLoading) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLocalError(null);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/admin/dashboard');
            } else {
                setLocalError(result.error);
            }
        } catch (err) {
            setLocalError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayError = localError || authError;

    if (isLoading) {
        return (
            <main className="admin-login-page">
                <div className="login-container">
                    <div className="login-card flex flex-col items-center justify-center py-xl text-center">
                        <span className="spinner"></span>
                        <p className="mt-md">Oturum kontrol ediliyor...</p>
                        <button onClick={logout} className="btn btn-sm btn-glass mt-md">
                            Oturumu Sıfırla / Çıkış Yap
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">
                            <span className="logo-text">BEREKET</span>
                            <span className="logo-accent">TEKSTİL</span>
                        </div>
                        <h1>Admin Girişi</h1>
                        <p>Yönetim paneline giriş yapın</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {displayError && (
                            <div className="login-error">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {displayError}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="info.berekettekstil@gmail.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold btn-lg login-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Demo bilgileri:</p>
                        <code>info.berekettekstil@gmail.com / admin123</code>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
