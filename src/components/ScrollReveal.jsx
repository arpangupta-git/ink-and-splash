import { motion } from 'framer-motion';

const defaultVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function ScrollReveal({
  children,
  variants = defaultVariants,
  stagger = false,
  className = '',
  delay = 0,
  ...props
}) {
  const finalVariants = stagger ? staggerContainer : {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={finalVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({ children, className = '', ...props }) {
  return (
    <motion.div
      className={className}
      variants={defaultVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
