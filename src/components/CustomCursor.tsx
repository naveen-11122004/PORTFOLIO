import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ThemeStyle } from '../types';

interface CustomCursorProps {
  activeTheme: ThemeStyle;
}

export default function CustomCursor({ activeTheme }: CustomCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMouse, setHasMouse] = useState(false);

  // Core coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth ring lag
  const springConfig = { stiffness: 220, damping: 24, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect precise pointing device (mouse/trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasMouse(mediaQuery.matches);
    setIsVisible(mediaQuery.matches);

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setHasMouse(e.matches);
      setIsVisible(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    const handleMouseMove = (e: MouseEvent) => {
      // Offset positions so elements are centered around pointer
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible && hasMouse) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      if (hasMouse) setIsVisible(true);
    };

    // Find all hoverable elements and bind listeners
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if hovering over buttons, links, inputs, or items with custom click classes
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('a') !== null || 
        target.closest('button') !== null || 
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer');

      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, hasMouse, isVisible]);

  if (!hasMouse || !isVisible) return null;

  // Theme-specific colors
  const themeColors = {
    bold: { dot: '#ff4e00', ring: '#ff4e00', border: 'rgba(255, 78, 0, 0.4)' },
    cyberpunk: { dot: '#ec4899', ring: '#06b6d4', border: 'rgba(6, 182, 212, 0.4)' },
    terminal: { dot: '#22c55e', ring: '#22c55e', border: 'rgba(34, 197, 94, 0.4)' },
    minimalist: { dot: '#0f172a', ring: '#0f172a', border: 'rgba(15, 23, 42, 0.4)' },
    nordic: { dot: '#38bdf8', ring: '#0284c7', border: 'rgba(2, 132, 199, 0.4)' },
    sunset: { dot: '#f59e0b', ring: '#e36940', border: 'rgba(227, 105, 64, 0.4)' },
    modern: { dot: '#a855f7', ring: '#6366f1', border: 'rgba(99, 102, 241, 0.4)' }
  };

  const colors = themeColors[activeTheme] || themeColors.modern;

  return (
    <>
      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: colors.dot,
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
        }}
        transition={{ type: 'tween', duration: 0.15 }}
      />

      {/* Lagging spring ring */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-50 border-2"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: colors.ring,
          boxShadow: isHovered ? `0 0 12px ${colors.ring}` : 'none',
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? colors.border : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ type: 'tween', duration: 0.2 }}
      />
    </>
  );
}
