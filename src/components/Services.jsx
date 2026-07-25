import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTshirt, FaPen, FaSuitcase } from 'react-icons/fa';
import { HiCheck, HiArrowRight } from 'react-icons/hi2';
import ScrollReveal, { ScrollRevealItem } from './ScrollReveal';
import { serviceCategories, printingMethods, tshirtDetails, methodImages, productImages } from '../data/products';
import './Services.css';

const categoryIcons = {
  tshirts: FaTshirt,
  stationery: FaPen,
  bags: FaSuitcase,
};

export default function Services() {
  const [activeTab, setActiveTab] = useState('tshirts');
  const activeCategory = serviceCategories.find((c) => c.id === activeTab);

  return (
    <section className="services" id="services">
      <div className="container">
        <ScrollReveal>
          <div className="services__header">
            <span className="section-label">What We Do</span>
            <h2 className="section-title">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="section-subtitle">
              From custom apparel to corporate essentials — everything you need to make your brand unforgettable.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal delay={0.2}>
          <div className="services__tabs">
            {serviceCategories.map((cat) => {
              const Icon = categoryIcons[cat.id];
              return (
                <button
                  key={cat.id}
                  className={`services__tab ${activeTab === cat.id ? 'services__tab--active' : ''}`}
                  onClick={() => setActiveTab(cat.id)}
                >
                  <Icon />
                  <span>{cat.title}</span>
                  {activeTab === cat.id && (
                    <motion.div
                      className="services__tab-indicator"
                      layoutId="tab-indicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active Category Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="services__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'tshirts' ? (
              <TShirtShowcase />
            ) : (
              <GenericShowcase category={activeCategory} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function TShirtShowcase() {
  return (
    <div className="tshirt-showcase">
      <div className="tshirt-showcase__hero glass">
        <div className="tshirt-showcase__info">
          <span className="tshirt-showcase__badge">★ Most Popular</span>
          <h3 className="tshirt-showcase__title">Custom T-Shirt Printing</h3>
          <p className="tshirt-showcase__desc">
            From college club merch to corporate team wear — premium custom t-shirts
            starting at just <strong>₹130</strong>. Choose your fabric, pick your method,
            and let us bring your design to life.
          </p>
          <div className="tshirt-showcase__meta">
            <div className="tshirt-showcase__meta-item">
              <span className="tshirt-showcase__meta-label">Materials</span>
              <div className="tshirt-showcase__pills">
                {tshirtDetails.materials.map((m) => (
                  <span key={m} className="tshirt-showcase__pill">{m}</span>
                ))}
              </div>
            </div>
            <div className="tshirt-showcase__meta-item">
              <span className="tshirt-showcase__meta-label">Sizes</span>
              <div className="tshirt-showcase__pills">
                {tshirtDetails.sizes.map((s) => (
                  <span key={s} className="tshirt-showcase__pill tshirt-showcase__pill--sm">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <a href="#order" className="btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }}>
            Order Now <HiArrowRight />
          </a>
        </div>
        <div className="tshirt-showcase__price-badge">
          <span className="tshirt-showcase__price-from">Starting at</span>
          <span className="tshirt-showcase__price gradient-text">₹130</span>
          <span className="tshirt-showcase__price-per">per piece</span>
        </div>
      </div>

      {/* Printing Methods WITH IMAGES */}
      <div className="tshirt-showcase__methods">
        <h4 className="tshirt-showcase__methods-title">Printing Methods</h4>
        <div className="tshirt-showcase__methods-grid">
          {printingMethods.map((method, i) => (
            <motion.a
              key={method.name}
              href="#order"
              className="method-card glass"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'block' }}
            >
              <div className="method-card__image-wrap">
                <img
                  src={methodImages[method.name]}
                  alt={method.name}
                  className="method-card__image"
                  loading="lazy"
                />
                <div className="method-card__image-overlay" />
                <div className="method-card__click-hint">Click to order</div>
              </div>
              <div className="method-card__content">
                <div className="method-card__number">{String(i + 1).padStart(2, '0')}</div>
                <h5 className="method-card__name">{method.name}</h5>
                <p className="method-card__desc">{method.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="tshirt-showcase__usecases">
        <h4 className="tshirt-showcase__methods-title">Perfect For</h4>
        <div className="tshirt-showcase__usecases-grid">
          {tshirtDetails.useCases.map((uc, i) => (
            <motion.div
              key={uc}
              className="usecase-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <HiCheck className="usecase-tag__icon" />
              <span>{uc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GenericShowcase({ category }) {
  if (!category) return null;

  return (
    <div className="generic-showcase">
      <div className="generic-showcase__header glass">
        <h3 className="generic-showcase__title">{category.tagline}</h3>
        <p className="generic-showcase__desc">{category.description}</p>
        <a href="#order" className="btn-primary" style={{ marginTop: '1.5rem', width: 'fit-content' }}>
          Get a Quote <HiArrowRight />
        </a>
      </div>
      <div className="generic-showcase__grid">
        {category.items.map((item, i) => {
          const name = typeof item === 'string' ? item : item.name;
          const imgSrc = productImages[name];
          return (
            <motion.a
              key={name}
              href="#order"
              className="generic-item glass"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {imgSrc && (
                <div className="generic-item__image-wrap">
                  <img
                    src={imgSrc}
                    alt={name}
                    className="generic-item__image"
                    loading="lazy"
                  />
                  <div className="generic-item__image-overlay" />
                  <div className="method-card__click-hint">Click to order</div>
                </div>
              )}
              <div className="generic-item__info">
                <div className="generic-item__dot" />
                <span className="generic-item__name">{name}</span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
