import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './CollectionPage.css';

const COLLECTION_MAP = {
  'heirloom-protocol':  'The Heirloom Protocol',
  'sovereign-blooms':   'Sovereign Blooms',
  'obsidian-decree':    'The Obsidian Decree',
  'celestial-conquest': 'Celestial Conquest',
  'crimson-covenant':   'The Crimson Covenant',
};

const COLLECTION_STORIES = {
  'The Heirloom Protocol':  'Pieces designed to outlast generations. Crafted to be passed down, not merely worn.',
  'Sovereign Blooms':       'Nature distilled into devotion. Organic forms rendered in precious metal and stone.',
  'The Obsidian Decree':    'Dark stones for those who carry depth. Power expressed through shadow and mystery.',
  'Celestial Conquest':     'The cosmos captured in wearable form. For those whose ambitions reach beyond the horizon.',
  'The Crimson Covenant':   'Bold declarations in ruby and rose gold. For those who command every room they enter.',
};

export default function CollectionPage() {
  const { collection } = useParams();
  const collectionName = COLLECTION_MAP[collection] || collection;
  const story = COLLECTION_STORIES[collectionName] || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/products?collection=${encodeURIComponent(collectionName)}`)
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collectionName]);

  return (
    <main className="collection-page">
      {/* Hero */}
      <section className="collection-hero">
        <div className="collection-hero__content container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="collection-hero__eyebrow">Collection</span>
            <h1 className="collection-hero__title">{collectionName}</h1>
            {story && <p className="collection-hero__story">{story}</p>}
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <div className="collection-body container">
        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="collection-empty">
            <span>✦</span>
            <p>This collection is being curated by our atelier.</p>
            <p className="collection-empty__sub">Return soon — or explore another decree.</p>
            <Link to="/shop" className="btn-ghost" style={{ marginTop: '2rem' }}>
              Browse The Vault
            </Link>
          </div>
        ) : (
          <>
            <div className="collection-count">{products.length} pieces</div>
            <div className="collection-grid">
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}