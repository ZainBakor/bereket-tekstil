import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getColorById, getSizeById } from '../data/products';
import './Cart.css';

const Cart = () => {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2>Sepetiniz Boş</h2>
                        <p>Henüz sepetinize ürün eklemediniz.</p>
                        <Link to="/urunler" className="btn btn-gold btn-lg">
                            Alışverişe Başla
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <section className="page-header">
                <div className="container">
                    <h1>Sepetim</h1>
                    <p>{cartItems.length} ürün sepetinizde</p>
                </div>
            </section>

            <section className="cart-section">
                <div className="container">
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div className="cart-items-container">
                            <div className="cart-header">
                                <h3>Ürünler</h3>
                                <button className="clear-cart-btn" onClick={clearCart}>
                                    Sepeti Temizle
                                </button>
                            </div>

                            <ul className="cart-items-list">
                                {cartItems.map(item => {
                                    const color = getColorById(item.selectedColor);
                                    const size = getSizeById(item.selectedSize);

                                    return (
                                        <li key={item.cartId} className="cart-item">
                                            <div className="cart-item-image">
                                                <img src={item.images?.[0]} alt={item.name} />
                                            </div>

                                            <div className="cart-item-details">
                                                <Link to={`/urun/${item.id}`} className="cart-item-name">
                                                    {item.name}
                                                </Link>
                                                <div className="cart-item-options">
                                                    {color && <span>Renk: {color.name}</span>}
                                                    {size && <span>Beden: {size.name}</span>}
                                                </div>
                                                <div className="cart-item-price-mobile">
                                                    {formatPrice(item.price)}
                                                </div>
                                            </div>

                                            <div className="cart-item-price hide-mobile">
                                                {formatPrice(item.price)}
                                            </div>

                                            <div className="cart-item-quantity">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
                                                    +
                                                </button>
                                            </div>

                                            <div className="cart-item-total hide-mobile">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>

                                            <button
                                                className="cart-item-remove"
                                                onClick={() => removeFromCart(item.cartId)}
                                                aria-label="Ürünü kaldır"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Order Summary */}
                        <div className="order-summary">
                            <h3>Sipariş Özeti</h3>

                            <div className="summary-row">
                                <span>Ara Toplam</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Kargo</span>
                                <span className="free-shipping">Ücretsiz</span>
                            </div>

                            <div className="summary-total">
                                <span>Toplam</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>

                            <Link to="/siparis" className="btn btn-gold btn-lg checkout-btn">
                                Siparişi Tamamla
                            </Link>

                            <Link to="/urunler" className="continue-shopping">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                Alışverişe Devam Et
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Cart;
