import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import './CustomCursor.css';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useSpring(0, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 16); // Center of the 32px ring
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', updateMousePosition);

    const handleMouseOver = (e) => {
      if (e.target.closest('.hover-target, button, a, input, select, textarea')) {
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
  }, [cursorX, cursorY]);

  // Don't render cursor on mobile devices
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <>
      <motion.div
        className="custom-cursor-ring"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.8)',
        }}
      />
      <div
        className="custom-cursor-dot"
        style={{
          left: mousePosition.x - 4, // center of 8px dot
          top: mousePosition.y - 4,
          transform: isHovering ? 'scale(0.5)' : 'scale(1)',
        }}
      />
    </>
  );
}
