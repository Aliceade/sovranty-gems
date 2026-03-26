import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { formatPrice, getCoverImage } from '../utils/helpers';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [claiming, setClaiming] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/products/slug/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        setSelectedImage(0);
        return api.get(`/products?intent=${data.intent}&pageSize=4`);
      })
      .then(({ data }) => setRelated(data.products.filter(p => p.slug !== slug)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleClaim = () => {
    if (product.countInStock === 0) return;
    setClaiming(true);
    addToCart(product, qty);
    toast.success(`"${product.name}" added to your Collection`);
    setTimeout(() => setClaiming(false), 1000);
  };

  if (loading) return <div className="spinner" style={{ marginTop: '8rem' }} />;
  if (!product) return <div className="container" style={{ paddingTop: '8rem' }}><p>Piece not found.</p></div>;

  return (
    <main className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <Link to="/shop">The Vault</Link>
        <span>/</span>
        <span>{product.collection}</span>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Main Layout */}
      <section className="product-main container">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <div className="product-gallery__zoom-wrapper">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="product-gallery__main-img"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
              {product.isExclusive && (
                <div className="product-gallery__badge">
                  <span>Exclusive</span>
                </div>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="product-gallery__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`product-gallery__thumb ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img.url} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="product-info__meta">
              <span className="product-info__collection">{product.collection}</span>
              <span className="product-info__intent">{product.intent}</span>
            </div>
            <h1 className="product-info__name">{product.name}</h1>
            <p className="product-info__tagline">{product.tagline}</p>

            <div className="product-info__pricing">
              {product.compareAtPrice && (
                <span className="compare-price">{formatPrice(product.compareAtPrice)}</span>
              )}
              <span className="current-price">{formatPrice(product.price)}</span>
            </div>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="product-info__rating">
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={s <= Math.round(product.rating) ? 'star active' : 'star'}>★</span>
                  ))}
                </div>
                <span>{product.rating.toFixed(1)} ({product.numReviews} testimonials)</span>
              </div>
            )}

            {/* Quick specs */}
            <div className="product-spec-pills">
              {product.metalType && <span className="spec-pill">{product.metalType}</span>}
              {product.stones?.map(s => (
                <span key={s.name} className="spec-pill">{s.carat}ct {s.name}</span>
              ))}
              {product.weight && <span className="spec-pill">{product.weight}</span>}
            </div>

            {/* Stock & Qty */}
            {product.countInStock > 0 ? (
              <>
                {product.countInStock <= 3 && (
                  <p className="product-info__scarcity">✦ Only {product.countInStock} piece{product.countInStock > 1 ? 's' : ''} remain in the Vault.</p>
                )}
                <div className="product-info__qty">
                  <label>Quantity</label>
                  <div className="qty-selector">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))}>+</button>
                  </div>
                </div>
              </>
            ) : (
              <p className="product-info__sold-out">This piece has been claimed. Join the waitlist.</p>
            )}

            {/* CTA */}
            <button
              className={`claim-cta ${claiming ? 'claiming' : ''} ${product.countInStock === 0 ? 'disabled' : ''}`}
              onClick={handleClaim}
              disabled={product.countInStock === 0}
            >
              <span>{claiming ? '✦ Claimed' : product.countInStock === 0 ? 'Claimed by Another' : 'Claim This Piece'}</span>
            </button>

            <button className="add-to-collection-ghost">Add to Collection</button>

            {/* Trust signals */}
            <div className="product-trust">
              {['Free Sovereign Delivery over $5,000', 'Certificate of Authenticity Included', 'Conflict-Free Certified Stones'].map(t => (
                <div key={t} className="trust-item">
                  <span className="trust-icon">✦</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="product-tabs container">
        <div className="tab-headers">
          {['story', 'details', 'testimonials'].map(tab => (
            <button
              key={tab}
              className={`tab-header ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'story' ? 'The Story' : tab === 'details' ? 'Details & Specs' : 'Testimonials'}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'story' && (
            <motion.div className="tab-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="product-story">
                <p className="story-text">{product.story}</p>
              </div>
            </motion.div>
          )}
          {activeTab === 'details' && (
            <motion.div className="tab-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="product-details">
                <table className="specs-table">
                  <tbody>
                    {product.metalType && <tr><td>Metal</td><td>{product.metalType}</td></tr>}
                    {product.weight && <tr><td>Weight</td><td>{product.weight}</td></tr>}
                    {product.dimensions && <tr><td>Dimensions</td><td>{product.dimensions}</td></tr>}
                    {product.stones?.map(s => (
                      <tr key={s.name}><td>{s.name}</td><td>{s.carat}ct{s.origin ? ` — ${s.origin}` : ''}</td></tr>
                    ))}
                    {product.materials?.map(m => (
                      <tr key={m}><td>Material</td><td>{m}</td></tr>
                    ))}
                    <tr><td>Category</td><td>{product.category}</td></tr>
                    <tr><td>Collection</td><td>{product.collection}</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          {activeTab === 'testimonials' && (
            <motion.div className="tab-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {product.reviews?.length > 0 ? (
                <div className="reviews-list">
                  {product.reviews.map(r => (
                    <div key={r._id} className="review-item">
                      <div className="review-item__header">
                        <span className="review-name">{r.name}</span>
                        <div className="stars">
                          {[1,2,3,4,5].map(s => <span key={s} className={s <= r.rating ? 'star active' : 'star'}>★</span>)}
                        </div>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews">Be the first to share your testimony with this piece.</p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section-title">
              <span className="eyebrow">You May Also Claim</span>
              <h2>From the Same <em>Intent</em></h2>
              <div className="divider" />
            </div>
            <div className="related-grid">
              {related.slice(0, 3).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}