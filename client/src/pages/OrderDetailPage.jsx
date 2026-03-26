import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { formatPrice, formatDate } from '../utils/helpers';
import './OrderDetailPage.css';

const STATUS_STEPS = ['Awaiting Payment', 'Confirmed', 'In Preparation', 'Dispatched', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: '8rem' }} />;
  if (!order) {
    return (
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <p>Acquisition record not found.</p>
        <Link to="/inner-circle" className="btn-ghost" style={{ marginTop: '1rem' }}>
          Back to Legacy Log
        </Link>
      </main>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <main className="order-detail-page">
      <div className="container">
        {/* Back link */}
        <Link to="/inner-circle" className="order-detail__back">
          ← Back to Legacy Log
        </Link>

        {/* Header */}
        <motion.div
          className="order-detail__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="order-detail__eyebrow">Acquisition Record</span>
            <h1 className="order-detail__ref">{order.legacyRef}</h1>
            <p className="order-detail__date">Placed {formatDate(order.createdAt)}</p>
          </div>
          <div className="order-detail__status-badge" data-status={order.status}>
            {order.status}
          </div>
        </motion.div>

        {/* Progress Tracker */}
        {order.status !== 'Cancelled' && (
          <div className="order-tracker">
            {STATUS_STEPS.map((step, i) => (
              <div
                key={step}
                className={`order-tracker__step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}
              >
                <div className="order-tracker__dot">
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className="order-tracker__label">{step}</span>
                {i < STATUS_STEPS.length - 1 && <div className="order-tracker__line" />}
              </div>
            ))}
          </div>
        )}

        <div className="order-detail__body">
          {/* Left: Items + Delivery */}
          <div className="order-detail__main">
            {/* Items */}
            <section className="order-section">
              <h2 className="order-section__title">Pieces Acquired</h2>
              {order.orderItems.map((item, i) => (
                <div key={i} className="order-item">
                  <div className="order-item__img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="order-item__info">
                    <div className="order-item__name">{item.name}</div>
                    <div className="order-item__qty">Quantity: {item.qty}</div>
                  </div>
                  <div className="order-item__price">{formatPrice(item.price)}</div>
                </div>
              ))}
            </section>

            {/* Delivery */}
            <section className="order-section">
              <h2 className="order-section__title">Delivery Address</h2>
              <div className="order-address">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
                <p>{order.shippingAddress.country} {order.shippingAddress.postalCode}</p>
              </div>
            </section>

            {/* Payment */}
            <section className="order-section">
              <h2 className="order-section__title">Payment</h2>
              <div className="order-payment">
                <div className="order-payment__row">
                  <span>Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="order-payment__row">
                  <span>Status</span>
                  <span className={order.isPaid ? 'paid' : 'unpaid'}>
                    {order.isPaid ? `Confirmed — ${formatDate(order.paidAt)}` : 'Awaiting Payment'}
                  </span>
                </div>
                {order.paymentResult?.reference && (
                  <div className="order-payment__row">
                    <span>Reference</span>
                    <span className="order-payment__ref">{order.paymentResult.reference}</span>
                  </div>
                )}
                {order.paymentResult?.channel && (
                  <div className="order-payment__row">
                    <span>Channel</span>
                    <span style={{ textTransform: 'capitalize' }}>{order.paymentResult.channel}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right: Summary */}
          <aside className="order-detail__summary">
            <h2 className="order-section__title">Order Summary</h2>
            <div className="order-summary-rows">
              <div className="order-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.itemsPrice)}</span>
              </div>
              <div className="order-summary-row">
                <span>Sovereign Delivery</span>
                <span>{order.shippingPrice === 0 ? 'Complimentary' : formatPrice(order.shippingPrice)}</span>
              </div>
              <div className="order-summary-row">
                <span>VAT (7.5%)</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
            </div>
            <div className="order-summary-total">
              <span>Total Acquired</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
            <Link to="/shop" className="btn-primary" style={{ marginTop: '2rem', justifyContent: 'center' }}>
              <span>Continue Acquiring</span>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}