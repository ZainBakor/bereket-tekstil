import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { user, isAdmin, login, logout, isLoading, error: authError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(null);

    const handleForgotPassword = async () => {
        if (!email) {
            setLocalError('Lütfen önce e-posta adresinizi girin.');
            return;
        }

        setIsResetting(true);
        setLocalError(null);
        setResetSuccess(null);

        try {
            // 1. Verify if the email belongs to an admin
            const { data, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('email', email)
                .single();

            if (error || !data) {
                // If profile not found, check auth directly to see if user exists but has no profile
                // but usually, we only trust the profile's is_admin flag.
                throw new Error('Bu e-posta adresi bir yöneticiye ait değil.');
            }

            if (!data.is_admin) {
                throw new Error('Bu e-posta adresi bir yöneticiye ait değil.');
            }

            // 2. If admin, send reset email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (resetError) throw resetError;

            setResetSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        } catch (err) {
            console.error('Reset error:', err.message);
            setLocalError(err.message || 'Şifre sıfırlama isteği gönderilemedi.');
        } finally {
            setIsResetting(false);
        }
    };

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
                            <span className="logo-text">ALTIN</span>
                            <span className="logo-accent">MEZUNİYET</span>
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

                        {resetSuccess && (
                            <div className="login-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                {resetSuccess}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="info.AltınMezuniyet@gmail.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="flex justify-between items-center mb-xs">
                                <label className="form-label mb-0">Şifre</label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="forgot-password-link"
                                    disabled={isResetting}
                                >
                                    {isResetting ? 'Gönderiliyor...' : 'Şifremi Unuttum'}
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required={!isResetting}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold btn-lg login-btn"
                            disabled={isSubmitting || isResetting}
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
                        <code>info.AltınMezuniyet@gmail.com / admin123</code>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
