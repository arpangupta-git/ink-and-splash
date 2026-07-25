import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaPrint } from 'react-icons/fa';
import './Navbar.css';

const navLinks = [
  { label: 'Services', id: 'services' },
  { label: 'Order', id: 'order' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar__inner container">
        <a href="#!" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="navbar__logo">
          <FaPrint className="navbar__logo-icon" />
          <span className="navbar__logo-text">
            INK <span className="navbar__logo-amp">&</span> IMPACT
          </span>
        </a>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <a key={link.id} href="#!" onClick={(e) => scrollToSection(e, link.id)} className="navbar__link">
              {link.label}
            </a>
          ))}
          <a href="#!" onClick={(e) => scrollToSection(e, 'order')} className="btn-primary navbar__cta">
            Get a Quote
          </a>
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="navbar__mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="navbar__mobile-header">
                <span className="navbar__logo-text">
                  INK <span className="navbar__logo-amp">&</span> IMPACT
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <HiX />
                </button>
              </div>
              <div className="navbar__mobile-links">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href="#!"
                    className="navbar__mobile-link"
                    onClick={(e) => scrollToSection(e, link.id)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href="#!"
                  className="btn-primary navbar__mobile-cta"
                  onClick={(e) => scrollToSection(e, 'order')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Get a Quote
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
