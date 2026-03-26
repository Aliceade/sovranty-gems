import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getCoverImage } from '../utils/helpers';
import './CartDrawer.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

export default function CartDrawer() {
  const {
    cartItems, isCartOpen, setIsCartOpen,
    removeFromCart, updateQty,
    subtotal, shipping, total,
    FREE_DELIVERY_THRESHOLD,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Progress toward free delivery
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'cart-overlay--visible' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />
      <aside className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <span className="cart-drawer__eyebrow">Your</span>
            <h3 className="cart-drawer__title">Collection</h3>
          </div>
          <button className="cart-drawer__close" onClick={() => setIsCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* Free delivery bar */}
        {cartItems.length > 0 && (
          <div className="cart-delivery-bar">
            {freeDelivery ? (
              <p className="cart-delivery-bar__msg cart-delivery-bar__msg--free">
                ✦ Complimentary sovereign delivery unlocked
              </p>
            ) : (
              <>
                <p className="cart-delivery-bar__msg">
                  Add <strong>{formatPrice(remaining)}</strong> more for complimentary delivery
                </p>
                <div className="cart-delivery-bar__track">
                  <div
                    className="cart-delivery-bar__fill"
                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">✦</div>
            <p>Your collection awaits its first piece.</p>
            <Link to="/shop" className="btn-primary" onClick={() => setIsCartOpen(false)}>
              <span>Enter The Vault</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cart-drawer__items">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item__image">
                    <img src={getCoverImage(item.images)} alt={item.name} />
                  </div>
                  <div className="cart-item__info">
                    <Link
                      to={`/shop/${item.slug}`}
                      className="cart-item__name"
                      onClick={() => setIsCartOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="cart-item__collection">{item.collection}</div>
                    <div className="cart-item__price">{formatPrice(item.price)}</div>
                    <div className="cart-item__controls">
                      <div className="qty-ctrl">
                        <button onClick={() => updateQty(item._id, item.qty - 1)}><MinusIcon /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)}><PlusIcon /></button>
                      </div>
                      <button className="cart-item__remove" onClick={() => removeFromCart(item._id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-drawer__footer">
              <div className="cart-summary">
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Sovereign Delivery</span>
                  <span>{freeDelivery ? 'Complimentary' : formatPrice(shipping)}</span>
                </div>
                <div className="cart-summary__row cart-summary__total">
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button className="btn-primary w-full" onClick={handleCheckout}>
                <span>Proceed to Coronation</span>
              </button>
              <Link
                to="/shop"
                className="cart-drawer__continue"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Acquiring
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}