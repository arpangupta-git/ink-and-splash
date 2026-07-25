import { motion } from 'framer-motion';
import './ProductCard.css';

export default function ProductCard({ title, icon: Icon, index = 0, onClick }) {
  return (
    <motion.div
      className="product-card glass"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="product-card__icon-wrap">
        {Icon && <Icon className="product-card__icon" />}
      </div>
      <span className="product-card__title">{title}</span>
      <div className="product-card__glow" />
    </motion.div>
  );
}
