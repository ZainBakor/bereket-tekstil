import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice, getColorById, getSizeById } from '../../data/products';
import './CartSidebar.css';

const CartSidebar = () => {
    const {
        cartItems,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        updateVariant
    } = useCart();

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsCartOpen(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
                onClick={handleOverlayClick}
            />

            {/* Sidebar */}
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="cart-sidebar-header">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Sepetim ({cartItems.length})
                    </h3>
                    <button
                        className="cart-close-btn"
                        onClick={() => setIsCartOpen(false)}
                        aria-label="Sepeti kapat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="cart-sidebar-body">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <p>Sepetiniz boş</p>
                            <Link
                                to="/urunler"
                                className="btn btn-primary"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Alışverişe Başla
                            </Link>
                        </div>
                    ) : (
                        <ul className="cart-items">
                            {cartItems.map(item => {
                                const color = getColorById(item.selectedColor);
                                const size = getSizeById(item.selectedSize);

                                return (
                                    <li key={item.cartId} className="cart-item">
                                        <div className="cart-item-image">
                                            <img src={item.images?.[0]} alt={item.name} />
                                        </div>
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            <div className="cart-item-details">
                                                {item.colors && item.colors.length > 0 && (
                                                    <div className="cart-sidebar-option">
                                                        <select
                                                            value={item.selectedColor}
                                                            onChange={(e) => updateVariant(item.cartId, { selectedColor: e.target.value })}
                                                        >
                                                            {item.colors.map(cId => (
                                                                <option key={cId} value={cId}>
                                                                    {getColorById(cId)?.name || cId}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                {item.sizes && item.sizes.length > 0 && (
                                                    <div className="cart-sidebar-option">
                                                        <select
                                                            value={item.selectedSize}
                                                            onChange={(e) => updateVariant(item.cartId, { selectedSize: e.target.value })}
                                                        >
                                                            {item.sizes.map(sId => (
                                                                <option key={sId} value={sId}>
                                                                    {getSizeById(sId)?.name || sId}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="cart-item-price">{formatPrice(item.price)}</div>
                                        </div>
                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                    aria-label="Azalt"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                    aria-label="Artır"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="cart-item-remove"
                                                onClick={() => removeFromCart(item.cartId)}
                                                aria-label="Kaldır"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="cart-total">
                            <span>Toplam</span>
                            <span className="cart-total-price">{formatPrice(cartTotal)}</span>
                        </div>
                        <Link
                            to="/sepet"
                            className="btn btn-secondary btn-lg"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Sepeti Görüntüle
                        </Link>
                        <Link
                            to="/siparis"
                            className="btn btn-gold btn-lg"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Siparişi Tamamla
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
