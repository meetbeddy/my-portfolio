import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * Uses the same clip-path: circle() technique as PageHeader —
 * a top overlay layer clipped to a circle that follows the cursor,
 * revealing a slightly illuminated version of whatever is underneath.
 *
 * Three layers (matching PageHeader's .bottom / .top pattern):
 *  1. CursorCircle  — full-viewport overlay, clipped to circle at cursor pos
 *  2. Dot           — crisp 6px red dot pinned exactly to cursor
 */

const CursorCircle = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9997;
  /* Subtle warm highlight — mirrors the PageHeader white layer logic */
  background: rgba(255, 255, 255, 0.035);
  /* clip-path is driven by CSS custom props, updated in rAF */
  clip-path: circle(140px at var(--cx, -300px) var(--cy, -300px));
  will-change: clip-path;
  opacity: 0;
  transition: opacity 0.4s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* A second, smaller tighter clip for the inner bright ring edge */
const CursorRing = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  /* Slightly brighter at the very edge closest to cursor center */
  background: radial-gradient(
    circle 140px at var(--cx, -300px) var(--cy, -300px),
    transparent 60%,
    rgba(224, 72, 72, 0.12) 80%,
    rgba(224, 72, 72, 0.04) 100%
  );
  clip-path: circle(140px at var(--cx, -300px) var(--cy, -300px));
  will-change: clip-path;
  opacity: 0;
  transition: opacity 0.4s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Dot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  background: #e04848;
  will-change: transform;
  opacity: 0;
  transition: opacity 0.3s ease, width 0.15s ease, height 0.15s ease;
  box-shadow: 0 0 8px rgba(224, 72, 72, 0.8);

  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorGlow = () => {
  const circleRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef({ x: -300, y: -300 });
  const smoothRef = useRef({ x: -300, y: -300 });

  useEffect(() => {
    let visible = false;

    const show = () => {
      if (!visible) {
        visible = true;
        circleRef.current && (circleRef.current.style.opacity = '1');
        ringRef.current && (ringRef.current.style.opacity = '1');
        dotRef.current && (dotRef.current.style.opacity = '1');
      }
    };

    const hide = () => {
      visible = false;
      circleRef.current && (circleRef.current.style.opacity = '0');
      ringRef.current && (ringRef.current.style.opacity = '0');
      dotRef.current && (dotRef.current.style.opacity = '0');
    };

    const onMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      show();
    };

    // Expand dot on interactive elements
    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        if (dotRef.current) {
          dotRef.current.style.width = '10px';
          dotRef.current.style.height = '10px';
        }
      }
    };

    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
        if (dotRef.current) {
          dotRef.current.style.width = '6px';
          dotRef.current.style.height = '6px';
        }
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);

    const animate = () => {
      // The circle spotlight trails the cursor slightly (0.12 lerp)
      // making it feel like it "drags" — just like the PageHeader auto-animation
      smoothRef.current.x += (posRef.current.x - smoothRef.current.x) * 0.12;
      smoothRef.current.y += (posRef.current.y - smoothRef.current.y) * 0.12;

      const sx = smoothRef.current.x;
      const sy = smoothRef.current.y;

      // Update CSS custom properties on the elements — browser handles GPU compositing
      if (circleRef.current) {
        circleRef.current.style.setProperty('--cx', `${sx}px`);
        circleRef.current.style.setProperty('--cy', `${sy}px`);
      }
      if (ringRef.current) {
        ringRef.current.style.setProperty('--cx', `${sx}px`);
        ringRef.current.style.setProperty('--cy', `${sy}px`);
      }

      // Dot snaps to exact cursor (no lag — you need to know where you're clicking)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x - 3}px, ${posRef.current.y - 3}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <CursorCircle ref={circleRef} />
      <CursorRing ref={ringRef} />
      <Dot ref={dotRef} />
    </>
  );
};

export default CursorGlow;
