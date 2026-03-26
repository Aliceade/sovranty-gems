import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getCoverImage } from '../utils/helpers';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, subtotal, shipping, tax, total } = useCart();
  const navigate = useNavigate();

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <span className="eyebrow-text">Your</span>
          <h1 className="cart-page__title">Collection</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__mark">✦</div>
            <p>Your collection awaits its first piece.</p>
            <Link to="/shop" className="btn-primary"><span>Enter The Vault</span></Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              <div className="cart-table-header">
                <span>Piece</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
                <span />
              </div>
              {cartItems.map(item => (
                <div key={item._id} className="cart-table-row">
                  <div className="cart-table-row__piece">
                    <Link to={`/shop/${item.slug}`}>
                      <img src={getCoverImage(item.images)} alt={item.name} />
                    </Link>
                    <div>
                      <Link to={`/shop/${item.slug}`} className="cart-row__name">{item.name}</Link>
                      <div className="cart-row__collection">{item.collection}</div>
                    </div>
                  </div>
                  <div className="cart-table-row__price">{formatPrice(item.price)}</div>
                  <div className="cart-table-row__qty">
                    <div className="qty-ctrl">
                      <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-table-row__total">{formatPrice(item.price * item.qty)}</div>
                  <button className="cart-table-row__remove" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              ))}
            </div>

            <aside className="cart-page__summary">
              <h3 className="cart-summary-title">Order Summary</h3>
              <div className="cart-summary-rows">
                <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="cart-summary-row"><span>Sovereign Delivery</span><span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span></div>
                <div className="cart-summary-row"><span>Tax</span><span>{formatPrice(tax)}</span></div>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="btn-primary w-full" style={{ marginTop: '1.5rem', justifyContent: 'center' }} onClick={() => navigate('/checkout')}>
                <span>Proceed to Coronation</span>
              </button>
              <Link to="/shop" className="cart-continue-link">Continue Acquiring →</Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}