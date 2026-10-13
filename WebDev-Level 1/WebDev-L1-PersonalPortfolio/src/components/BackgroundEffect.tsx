import React, { useEffect, useRef } from 'react';

/**
 * Lightweight ambient background.
 * - Glows use radial-gradients (no huge CSS blur filters, which are very GPU heavy).
 * - Cursor spotlight moves via a ref + transform (no React re-render, no idle rAF loop).
 */
export const BackgroundEffect: React.FC = () => {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = spotRef.current;
    if (isTouch || reduce || !el) return;

    let targetX = -500, targetY = -500, x = -500, y = -500;
    let raf: number | null = null;

    const tick = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null; // stop looping when the spotlight has caught up
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.opacity = '1';
      if (raf === null) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const glow = (color: string) => ({
    background: `radial-gradient(circle at center, ${color} 0%, transparent 65%)`,
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#07050D]" />

      {/* Drifting ambient glows (gradients + transform-only animation = smooth and cheap) */}
      <div className="absolute top-[-20%] left-[0%] w-[800px] h-[800px] rounded-full animate-aurora will-change-transform" style={glow('rgba(88,28,135,0.32)')} />
      <div className="absolute top-[25%] right-[-15%] w-[900px] h-[900px] rounded-full animate-float-slow will-change-transform" style={glow('rgba(49,46,129,0.28)')} />
      <div className="absolute bottom-[5%] left-[-20%] w-[850px] h-[850px] rounded-full animate-float-reverse will-change-transform" style={glow('rgba(76,29,149,0.30)')} />
      <div className="absolute bottom-[-20%] right-[10%] w-[750px] h-[750px] rounded-full animate-pulse-glow will-change-transform" style={glow('rgba(112,26,117,0.25)')} />

      <div className="absolute inset-0 bg-tech-grid opacity-70" />

      {/* Cursor spotlight (desktop only) */}
      <div
        ref={spotRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full will-change-transform opacity-0 transition-opacity duration-500"
        style={glow('rgba(124,58,237,0.16)')}
      />

      {/* Floating ambient sparks */}
      <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" style={{ animationDuration: '3.5s' }} />
      <div className="absolute top-[28%] right-[18%] w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" style={{ animationDuration: '4.8s', animationDelay: '1.2s' }} />
      <div className="absolute top-[82%] right-[12%] w-2 h-2 rounded-full bg-fuchsia-300 shadow-[0_0_9px_rgba(217,70,239,0.8)] animate-pulse" style={{ animationDuration: '4.2s', animationDelay: '0.8s' }} />
      <div className="absolute top-[60%] left-[6%] w-1.5 h-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse" style={{ animationDuration: '5.2s', animationDelay: '2.4s' }} />
      <div className="absolute top-[48%] left-[22%] w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)] animate-ping" style={{ animationDuration: '6s', animationDelay: '3s' }} />
    </div>
  );
};
