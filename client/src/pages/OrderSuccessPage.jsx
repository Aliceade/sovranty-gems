import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { formatPrice, formatDate } from '../utils/helpers';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: '8rem' }} />;

  return (
    <main className="success-page">
      <div className="success-page__inner container">
        <motion.div
          className="success-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Animated crown */}
          <div className="success-emblem">
            <motion.div
              className="success-emblem__ring"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.span
              className="success-emblem__icon"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >✦</motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="success-eyebrow">Acquisition Confirmed</div>
            <h1 className="success-title">Your <em>Legacy</em><br />Begins Here</h1>
            <p className="success-subtitle">
              Your order has been received and is being prepared with sovereign care. You will receive a confirmation at {order?.paymentResult?.email_address || 'your email address'}.
            </p>

            {order && (
              <div className="success-ref">
                <span className="success-ref__label">Legacy Reference</span>
                <span className="success-ref__code">{order.legacyRef}</span>
              </div>
            )}

            {order && (
              <div className="success-items">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="success-item">
                    <div className="success-item__img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="success-item__info">
                      <div className="success-item__name">{item.name}</div>
                      <div className="success-item__qty">Qty: {item.qty}</div>
                    </div>
                    <div className="success-item__price">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
            )}

            {order && (
              <div className="success-total">
                <span>Total Acquired</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            )}

            <div className="success-actions">
              <Link to="/inner-circle" className="btn-primary"><span>View Legacy Log</span></Link>
              <Link to="/shop" className="btn-ghost">Continue Acquiring</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}