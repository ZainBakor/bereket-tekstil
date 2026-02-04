import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Simple admin credentials (in production, use proper backend auth)
const ADMIN_CREDENTIALS = {
    email: 'info.berekettekstil@gmail.com',
    password: 'admin123'
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('bereketUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Save user to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('bereketUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('bereketUser');
        }
    }, [user]);

    // Login function
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const userData = {
                email,
                role: 'admin',
                name: 'Admin',
                loginTime: new Date().toISOString()
            };
            setUser(userData);
            setIsLoading(false);
            return { success: true };
        }

        setError('Geçersiz e-posta veya şifre');
        setIsLoading(false);
        return { success: false, error: 'Geçersiz e-posta veya şifre' };
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('bereketUser');
    };

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        isAdmin,
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
