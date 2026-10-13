import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring, animate } from 'framer-motion';

/** Thin gradient bar at the very top that fills as the page is scrolled. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-300 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
    />
  );
};

/**
 * Soft divider between sections: a line that draws out from the centre, then a
 * small glowing gem pops in. `tone` shifts the colour so dividers aren't identical.
 */
export const SectionDivider: React.FC<{ tone?: 'purple' | 'cyan' | 'violet' }> = ({ tone = 'purple' }) => {
  const colors = {
    purple: { line: 'via-purple-400/60', gem: 'bg-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.9)]' },
    cyan: { line: 'via-cyan-300/60', gem: 'bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]' },
    violet: { line: 'via-violet-400/60', gem: 'bg-violet-300 shadow-[0_0_14px_rgba(139,92,246,0.9)]' },
  }[tone];

  return (
    <div className="relative max-w-5xl mx-auto px-6 h-10 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-x-6 h-px bg-gradient-to-r from-transparent ${colors.line} to-transparent`}
      />
      <motion.div
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 45, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.55 }}
        className={`relative w-2 h-2 rounded-[2px] ${colors.gem}`}
      />
    </div>
  );
};

/** Number that counts up when it scrolls into view. */
export const CountUp: React.FC<{ from?: number; to: number; suffix?: string; duration?: number }> = ({
  from = 0, to, suffix = '', duration = 1.6,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
};
