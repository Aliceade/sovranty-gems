import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const INTENTS = ['Power', 'Romance', 'Legacy', 'Devotion', 'Rebellion'];
const CATEGORIES = ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Brooches', 'Sets'];
const COLLECTIONS = ['The Heirloom Protocol', 'Sovereign Blooms', 'The Obsidian Decree', 'Celestial Conquest', 'The Crimson Covenant'];
const SORTS = [
  { label: 'Newest Decree', value: 'newest' },
  { label: 'Price: Ascending', value: 'price_asc' },
  { label: 'Price: Descending', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
];

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="12" x2="8" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/><circle cx="19" cy="6" r="3"/><circle cx="11" cy="12" r="3"/>
  </svg>
);

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    intent: searchParams.get('intent') || '',
    category: '',
    collection: '',
    sort: 'newest',
    page: 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val === f[key] ? '' : val, page: 1 }));
  const clearFilters = () => setFilters({ keyword: '', intent: '', category: '', collection: '', sort: 'newest', page: 1 });
  const hasFilters = filters.intent || filters.category || filters.collection || filters.keyword;

  return (
    <main className="shop-page">
      {/* Header */}
      <section className="shop-header">
        <div className="shop-header__content container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="eyebrow-text">The Vault</span>
            <h1>All <em>Pieces</em></h1>
            {filters.intent && <p className="shop-header__filter-label">Filtered by Intent: <strong>{filters.intent}</strong></p>}
            {filters.keyword && <p className="shop-header__filter-label">Searching for: <strong>"{filters.keyword}"</strong></p>}
          </motion.div>
        </div>
      </section>

      <div className="shop-body container">
        {/* Toolbar */}
        <div className="shop-toolbar">
          <div className="shop-toolbar__left">
            <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
              <FilterIcon />
              <span>Refine</span>
              {hasFilters && <span className="filter-dot" />}
            </button>
            <span className="shop-count">{total} Pieces</span>
            {hasFilters && (
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            )}
          </div>
          <div className="shop-toolbar__right">
            <select
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
              className="sort-select"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              className="filter-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="filter-panel__inner">
                <FilterGroup label="Shop by Intent" items={INTENTS} active={filters.intent} onSelect={v => setFilter('intent', v)} />
                <FilterGroup label="Category" items={CATEGORIES} active={filters.category} onSelect={v => setFilter('category', v)} />
                <div className="filter-group">
                  <h4 className="filter-group__label">Collection</h4>
                  <div className="filter-chips">
                    {COLLECTIONS.map(c => (
                      <button
                        key={c}
                        className={`filter-chip filter-chip--wide ${filters.collection === c ? 'active' : ''}`}
                        onClick={() => setFilter('collection', c)}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Intent Quick Filters */}
        <div className="intent-pills">
          {INTENTS.map(intent => (
            <button
              key={intent}
              className={`intent-pill ${filters.intent === intent ? 'active' : ''}`}
              onClick={() => setFilter('intent', intent)}
            >{intent}</button>
          ))}
        </div>

        {/* Products Masonry Grid */}
        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="no-results">
            <span>✦</span>
            <p>No pieces match your refinement. The Vault holds more.</p>
            <button onClick={clearFilters} className="btn-ghost">Clear Filters</button>
          </div>
        ) : (
          <div className="masonry-grid">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                className={`masonry-item ${getMasonryClass(i)}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.5) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`page-btn ${filters.page === p ? 'active' : ''}`}
                onClick={() => setFilters(f => ({ ...f, page: p }))}
              >{p}</button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterGroup({ label, items, active, onSelect }) {
  return (
    <div className="filter-group">
      <h4 className="filter-group__label">{label}</h4>
      <div className="filter-chips">
        {items.map(item => (
          <button
            key={item}
            className={`filter-chip ${active === item ? 'active' : ''}`}
            onClick={() => onSelect(item)}
          >{item}</button>
        ))}
      </div>
    </div>
  );
}

function getMasonryClass(i) {
  // Create asymmetric pattern
  const pattern = [0, 2, 0, 1, 2, 0, 1, 0, 2, 1];
  const p = pattern[i % pattern.length];
  return p === 0 ? 'masonry-item--tall' : p === 1 ? 'masonry-item--short' : '';
}