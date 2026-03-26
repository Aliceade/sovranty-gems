import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils/helpers';
import './HomePage.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const intents = [
    { name: 'Power', tagline: 'For those who command the room.', img: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600' },
    { name: 'Romance', tagline: 'A language beyond words.', img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600' },
    { name: 'Legacy', tagline: 'Crafted to outlast generations.', img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600' },
    { name: 'Devotion', tagline: 'The ultimate declaration.', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600' },
  ];

  return (
    <main className="home">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__split">
          {/* Left: Editorial Image */}
          <div className="hero__image-side">
            <div className="hero__img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1583937443704-b553aeeda01b?w=1200"
                alt="Sovranty Gems Editorial"
                className="hero__main-img"
              />
              <div className="hero__img-overlay" />
            </div>
            <div className="hero__floating-badge">
              <span>✦</span>
              <span>Exclusive</span>
              <span>Collection</span>
            </div>
          </div>

          {/* Right: Copy */}
          <div className="hero__content">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.9, delay: 0.2 }}>
              <span className="hero__eyebrow">The Imperial Collection</span>
            </motion.div>
            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.9, delay: 0.4 }} className="hero__title">
              Adorn<br />
              <em>Your</em><br />
              Sovereignty
            </motion.h1>
            <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.9, delay: 0.6 }} className="hero__subtitle">
              Rare gems. Regal craft. Each piece a decree from the hands of master artisans to the wrists of those who understand power.
            </motion.p>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.9, delay: 0.8 }} className="hero__ctas">
              <Link to="/shop" className="btn-primary"><span>Enter The Vault</span></Link>
              <Link to="/collections/heirloom-protocol" className="btn-ghost">The Heirloom Protocol</Link>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.9, delay: 1.0 }} className="hero__stats">
              <div className="hero__stat"><span className="stat-num">7</span><span className="stat-label">Collections</span></div>
              <div className="hero__stat"><span className="stat-num">94</span><span className="stat-label">Unique Pieces</span></div>
              <div className="hero__stat"><span className="stat-num">∞</span><span className="stat-label">Generations</span></div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling marquee */}
        <div className="hero__marquee">
          <div className="hero__marquee-track">
            {Array(6).fill('✦ Power  ·  Romance  ·  Legacy  ·  Devotion  ·  Rebellion').map((t, i) => (
              <span key={i}>{t}&nbsp;&nbsp;&nbsp;</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Macro / Close-up Section ────────────────────────── */}
      <section className="macro-section container">
        <div className="macro-section__grid">
          <motion.div
            className="macro-section__text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="eyebrow-text">The Craft</span>
            <h2>Every stone has<br /><em>a story</em> to tell.</h2>
            <div className="divider" style={{ margin: '1.5rem 0' }} />
            <p>
              Each piece in the Sovranty Gems Vault passes through the hands of a certified master artisan. We source only conflict-free gemstones, working directly with mines in Botswana, Colombia, Tanzania, and Myanmar to ensure that every stone carries both beauty and integrity.
            </p>
            <Link to="/shop" className="btn-ghost" style={{ marginTop: '2rem' }}>Explore The Vault</Link>
          </motion.div>
          <motion.div
            className="macro-section__images"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="macro-img macro-img--tall">
              <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600" alt="Gem macro" />
            </div>
            <div className="macro-img macro-img--short">
              <img src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600" alt="Jewelry detail" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────── */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow">The Vault — Selected Acquisitions</span>
            <h2>Pieces of <em>Distinction</em></h2>
            <div className="divider" />
          </motion.div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="featured-grid">
              {featured.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`featured-grid__item featured-grid__item--${(i % 3 === 0) ? 'tall' : 'standard'}`}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="featured-section__cta">
            <Link to="/shop" className="btn-primary"><span>View All Pieces</span></Link>
          </div>
        </div>
      </section>

      {/* ── Shop by Intent ──────────────────────────────────── */}
      <section className="intent-section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow">Curated for You</span>
            <h2>Shop by <em>Intent</em></h2>
            <div className="divider" />
          </motion.div>

          <div className="intent-grid">
            {intents.map((intent, i) => (
              <motion.div
                key={intent.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <Link to={`/shop?intent=${intent.name}`} className="intent-card">
                  <div className="intent-card__img">
                    <img src={intent.img} alt={intent.name} />
                    <div className="intent-card__overlay" />
                  </div>
                  <div className="intent-card__content">
                    <h3>{intent.name}</h3>
                    <p>{intent.tagline}</p>
                    <span className="intent-card__cta">Explore →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections Strip ───────────────────────────────── */}
      <section className="collections-strip">
        <div className="container">
          <div className="collections-strip__inner">
            <div className="collections-strip__text">
              <span className="eyebrow-text">The Collections</span>
              <h2>Five Decrees.<br /><em>One Legacy.</em></h2>
              <p>Each Sovranty collection is built around a philosophy — not just aesthetics. The stones are chosen to match the energy of the name. The craftsmanship reflects its era. The result is a piece that wears time well.</p>
              <Link to="/shop" className="btn-primary" style={{ marginTop: '2rem' }}><span>All Collections</span></Link>
            </div>
            <div className="collections-strip__list">
              {['The Heirloom Protocol', 'The Crimson Covenant', 'The Obsidian Decree', 'Celestial Conquest', 'Sovereign Blooms'].map((c, i) => (
                <Link key={c} to={`/collections/${c.toLowerCase().replace(/\s+/g, '-')}`} className="collection-row">
                  <span className="collection-row__num">0{i + 1}</span>
                  <span className="collection-row__name">{c}</span>
                  <span className="collection-row__arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Inner Circle CTA ────────────────────────────────── */}
      <section className="inner-circle-cta">
        <div className="inner-circle-cta__bg">
          <img src="https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=1600" alt="luxury background" />
          <div className="inner-circle-cta__overlay" />
        </div>
        <motion.div
          className="inner-circle-cta__content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <span className="eyebrow-text" style={{ color: 'var(--gold)' }}>Exclusive Membership</span>
          <h2 style={{ color: 'var(--pearl)' }}>Enter<br /><em>The Inner Circle</em></h2>
          <p style={{ color: 'rgba(248,245,242,0.7)', maxWidth: '500px', margin: '1rem auto 2rem' }}>
            Your Legacy Log. Your curated wishlist. Early access to new decrees. Join the Inner Circle and experience Sovranty as it was meant to be experienced.
          </p>
          <Link to="/inner-circle/join" className="btn-primary" style={{ borderColor: 'var(--gold)', background: 'transparent', color: 'var(--gold)' }}>
            <span>Request Membership</span>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}