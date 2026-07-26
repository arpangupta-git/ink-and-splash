import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Faster tracking for the ambient glow
  const glowX = useSpring(0, { stiffness: 800, damping: 40 });
  const glowY = useSpring(0, { stiffness: 800, damping: 40 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      glowX.set(e.clientX - 125); // Center of 250px glow orb
      glowY.set(e.clientY - 125);
    };

    window.addEventListener('mousemove', updateMousePosition);

    const handleMouseOver = (e) => {
      if (e.target.closest('.hover-target, button, a, label, input, select')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [glowX, glowY]);

  // Don't render cursor on mobile devices
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="cursor-glow"
        style={{
          x: glowX,
          y: glowY,
        }}
      />
      <div
        className={`cursor-dot ${isHovering ? 'hovering' : ''}`}
        style={{
          transform: `translate3d(${mousePosition.x - (isHovering ? 25 : 5)}px, ${mousePosition.y - (isHovering ? 25 : 5)}px, 0)`
        }}
      />
    </>
  );
}
