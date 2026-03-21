import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener('mousemove', updateMousePosition);
    
    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer')
      ) {
        handleHoverStart();
      } else {
        handleHoverEnd();
      }
    };

    document.addEventListener('mouseover', onMouseOver);

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    
    // Make sure pointer elements don't show default hands
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: none !important; }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.style.cursor = 'auto';
      document.head.removeChild(style);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: 1,
      opacity: 1,
      backgroundColor: "rgba(109, 173, 190, 0)", // transparent center
      border: "1px solid rgba(109, 173, 190, 0.4)", // teal border
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      opacity: 1,
      backgroundColor: "rgba(109, 173, 190, 0.05)", // soft teal fill
      border: "2px solid rgba(109, 173, 190, 0.8)",
      mixBlendMode: "screen"
    }
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center"
        variants={variants}
        animate={isHovered ? "hover" : "default"}
        transition={{ type: "spring", stiffness: 250, damping: 30, mass: 0.5 }}
      >
        <div className="w-full h-full rounded-full border border-dashed border-[#6dadbe]/20 animate-[spin_10s_linear_infinite]" />
      </motion.div>
      <div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#6dadbe] rounded-full pointer-events-none z-[10000] hidden md:block transition-transform duration-75 shadow-[0_0_10px_rgba(109,173,190,0.8)]"
        style={{ transform: `translate(${mousePosition.x - 3}px, ${mousePosition.y - 3}px)` }}
      />
    </>
  );
};

export default CustomCursor;
