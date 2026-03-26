import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getCoverImage } from '../utils/helpers';
import './DashboardPage.css';

const TABS = ['Legacy Log', 'Wishlist', 'Profile'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Legacy Log');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/my-legacy'),
      api.get('/users/profile'),
    ])
      .then(([o, p]) => {
        setOrders(o.data);
        setProfile(p.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status) => {
    const map = {
      'Confirmed':        'var(--olive)',
      'In Preparation':   'var(--gold)',
      'Dispatched':       '#4a90d9',
      'Delivered':        'var(--olive)',
      'Cancelled':        'var(--maroon)',
      'Awaiting Payment': 'var(--warm-grey)',
    };
    return map[status] || 'var(--warm-grey)';
  };

  return (
    <main className="dashboard-page">
      {/* Header */}
      <section className="dashboard-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="dashboard-eyebrow">✦ The Inner Circle</span>
            <h1 className="dashboard-title">
              Welcome, <em>{user?.name?.split(' ')[0]}</em>
            </h1>
            <p className="dashboard-since">
              Member since {profile ? formatDate(profile.innerCircleSince) : '—'}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="dashboard-body container">
        {/* Stat Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-card__num">{orders.length}</span>
            <span className="stat-card__label">Acquisitions</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__num">{profile?.wishlist?.length || 0}</span>
            <span className="stat-card__label">In Wishlist</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__num">
              {formatPrice(orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0))}
            </span>
            <span className="stat-card__label">Total Acquired</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="dashboard-content">

            {/* ── Legacy Log ── */}
            {activeTab === 'Legacy Log' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="dashboard-section-title">The Legacy Log</h2>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <span>✦</span>
                    <p>Your legacy has yet to begin. The Vault awaits.</p>
                    <Link to="/shop" className="btn-primary"><span>Enter The Vault</span></Link>
                  </div>
                ) : (
                  <div className="legacy-list">
                    {orders.map(order => (
                      <Link
                        key={order._id}
                        to={`/inner-circle/legacy/${order._id}`}
                        className="legacy-row"
                      >
                        <div className="legacy-row__images">
                          {order.orderItems.slice(0, 3).map((item, i) => (
                            <div key={i} className="legacy-row__img">
                              <img src={item.image} alt={item.name} />
                            </div>
                          ))}
                        </div>
                        <div className="legacy-row__info">
                          <div className="legacy-row__ref">{order.legacyRef}</div>
                          <div className="legacy-row__date">{formatDate(order.createdAt)}</div>
                          <div className="legacy-row__items">
                            {order.orderItems.map(i => i.name).join(' · ')}
                          </div>
                        </div>
                        <div className="legacy-row__right">
                          <div className="legacy-row__price">{formatPrice(order.totalPrice)}</div>
                          <div className="legacy-status" style={{ color: statusColor(order.status) }}>
                            {order.status}
                          </div>
                        </div>
                        <span className="legacy-row__arrow">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Wishlist ── */}
            {activeTab === 'Wishlist' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="dashboard-section-title">Your Wishlist</h2>
                {(!profile?.wishlist || profile.wishlist.length === 0) ? (
                  <div className="empty-state">
                    <span>✦</span>
                    <p>Mark pieces that call to you. They will wait here.</p>
                    <Link to="/shop" className="btn-primary"><span>Browse The Vault</span></Link>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {profile.wishlist.map(p => (
                      <Link key={p._id} to={`/shop/${p.slug}`} className="wishlist-item">
                        <div className="wishlist-item__img">
                          <img src={getCoverImage(p.images)} alt={p.name} />
                        </div>
                        <div className="wishlist-item__info">
                          <div className="wishlist-item__name">{p.name}</div>
                          <div className="wishlist-item__price">{formatPrice(p.price)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Profile ── */}
            {activeTab === 'Profile' && profile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="dashboard-section-title">Your Sovereign Profile</h2>
                <ProfileForm profile={profile} />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function ProfileForm({ profile }) {
  const [form, setForm] = useState({
    name:     profile.name,
    email:    profile.email,
    password: '',
    confirm:  '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) {
      return toast.error('Passwords do not match.');
    }
    if (form.password && form.password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }
    setSaving(true);
    try {
      await api.put('/users/profile', {
        name:  form.name,
        email: form.email,
        ...(form.password && { password: form.password }),
      });
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="profile-form">
      <div className="profile-form__grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Leave blank to keep current"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            placeholder="••••••••"
          />
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={saving}>
        <span>{saving ? 'Saving…' : 'Save Changes'}</span>
      </button>
    </form>
  );
}