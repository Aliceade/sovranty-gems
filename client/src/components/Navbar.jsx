import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const SearchIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
const UserIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const BagIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
const MenuIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const CloseIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

function SearchPanel({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`); onClose(); }
  };
  return (
    <div className="search-panel" onClick={e => e.stopPropagation()}>
      <span className="search-panel__eyebrow">Search the Vault</span>
      <form onSubmit={handleSubmit} className="search-panel__form">
        <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Rubies, Emeralds, Heirloom Rings…" className="search-panel__input" />
        <button type="submit" className="search-panel__btn"><SearchIcon /></button>
      </form>
      <button className="search-panel__close" onClick={onClose}><CloseIcon /></button>
      <div className="search-panel__suggestions">
        {['Power', 'Romance', 'Legacy', 'Devotion'].map(tag => (
          <button key={tag} onClick={() => { navigate(`/shop?intent=${tag}`); onClose(); }} className="tag-pill">{tag}</button>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemsCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdown(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); setUserDropdown(false); navigate('/'); };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">✦</span>
            <span className="navbar__logo-text">Sovranty Gems</span>
          </Link>
          <ul className="navbar__links">
            <li><NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>The Vault</NavLink></li>
            <li className="has-dropdown">
              <span>Collections</span>
              <div className="nav-dropdown">
                <Link to="/collections/heirloom-protocol">The Heirloom Protocol</Link>
                <Link to="/collections/crimson-covenant">The Crimson Covenant</Link>
                <Link to="/collections/obsidian-decree">The Obsidian Decree</Link>
                <Link to="/collections/celestial-conquest">Celestial Conquest</Link>
                <Link to="/collections/sovereign-blooms">Sovereign Blooms</Link>
              </div>
            </li>
            <li><Link to="/shop?intent=Power">Power</Link></li>
            <li><Link to="/shop?intent=Romance">Romance</Link></li>
            <li><Link to="/shop?intent=Legacy">Legacy</Link></li>
          </ul>
          <div className="navbar__actions">
            <button className="navbar__action-btn" onClick={() => setSearchOpen(true)}><SearchIcon /></button>
            <div className="navbar__action-btn user-wrapper" ref={dropdownRef}>
              <button onClick={() => user ? setUserDropdown(!userDropdown) : navigate('/inner-circle/login')}><UserIcon /></button>
              {user && userDropdown && (
                <div className="user-dropdown">
                  <div className="user-dropdown__name">{user.name}</div>
                  <Link to="/inner-circle" onClick={() => setUserDropdown(false)}>The Inner Circle</Link>
                  <button onClick={handleLogout}>Depart</button>
                </div>
              )}
            </div>
            <button className="navbar__action-btn cart-btn" onClick={() => setIsCartOpen(true)}>
              <BagIcon />
              {itemsCount > 0 && <span className="cart-count">{itemsCount}</span>}
            </button>
            <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__inner">
          <nav>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>The Vault</Link>
            <Link to="/shop?intent=Power" onClick={() => setMobileOpen(false)}>Power</Link>
            <Link to="/shop?intent=Romance" onClick={() => setMobileOpen(false)}>Romance</Link>
            <Link to="/shop?intent=Legacy" onClick={() => setMobileOpen(false)}>Legacy</Link>
            {user ? (
              <><Link to="/inner-circle" onClick={() => setMobileOpen(false)}>The Inner Circle</Link><button onClick={() => { handleLogout(); setMobileOpen(false); }}>Depart</button></>
            ) : (
              <Link to="/inner-circle/login" onClick={() => setMobileOpen(false)}>Enter the Inner Circle</Link>
            )}
          </nav>
        </div>
      </div>
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <SearchPanel onClose={() => setSearchOpen(false)} />
        </div>
      )}
    </>
  );
}