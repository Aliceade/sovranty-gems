import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-mark">✦</span>
            <span>Sovranty Gems</span>
          </div>
          <p className="footer__tagline">
            "Power is not given.<br />It is adorned."
          </p>
          <div className="footer__socials">
            {['Instagram', 'Pinterest', 'WhatsApp'].map(s => (
              <a key={s} href="#" className="social-link">{s}</a>
            ))}
          </div>
        </div>

        <div className="footer__nav">
          <div className="footer__col">
            <h4>The Vault</h4>
            <Link to="/shop">All Pieces</Link>
            <Link to="/shop?intent=Power">Power</Link>
            <Link to="/shop?intent=Romance">Romance</Link>
            <Link to="/shop?intent=Legacy">Legacy</Link>
            <Link to="/shop?intent=Devotion">Devotion</Link>
          </div>
          <div className="footer__col">
            <h4>Collections</h4>
            <Link to="/collections/heirloom-protocol">The Heirloom Protocol</Link>
            <Link to="/collections/crimson-covenant">The Crimson Covenant</Link>
            <Link to="/collections/obsidian-decree">The Obsidian Decree</Link>
            <Link to="/collections/celestial-conquest">Celestial Conquest</Link>
          </div>
          <div className="footer__col">
            <h4>The Inner Circle</h4>
            <Link to="/inner-circle">My Dashboard</Link>
            <Link to="/inner-circle/login">Sign In</Link>
            <Link to="/inner-circle/join">Join</Link>
            <a href="mailto:vault@sovrantygems.com">Contact the Atelier</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Sovranty Gems. All acquisitions final.</p>
        <div className="footer__legal">
          <a href="#">Privacy Decree</a>
          <a href="#">Terms of Sovereignty</a>
        </div>
      </div>
    </footer>
  );
}