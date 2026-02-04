import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('bereketCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('bereketCart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    const addToCart = (product, quantity = 1, selectedColor, selectedSize) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                item =>
                    item.id === product.id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
            );

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, {
                ...product,
                quantity,
                selectedColor,
                selectedSize,
                cartId: Date.now() // Unique ID for cart item
            }];
        });
    };

    // Remove item from cart
    const removeFromCart = (cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };

    // Update item quantity
    const updateQuantity = (cartId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartId === cartId ? { ...item, quantity } : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate totals
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
