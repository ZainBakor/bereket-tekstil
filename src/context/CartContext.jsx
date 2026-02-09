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
        const items = savedCart ? JSON.parse(savedCart) : [];
        // Migration: Ensure all items have a variantKey
        return items.map(item => {
            if (!item.variantKey) {
                return {
                    ...item,
                    variantKey: `${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`
                };
            }
            return item;
        });
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('bereketCart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item to cart
    const addToCart = (product, quantity = 1, selectedColor, selectedSize) => {
        setCartItems(prevItems => {
            // Create a unique key for this variant
            const variantKey = `${product.id}-${selectedColor || ''}-${selectedSize || ''}`;

            const existingItem = prevItems.find(item => item.variantKey === variantKey);

            if (existingItem) {
                return prevItems.map(item =>
                    item.variantKey === variantKey
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, {
                ...product,
                quantity,
                selectedColor,
                selectedSize,
                variantKey,
                cartId: Date.now() + Math.random().toString(36).substr(2, 9) // More unique ID
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

    // Update item variant (color or size)
    const updateVariant = (cartId, updates) => {
        setCartItems(prevItems => {
            const currentItem = prevItems.find(item => item.cartId === cartId);
            if (!currentItem) return prevItems;

            const updatedItem = { ...currentItem, ...updates };
            const newVariantKey = `${updatedItem.id}-${updatedItem.selectedColor || ''}-${updatedItem.selectedSize || ''}`;

            // Check if another item already has this new variant key
            const existingItem = prevItems.find(item =>
                item.variantKey === newVariantKey && item.cartId !== cartId
            );

            if (existingItem) {
                // Merge quantities and remove the current item
                return prevItems
                    .filter(item => item.cartId !== cartId)
                    .map(item =>
                        item.cartId === existingItem.cartId
                            ? { ...item, quantity: item.quantity + currentItem.quantity }
                            : item
                    );
            }

            // Just update the current item
            return prevItems.map(item =>
                item.cartId === cartId
                    ? { ...updatedItem, variantKey: newVariantKey }
                    : item
            );
        });
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
        updateVariant,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
