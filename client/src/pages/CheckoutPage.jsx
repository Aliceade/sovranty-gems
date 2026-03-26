import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatPrice, getCoverImage } from '../utils/helpers';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const STEPS = ['Your Collection', 'Delivery', 'Payment'];

export default function CheckoutPage() {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const [shippingAddr, setShippingAddr] = useState({
    street: '', city: '', state: '', country: 'Nigeria', postalCode: ''
  });

  const stepVariants = {
    enter:  { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit:   { opacity: 0, x: -40 },
  };

  // Step 1 → 2: create the order record, then proceed to payment step
  const handleProceedToPayment = async () => {
    if (!shippingAddr.street || !shippingAddr.city || !shippingAddr.country) {
      return toast.error('Please fill in your delivery address.');
    }
    setPlacing(true);
    try {
      const orderData = {
        orderItems: cartItems.map(i => ({
          product: i._id,
          name: i.name,
          image: getCoverImage(i.images),
          price: i.price,
          qty: i.qty,
        })),
        shippingAddress: shippingAddr,
        paymentMethod: 'Paystack',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };
      const { data } = await api.post('/orders', orderData);
      setCreatedOrderId(data._id);
      setStep(2);
    } catch (err) {
      toast.error('Could not create order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // Step 2: launch Paystack inline popup
  const handlePaystack = () => {
    if (!createdOrderId) return;

    const paystackKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
    if (!paystackKey) {
      toast.error('Paystack key not configured. Check your .env file.');
      return;
    }

    // Dynamically load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: user.email,
        amount: Math.round(total * 100), // Convert to kobo
        currency: 'NGN',
        ref: `SG-${createdOrderId}-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Order ID',     variable_name: 'order_id',   value: createdOrderId },
            { display_name: 'Customer',     variable_name: 'customer',   value: user.name },
            { display_name: 'Legacy Ref',   variable_name: 'legacy_ref', value: createdOrderId },
          ],
        },
        callback: async (response) => {
          // Payment succeeded — verify server-side
          try {
            await api.put(`/orders/${createdOrderId}/pay`, {
              reference: response.reference,
            });
            clearCart();
            navigate(`/order-success/${createdOrderId}`);
          } catch (err) {
            toast.error('Payment verified but order update failed. Contact support with ref: ' + response.reference);
          }
        },
        onClose: () => {
          toast.info('Payment window closed. Your order is saved — complete payment anytime.');
        },
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  return (
    <main className="checkout-page">
      <div className="checkout-page__inner container">

        {/* Left: Steps */}
        <div className="checkout-main">
          <div className="checkout-header">
            <div className="checkout-logo">
              <span className="logo-mark">✦</span>
              <span>Sovranty Gems</span>
            </div>
            <h1 className="checkout-title">The Coronation</h1>
          </div>

          {/* Step Indicators */}
          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="step-circle">{i < step ? '✓' : i + 1}</div>
                <span className="step-label">{s}</span>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="checkout-step-content"
            >
              {/* ── Step 0: Review Cart ── */}
              {step === 0 && (
                <div>
                  <h2 className="step-heading">Your Collection</h2>
                  <div className="checkout-items">
                    {cartItems.map(item => (
                      <div key={item._id} className="checkout-item">
                        <div className="checkout-item__img">
                          <img src={getCoverImage(item.images)} alt={item.name} />
                          <span className="checkout-item__qty">{item.qty}</span>
                        </div>
                        <div className="checkout-item__info">
                          <div className="checkout-item__name">{item.name}</div>
                          <div className="checkout-item__collection">{item.collection}</div>
                        </div>
                        <div className="checkout-item__price">{formatPrice(item.price * item.qty)}</div>
                      </div>
                    ))}
                  </div>
                  <button className="checkout-next" onClick={() => setStep(1)}>
                    <span>Continue to Delivery →</span>
                  </button>
                </div>
              )}

              {/* ── Step 1: Delivery ── */}
              {step === 1 && (
                <div>
                  <h2 className="step-heading">Sovereign Delivery</h2>
                  <div className="checkout-form-grid">
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={shippingAddr.street}
                        onChange={e => setShippingAddr(a => ({ ...a, street: e.target.value }))}
                        placeholder="14 Victoria Island Boulevard"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={shippingAddr.city}
                        onChange={e => setShippingAddr(a => ({ ...a, city: e.target.value }))}
                        placeholder="Lagos"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={shippingAddr.state}
                        onChange={e => setShippingAddr(a => ({ ...a, state: e.target.value }))}
                        placeholder="Lagos State"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        value={shippingAddr.country}
                        onChange={e => setShippingAddr(a => ({ ...a, country: e.target.value }))}
                        placeholder="Nigeria"
                      />
                    </div>
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        value={shippingAddr.postalCode}
                        onChange={e => setShippingAddr(a => ({ ...a, postalCode: e.target.value }))}
                        placeholder="100001"
                      />
                    </div>
                  </div>
                  <div className="checkout-nav">
                    <button className="checkout-back" onClick={() => setStep(0)}>← Back</button>
                    <button
                      className="checkout-next"
                      onClick={handleProceedToPayment}
                      disabled={placing || !shippingAddr.street || !shippingAddr.city}
                    >
                      <span>{placing ? 'Saving…' : 'Continue to Payment →'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Paystack Payment ── */}
              {step === 2 && (
                <div>
                  <h2 className="step-heading">Secure Your Acquisition</h2>

                  <div className="paystack-notice">
                    <div className="paystack-notice__icon">🔒</div>
                    <div>
                      <div className="paystack-notice__title">Secured by Paystack</div>
                      <div className="paystack-notice__sub">
                        Pay with card, bank transfer, USSD, or mobile money. Your details are never stored by Sovranty Gems.
                      </div>
                    </div>
                  </div>

                  <div className="paystack-summary">
                    <div className="paystack-summary__row">
                      <span>Paying as</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="paystack-summary__row">
                      <span>Amount</span>
                      <span className="paystack-summary__amount">{formatPrice(total)} NGN</span>
                    </div>
                  </div>

                  <div className="paystack-methods">
                    {['Debit / Credit Card', 'Bank Transfer', 'USSD', 'Mobile Money'].map(m => (
                      <div key={m} className="paystack-method">
                        <span className="paystack-method__dot" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-nav">
                    <button className="checkout-back" onClick={() => setStep(1)}>← Back</button>
                    <button className="checkout-place" onClick={handlePaystack}>
                      <span>Pay {formatPrice(total)} via Paystack</span>
                    </button>
                  </div>

                  <p className="checkout-disclaimer">
                    By completing this acquisition you agree to Sovranty Gems' Terms of Sovereignty. All sales are final.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Order Summary */}
        <aside className="checkout-summary">
          <h3 className="checkout-summary__title">Order Summary</h3>
          <div className="checkout-summary__items">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item">
                <div className="summary-item__img">
                  <img src={getCoverImage(item.images)} alt={item.name} />
                  <span className="summary-item__qty">{item.qty}</span>
                </div>
                <div className="summary-item__name">{item.name}</div>
                <div className="summary-item__price">{formatPrice(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
          <div className="checkout-summary__divider" />
          <div className="checkout-summary__rows">
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row">
              <span>Sovereign Delivery</span>
              <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
            </div>
            <div className="summary-row"><span>VAT (7.5%)</span><span>{formatPrice(tax)}</span></div>
          </div>
          <div className="checkout-summary__total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="checkout-summary__currency">
            All prices in Nigerian Naira (₦ NGN)
          </div>
        </aside>
      </div>
    </main>
  );
}