import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/inner-circle';
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back, Sovereign.');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200" alt="background" />
        <div className="auth-page__overlay" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="auth-card__logo">
          <span className="auth-logo-mark">✦</span>
          <span>Sovranty Gems</span>
        </div>
        <div className="auth-card__eyebrow">The Inner Circle</div>
        <h1 className="auth-card__title">Welcome<br /><em>Back</em></h1>
        <p className="auth-card__subtitle">Enter your credentials to access your sovereign space.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            <span>{loading ? 'Verifying…' : 'Enter the Inner Circle'}</span>
          </button>
        </form>

        <p className="auth-card__switch">
          Not yet a member?{' '}
          <Link to="/inner-circle/join">Request Access →</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Welcome to the Inner Circle.');
      navigate('/inner-circle');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <img src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200" alt="background" />
        <div className="auth-page__overlay" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="auth-card__logo">
          <span className="auth-logo-mark">✦</span>
          <span>Sovranty Gems</span>
        </div>
        <div className="auth-card__eyebrow">Membership</div>
        <h1 className="auth-card__title">Join the<br /><em>Inner Circle</em></h1>
        <p className="auth-card__subtitle">Gain access to your Legacy Log, exclusive pieces, and sovereign privileges.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Your Royal Name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            <span>{loading ? 'Granting Access…' : 'Request Membership'}</span>
          </button>
        </form>

        <p className="auth-card__switch">
          Already a member?{' '}
          <Link to="/inner-circle/login">Enter here →</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;