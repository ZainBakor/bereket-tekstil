import { Link } from 'react-router-dom';
import { formatPrice, getColorById } from '../../data/products';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const mainImage = product.images?.[0] || 'https://via.placeholder.com/400x400?text=Ürün';

    return (
        <Link to={`/urun/${product.id}`} className="product-card">
            <div className="product-card-image">
                <img src={mainImage} alt={product.name} loading="lazy" />

                {/* Badges */}
                <div className="product-badges">
                    {product.bestseller && (
                        <span className="badge badge-accent">Çok Satan</span>
                    )}
                    {product.oldPrice && (
                        <span className="badge badge-gold">İndirim</span>
                    )}
                </div>

                {/* Overlay */}
                <div className="product-card-overlay">
                    <span className="btn btn-sm btn-glass">İncele</span>
                </div>
            </div>

            <div className="product-card-content">
                <h3 className="product-card-title">{product.name}</h3>

                {/* Colors Preview */}
                {product.colors && product.colors.length > 0 && (
                    <div className="product-colors">
                        {product.colors.slice(0, 4).map(colorId => {
                            const color = getColorById(colorId);
                            return color ? (
                                <span
                                    key={colorId}
                                    className="color-dot"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ) : null;
                        })}
                        {product.colors.length > 4 && (
                            <span className="color-more">+{product.colors.length - 4}</span>
                        )}
                    </div>
                )}

                <div className="product-card-footer">
                    <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className="old-price">{formatPrice(product.oldPrice)}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
