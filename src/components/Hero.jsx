import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';
import TShirtScene from './TShirtScene';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__bg-gradient" />

      <div className="hero__inner container">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <HiSparkles />
            <span>Premium Printing Solutions</span>
          </motion.div>

          <h1 className="hero__title">
            <span className="hero__title-line">
              {'INK'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  className="hero__letter"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                >
                  {letter}
                </motion.span>
              ))}
              <motion.span
                className="hero__letter hero__amp gradient-text"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              >
                {' & '}
              </motion.span>
              {'IMPACT'.split('').map((letter, i) => (
                <motion.span
                  key={`i-${i}`}
                  className="hero__letter"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.06, duration: 0.5 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Your One-Stop Printing & Promotional Solution. Custom T-shirts, corporate
            stationery & branded bags — crafted for impact.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <a href="#services" className="btn-primary hero__btn">
              Explore Services
              <HiArrowRight />
            </a>
            <a href="#order" className="btn-secondary hero__btn">
              Place an Order
            </a>
          </motion.div>

          <motion.div
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
          >
            <div className="hero__stat">
              <span className="hero__stat-number gradient-text">₹130</span>
              <span className="hero__stat-label">Starting Price</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number gradient-text">5+</span>
              <span className="hero__stat-label">Print Methods</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number gradient-text">S–XXL</span>
              <span className="hero__stat-label">All Sizes</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__3d"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__3d-glow" />
          <Suspense fallback={
            <div className="hero__3d-fallback">
              <div className="hero__3d-spinner" />
            </div>
          }>
            <TShirtScene />
          </Suspense>
        </motion.div>
      </div>

      <div className="hero__scroll-indicator">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="hero__scroll-line" />
        </motion.div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
