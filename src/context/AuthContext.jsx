import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                // Get session with a timeout to avoid hangs
                const sessionPromise = supabase.auth.getSession();
                const sessionTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
                );

                const { data: { session }, error: sessionError } = await Promise.race([sessionPromise, sessionTimeout]);

                if (sessionError) throw sessionError;

                if (mounted) {
                    if (session) {
                        setUser(session.user);
                        // Fetch profile with a timeout to avoid hanging the UI
                        const profilePromise = fetchProfile(session.user.id);
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
                        );

                        try {
                            await Promise.race([profilePromise, timeoutPromise]);
                        } catch (pErr) {
                            console.warn('Initial profile fetch non-blocking warning:', pErr.message);
                        }
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err.message);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted) {
                console.log('Auth event:', event);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }

                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId) => {
        console.log('Fetching profile for:', userId);
        try {
            // Use a race to ensure profile fetch doesn't hang forever
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
            );

            const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

            if (data) {
                console.log('Profile fetched successfully');
                setProfile(data);
                return data;
            }
            if (error) throw error;
        } catch (err) {
            console.error('Error in fetchProfile:', err.message);
            return null;
        }
    };

    const login = async (email, password) => {
        console.log('Attempting login...');
        setError(null);

        try {
            // 1. Auth check with timeout
            const authPromise = supabase.auth.signInWithPassword({ email, password });
            const authTimeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Giriş isteği zaman aşımına uğradı.')), 10000)
            );

            const { data, error: authErr } = await Promise.race([authPromise, authTimeout]);

            if (authErr) throw authErr;
            if (!data?.user) throw new Error('Kullanıcı bilgisi alınamadı.');

            console.log('Auth successful, verifying admin status...');

            // 2. Profile check with timeout
            const profileData = await fetchProfile(data.user.id);

            if (!profileData) {
                throw new Error('Profil bilgilerinize ulaşılamadı.');
            }

            if (!profileData.is_admin) {
                console.warn('User is not an admin, logging out...');
                await supabase.auth.signOut();
                throw new Error('Bu panele giriş yetkiniz bulunmamaktadır.');
            }

            console.log('Login and admin verification successful');
            return { success: true };
        } catch (err) {
            console.error('Login error:', err.message);
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    const logout = async () => {
        console.log('Logging out...');
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('Error signing out:', err);
        } finally {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
        }
    };

    const value = {
        user: user ? { ...user, name: user.email?.split('@')[0] } : null,
        profile,
        isAdmin: profile?.is_admin || false,
        isLoading,
        error,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
