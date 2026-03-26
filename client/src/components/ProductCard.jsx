import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getCoverImage } from '../utils/helpers';
import { toast } from 'react-toastify';
import './ProductCard.css';

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function ProductCard({ product, variant = 'standard' }) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const cover = getCoverImage(product.images);
  const second = product.images?.[1]?.url;

  const handleClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setClaiming(true);
    addToCart(product, 1);
    toast.success(`"${product.name}" added to your Collection`);
    setTimeout(() => setClaiming(false), 800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link to={`/shop/${product.slug}`} className={`product-card product-card--${variant}`}>
      <div className="product-card__media">
        <img src={cover} alt={product.name} className="product-card__img product-card__img--primary" loading="lazy" />
        {second && (
          <img src={second} alt={product.name + ' alt'} className="product-card__img product-card__img--secondary" loading="lazy" />
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.isExclusive && <span className="badge badge--exclusive">Exclusive</span>}
          {product.compareAtPrice && <span className="badge badge--sale">Special Acquisition</span>}
          {product.countInStock <= 2 && product.countInStock > 0 && (
            <span className="badge badge--scarce">{product.countInStock} Remaining</span>
          )}
        </div>

        {/* Wishlist */}
        <button className={`product-card__wishlist ${wishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist}>
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Hover CTA */}
        <div className="product-card__hover-cta">
          <button className={`claim-btn ${claiming ? 'claiming' : ''}`} onClick={handleClaim}>
            <span>{claiming ? '✦' : 'Claim Piece'}</span>
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <div className="product-card__meta">
          <span className="product-card__collection">{product.collection}</span>
          <span className="product-card__intent">{product.intent}</span>
        </div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__tagline">{product.tagline}</p>
        <div className="product-card__pricing">
          {product.compareAtPrice && (
            <span className="product-card__price--compare">{formatPrice(product.compareAtPrice)}</span>
          )}
          <span className="product-card__price">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}