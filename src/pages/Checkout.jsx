import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { formatPrice, getColorById, getSizeById } from '../data/products';
import './Checkout.css';

// Turkish cities for validation
const turkishCities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
    'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
    'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
    'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
    'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
    'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
    'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
    'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
    'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [finalWhatsAppMsg, setFinalWhatsAppMsg] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+90',
        phone: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    if (cartItems.length === 0 && !orderComplete) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="empty-cart">
                        <h2>Sepetiniz Boş</h2>
                        <p>Sipariş vermek için sepetinize ürün ekleyin.</p>
                        <Link to="/urunler" className="btn btn-gold btn-lg">
                            Alışverişe Başla
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Format phone number as user types (XXX XXX XX XX)
    const formatPhoneNumber = (value) => {
        // Only keep numbers
        const numbers = value.replace(/\D/g, '');

        // Limit to 10 digits (Turkish phone without country code)
        const limited = numbers.slice(0, 10);

        // Format as XXX XXX XX XX
        if (limited.length <= 3) return limited;
        if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
        if (limited.length <= 8) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
    };

    // Format postal code (5 digits for Turkey)
    const formatPostalCode = (value) => {
        // Only keep numbers
        const numbers = value.replace(/\D/g, '');
        // Limit to 5 digits
        return numbers.slice(0, 5);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;

        // Special formatting for phone
        if (name === 'phone') {
            formattedValue = formatPhoneNumber(value);
        }

        // Special formatting for postal code
        if (name === 'postalCode') {
            formattedValue = formatPostalCode(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validatePhone = (phone) => {
        // Remove spaces and check if it's exactly 10 digits
        const cleanPhone = phone.replace(/\s/g, '');

        // Turkish mobile numbers start with 5
        if (cleanPhone.length !== 10) {
            return 'Telefon numarası 10 haneli olmalıdır';
        }

        if (!cleanPhone.startsWith('5')) {
            return 'Geçerli bir cep telefonu numarası girin (5XX ile başlamalı)';
        }

        return null;
    };

    const validatePostalCode = (postalCode) => {
        if (!postalCode) return null; // Optional field

        // Turkish postal codes are 5 digits
        if (postalCode.length !== 5) {
            return 'Posta kodu 5 haneli olmalıdır';
        }

        // Check if it's a valid Turkish postal code range (01000-81999)
        const code = parseInt(postalCode, 10);
        if (code < 1000 || code > 81999) {
            return 'Geçerli bir posta kodu girin (01000-81999)';
        }

        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Ad gerekli';
        if (!formData.lastName.trim()) newErrors.lastName = 'Soyad gerekli';

        if (!formData.email.trim()) {
            newErrors.email = 'E-posta gerekli';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi girin';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon numarası gerekli';
        } else {
            const phoneError = validatePhone(formData.phone);
            if (phoneError) newErrors.phone = phoneError;
        }

        if (!formData.address.trim()) newErrors.address = 'Adres gerekli';
        if (!formData.city.trim()) newErrors.city = 'İl gerekli';
        if (!formData.district.trim()) newErrors.district = 'İlçe gerekli';

        // Validate postal code if provided
        if (formData.postalCode) {
            const postalError = validatePostalCode(formData.postalCode);
            if (postalError) newErrors.postalCode = postalError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Generate order number for reference
            const orderNum = 'BRK' + Date.now().toString().slice(-8);
            setOrderNumber(orderNum);

            // 1. Save order to Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    order_number: orderNum,
                    customer_name: `${formData.firstName} ${formData.lastName}`,
                    customer_email: formData.email,
                    customer_phone: getFullPhoneNumber(),
                    shipping_address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    postal_code: formData.postalCode,
                    notes: formData.notes,
                    total_amount: cartTotal,
                    status: 'pending'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Save order items to Supabase
            const orderItemsInsert = cartItems.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                selected_color: getColorById(item.selectedColor)?.name || item.selectedColor,
                selected_size: getSizeById(item.selectedSize)?.name || item.selectedSize
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsInsert);

            if (itemsError) throw itemsError;

            // 3. Get the detailed message before clearing the cart
            const whatsappMsg = getWhatsAppMessage(orderNum);
            setFinalWhatsAppMsg(whatsappMsg);

            // 4. Clear cart
            clearCart();

            // 5. Show success state
            setOrderComplete(true);
            setIsSubmitting(false);

            // Direct redirection to WhatsApp
            const whatsappUrl = `https://wa.me/905511636983?text=${encodeURIComponent(whatsappMsg)}`;
            window.location.href = whatsappUrl;
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
            setIsSubmitting(false);
        }
    };

    // Get full phone number with country code
    const getFullPhoneNumber = () => {
        const cleanPhone = formData.phone.replace(/\s/g, '');
        return `${formData.countryCode}${cleanPhone}`;
    };

    const getWhatsAppMessage = (orderNum) => {
        let message = `*Yeni Sipariş: ${orderNum}*\n\n`;
        message += `*Müşteri:* ${formData.firstName} ${formData.lastName}\n`;
        message += `*Telefon:* ${getFullPhoneNumber()}\n`;
        message += `*Adres:* ${formData.address}, ${formData.district}/${formData.city}\n\n`;
        message += `*Ürünler:*\n`;

        cartItems.forEach(item => {
            const color = getColorById(item.selectedColor);
            const size = getSizeById(item.selectedSize);
            const productUrl = `${window.location.origin}/urun/${item.id}`;
            message += `* ${item.quantity}x ${item.name} (${color?.name || ''}, ${size?.name || ''}) - ${formatPrice(item.price * item.quantity)}\n   Link: ${productUrl}\n`;
        });

        message += `\n*Toplam Tutar: ${formatPrice(cartTotal)}*`;
        message += `\n\n*Ödeme:* IBAN bilgilerini rica ediyorum.`;

        if (formData.notes) {
            message += `\n\n*Not:* ${formData.notes}`;
        }

        return message;
    };

    if (orderComplete) {
        return (
            <main className="checkout-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h2>Siparişiniz Alındı!</h2>
                        <p className="order-number">Sipariş No: <strong>{orderNumber}</strong></p>
                        <p>Siparişiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçeceğiz.</p>

                        <div className="success-actions">
                            <Link to="/" className="btn btn-gold btn-lg">
                                Ana Sayfaya Dön
                            </Link>
                            <a
                                href={`https://wa.me/905511636983?text=${encodeURIComponent(finalWhatsAppMsg)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-lg"
                            >
                                WhatsApp ile İletişim
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <section className="page-header">
                <div className="container">
                    <h1>Siparişi Tamamla</h1>
                    <p>Teslimat bilgilerinizi girin</p>
                </div>
            </section>

            <section className="checkout-section">
                <div className="container">
                    <form onSubmit={handleSubmit} className="checkout-layout">
                        {/* Checkout Form */}
                        <div className="checkout-form">
                            <div className="form-section">
                                <h3>Kişisel Bilgiler</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Ad *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`form-input ${errors.firstName ? 'error' : ''}`}
                                            placeholder="Adınız"
                                        />
                                        {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Soyad *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`form-input ${errors.lastName ? 'error' : ''}`}
                                            placeholder="Soyadınız"
                                        />
                                        {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">E-posta *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`form-input ${errors.email ? 'error' : ''}`}
                                            placeholder="ornek@email.com"
                                        />
                                        {errors.email && <span className="form-error">{errors.email}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Telefon *</label>
                                        <div className="phone-input-wrapper">
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleChange}
                                                className="country-code-select"
                                            >
                                                <option value="+90">🇹🇷 +90</option>
                                                <option value="+49">🇩🇪 +49</option>
                                                <option value="+44">🇬🇧 +44</option>
                                                <option value="+1">🇺🇸 +1</option>
                                                <option value="+33">🇫🇷 +33</option>
                                                <option value="+31">🇳🇱 +31</option>
                                                <option value="+32">🇧🇪 +32</option>
                                                <option value="+43">🇦🇹 +43</option>
                                            </select>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`form-input phone-input ${errors.phone ? 'error' : ''}`}
                                                placeholder="5XX XXX XX XX"
                                                maxLength="13"
                                            />
                                        </div>
                                        {errors.phone && <span className="form-error">{errors.phone}</span>}
                                        <span className="form-hint">Örnek: 551 163 69 83</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Teslimat Adresi</h3>
                                <div className="form-group">
                                    <label className="form-label">Adres *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`form-textarea ${errors.address ? 'error' : ''}`}
                                        placeholder="Sokak, mahalle, bina no, daire no..."
                                        rows="3"
                                    />
                                    {errors.address && <span className="form-error">{errors.address}</span>}
                                </div>
                                <div className="form-grid form-grid-3">
                                    <div className="form-group">
                                        <label className="form-label">İl *</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className={`form-select ${errors.city ? 'error' : ''}`}
                                        >
                                            <option value="">İl Seçin</option>
                                            {turkishCities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        {errors.city && <span className="form-error">{errors.city}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">İlçe *</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className={`form-input ${errors.district ? 'error' : ''}`}
                                            placeholder="Kadıköy"
                                        />
                                        {errors.district && <span className="form-error">{errors.district}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Posta Kodu</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className={`form-input ${errors.postalCode ? 'error' : ''}`}
                                            placeholder="34000"
                                            maxLength="5"
                                        />
                                        {errors.postalCode && <span className="form-error">{errors.postalCode}</span>}
                                        <span className="form-hint">5 haneli posta kodu</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Sipariş Notu</h3>
                                <div className="form-group">
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="form-textarea"
                                        placeholder="Siparişiniz hakkında not ekleyebilirsiniz (isteğe bağlı)"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h3>Sipariş Özeti</h3>

                            <ul className="checkout-items">
                                {cartItems.map(item => {
                                    const color = getColorById(item.selectedColor);
                                    const size = getSizeById(item.selectedSize);

                                    return (
                                        <li key={item.cartId} className="checkout-item">
                                            <div className="checkout-item-image">
                                                <img src={item.images?.[0]} alt={item.name} />
                                                <span className="checkout-item-qty">{item.quantity}</span>
                                            </div>
                                            <div className="checkout-item-info">
                                                <span className="checkout-item-name">{item.name}</span>
                                                <span className="checkout-item-options">
                                                    {color?.name}, {size?.name}
                                                </span>
                                            </div>
                                            <span className="checkout-item-price">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="checkout-totals">
                                <div className="checkout-row">
                                    <span>Ara Toplam</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="checkout-row">
                                    <span>Kargo</span>
                                    <span className="free">Ücretsiz</span>
                                </div>
                                <div className="checkout-total">
                                    <span>Toplam</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <p className="payment-note">
                                * Ödeme kapıda nakit veya kredi kartı ile yapılabilir.
                            </p>

                            <button
                                type="submit"
                                className="btn btn-gold btn-lg submit-order-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        İşleniyor...
                                    </>
                                ) : (
                                    'Siparişi Onayla'
                                )}
                            </button>

                            <Link to="/sepet" className="back-to-cart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                Sepete Dön
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Checkout;
