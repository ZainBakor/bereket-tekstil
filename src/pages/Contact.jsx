import { useState } from 'react';
import './Contact.css';

const CONTACT_EMAIL = 'info.berekettekstil@gmail.com';

// Country codes with validation rules
const countryCodes = [
    { code: '+90', flag: '🇹🇷', name: 'Türkiye', digits: 10, startsWith: '5', format: 'XXX XXX XX XX', placeholder: '5XX XXX XX XX' },
    { code: '+49', flag: '🇩🇪', name: 'Almanya', digits: 11, startsWith: null, format: 'XXX XXXXXXXX', placeholder: 'XXX XXXXXXXX' },
    { code: '+44', flag: '🇬🇧', name: 'İngiltere', digits: 10, startsWith: '7', format: 'XXXX XXX XXX', placeholder: '7XXX XXX XXX' },
    { code: '+1', flag: '🇺🇸', name: 'ABD', digits: 10, startsWith: null, format: 'XXX XXX XXXX', placeholder: 'XXX XXX XXXX' },
    { code: '+33', flag: '🇫🇷', name: 'Fransa', digits: 9, startsWith: null, format: 'X XX XX XX XX', placeholder: 'X XX XX XX XX' },
    { code: '+31', flag: '🇳🇱', name: 'Hollanda', digits: 9, startsWith: '6', format: 'X XXXX XXXX', placeholder: '6 XXXX XXXX' },
    { code: '+32', flag: '🇧🇪', name: 'Belçika', digits: 9, startsWith: '4', format: 'XXX XX XX XX', placeholder: '4XX XX XX XX' },
    { code: '+43', flag: '🇦🇹', name: 'Avusturya', digits: 10, startsWith: null, format: 'XXX XXX XXXX', placeholder: 'XXX XXX XXXX' },
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: '+90',
        phone: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Get current country config
    const getCurrentCountry = () => {
        return countryCodes.find(c => c.code === formData.countryCode) || countryCodes[0];
    };

    // Subject options mapping
    const subjectOptions = {
        'siparis': 'Sipariş Hakkında',
        'urun': 'Ürün Bilgisi',
        'toptan': 'Toptan Satış',
        'ozel': 'Özel Tasarım',
        'diger': 'Diğer'
    };

    // Format phone number based on country
    const formatPhoneNumber = (value, countryCode) => {
        const country = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
        const numbers = value.replace(/\D/g, '');
        const limited = numbers.slice(0, country.digits);

        // Turkey format: XXX XXX XX XX
        if (countryCode === '+90') {
            if (limited.length <= 3) return limited;
            if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
            if (limited.length <= 8) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
            return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
        }

        // Germany format: XXX XXXXXXXX
        if (countryCode === '+49') {
            if (limited.length <= 3) return limited;
            return `${limited.slice(0, 3)} ${limited.slice(3)}`;
        }

        // UK format: XXXX XXX XXX
        if (countryCode === '+44') {
            if (limited.length <= 4) return limited;
            if (limited.length <= 7) return `${limited.slice(0, 4)} ${limited.slice(4)}`;
            return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7)}`;
        }

        // USA format: XXX XXX XXXX
        if (countryCode === '+1') {
            if (limited.length <= 3) return limited;
            if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
            return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
        }

        // Default: just add spaces every 3 digits
        return limited.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    };

    // Validate phone based on country
    const validatePhone = (phone, countryCode) => {
        if (!phone) return null; // Phone is optional

        const country = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
        const cleanPhone = phone.replace(/\s/g, '');

        if (cleanPhone.length !== country.digits) {
            return `Telefon numarası ${country.digits} haneli olmalıdır (${country.name})`;
        }

        if (country.startsWith && !cleanPhone.startsWith(country.startsWith)) {
            return `${country.name} cep telefonu numarası ${country.startsWith} ile başlamalıdır`;
        }

        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;

        // Format phone number
        if (name === 'phone') {
            formattedValue = formatPhoneNumber(value, formData.countryCode);
        }

        // Clear phone when country code changes
        if (name === 'countryCode') {
            setFormData(prev => ({ ...prev, [name]: value, phone: '' }));
            if (errors.phone) {
                setErrors(prev => ({ ...prev, phone: '' }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Ad Soyad gerekli';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-posta gerekli';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi girin';
        }

        // Validate phone if provided
        if (formData.phone) {
            const phoneError = validatePhone(formData.phone, formData.countryCode);
            if (phoneError) {
                newErrors.phone = phoneError;
            }
        }

        if (!formData.subject) {
            newErrors.subject = 'Lütfen bir konu seçin';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Mesaj gerekli';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Get full phone with country code
    const getFullPhone = () => {
        if (!formData.phone) return 'Belirtilmedi';
        const cleanPhone = formData.phone.replace(/\s/g, '');
        return `${formData.countryCode} ${formData.phone}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Build email content
        const subjectText = subjectOptions[formData.subject] || formData.subject;
        const emailSubject = `[Bereket Tekstil] ${subjectText} - ${formData.name}`;

        const emailBody = `
Merhaba Bereket Tekstil,

Yeni bir iletişim formu mesajı aldınız:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 İLETİŞİM BİLGİLERİ:
• Ad Soyad: ${formData.name}
• E-posta: ${formData.email}
• Telefon: ${getFullPhone()}

📌 KONU: ${subjectText}

💬 MESAJ:
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bu mesaj berekettekstil.com iletişim formundan gönderilmiştir.
        `.trim();

        // Create mailto link
        const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Open email client
        window.location.href = mailtoLink;

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', countryCode: '+90', phone: '', subject: '', message: '' });
    };

    // Alternative: Send via WhatsApp
    const handleWhatsAppSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const subjectText = subjectOptions[formData.subject] || formData.subject;

        const whatsappMessage = `
Merhaba Bereket Tekstil! 👋

*İletişim Formu Mesajı*

📋 *Bilgilerim:*
• Ad Soyad: ${formData.name}
• E-posta: ${formData.email}
• Telefon: ${getFullPhone()}

📌 *Konu:* ${subjectText}

💬 *Mesajım:*
${formData.message}
        `.trim();

        const whatsappLink = `https://wa.me/905011072220?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappLink, '_blank');
    };

    const currentCountry = getCurrentCountry();

    const contactInfo = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            title: 'Adres',
            content: 'İstanbul, Türkiye',
            subContent: '(Detaylı adres bilgisi eklenecek)'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            title: 'Telefon',
            content: '+90 551 163 69 83',
            link: 'tel:+905511636983'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
            title: 'E-posta',
            content: 'info.berekettekstil@gmail.com',
            link: 'mailto:info.berekettekstil@gmail.com'
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            title: 'WhatsApp',
            content: '+90 551 163 69 83',
            link: 'https://wa.me/905511636983?text=Merhaba%2C%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum'
        }
    ];

    return (
        <main className="contact-page">
            <section className="page-header">
                <div className="container">
                    <h1>Bize Ulaşın</h1>
                    <p>Sorularınız için her zaman buradayız</p>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <div className="contact-layout">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2>İletişim Bilgileri</h2>
                            <p>Cübbe ve kep siparişleriniz veya sorularınız için bizimle iletişime geçebilirsiniz.</p>

                            <div className="contact-cards">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="contact-card">
                                        <div className="contact-card-icon">
                                            {item.icon}
                                        </div>
                                        <div className="contact-card-content">
                                            <h4>{item.title}</h4>
                                            {item.link ? (
                                                <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                                                    {item.content}
                                                </a>
                                            ) : (
                                                <>
                                                    <p>{item.content}</p>
                                                    {item.subContent && <span>{item.subContent}</span>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="contact-social">
                                <h4>Sosyal Medya</h4>
                                <div className="social-links">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    </a>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-container">
                            <h2>Mesaj Gönderin</h2>

                            {isSubmitted ? (
                                <div className="form-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <h3>E-posta İstemciniz Açıldı!</h3>
                                    <p>Mesajınızı göndermek için e-posta istemcinizdeki "Gönder" butonuna tıklayın.</p>
                                    <p className="email-note">Mesajınız <strong>{CONTACT_EMAIL}</strong> adresine gönderilecektir.</p>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Yeni Mesaj Gönder
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Ad Soyad *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`form-input ${errors.name ? 'error' : ''}`}
                                                placeholder="Adınız Soyadınız"
                                            />
                                            {errors.name && <span className="form-error">{errors.name}</span>}
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
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Telefon</label>
                                            <div className="phone-input-wrapper">
                                                <select
                                                    name="countryCode"
                                                    value={formData.countryCode}
                                                    onChange={handleChange}
                                                    className="country-code-select"
                                                >
                                                    {countryCodes.map(country => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.flag} {country.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`form-input phone-input ${errors.phone ? 'error' : ''}`}
                                                    placeholder={currentCountry.placeholder}
                                                    maxLength={currentCountry.digits + 5}
                                                />
                                            </div>
                                            {errors.phone && <span className="form-error">{errors.phone}</span>}
                                            <span className="form-hint">
                                                {currentCountry.name}: {currentCountry.digits} haneli ({currentCountry.format})
                                            </span>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Konu *</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className={`form-select ${errors.subject ? 'error' : ''}`}
                                            >
                                                <option value="">Konu Seçin</option>
                                                <option value="siparis">Sipariş Hakkında</option>
                                                <option value="urun">Ürün Bilgisi</option>
                                                <option value="toptan">Toptan Satış</option>
                                                <option value="ozel">Özel Tasarım</option>
                                                <option value="diger">Diğer</option>
                                            </select>
                                            {errors.subject && <span className="form-error">{errors.subject}</span>}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Mesajınız *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className={`form-textarea ${errors.message ? 'error' : ''}`}
                                            placeholder="Mesajınızı buraya yazın..."
                                            rows="5"
                                        />
                                        {errors.message && <span className="form-error">{errors.message}</span>}
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            className="btn btn-gold btn-lg"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Hazırlanıyor...
                                                </>
                                            ) : (
                                                <>
                                                    Mesaj Gönder
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="22" y1="2" x2="11" y2="13" />
                                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-whatsapp btn-lg"
                                            onClick={handleWhatsAppSubmit}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            WhatsApp ile Gönder
                                        </button>
                                    </div>

                                    <p className="form-note">
                                        * "Mesaj Gönder" butonuna tıkladığınızda e-posta istemciniz açılacaktır.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
