import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--maroon-dark)', textAlign: 'center', padding: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '8rem', color: 'rgba(248,245,242,0.1)', lineHeight: 1, marginBottom: '-2rem' }}>404</div>
        <span style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '1rem' }}>Lost in the Vault</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--pearl)', lineHeight: 1.2, marginBottom: '1rem' }}>
          This piece does not<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>exist</em> in our Vault.
        </h1>
        <p style={{ color: 'rgba(248,245,242,0.5)', fontSize: '0.9rem', marginBottom: '2.5rem', maxWidth: 400, margin: '0 auto 2.5rem' }}>
          The page you're looking for may have been moved or removed. Return to the Vault.
        </p>
        <Link to="/" className="btn-primary" style={{ borderColor: 'var(--gold)', background: 'transparent', color: 'var(--gold)' }}>
          <span>Return to the Vault</span>
        </Link>
      </motion.div>
    </main>
  );
}