import { useRef } from 'react';
import { useInView, Variants } from 'framer-motion';

export type AnimationType =
  | 'fade-in-up' | 'slide-in-left' | 'slide-in-right' | 'slide-in-down' | 'zoom-in'
  // Character animations (each one suits a different kind of content)
  | 'blur-in'      // soft focus pull: statements, paragraphs
  | 'wipe-right'   // text revealed left -> right: headlines
  | 'clip-up'      // rises out of a mask: titles / images
  | 'pop'          // springy scale-in: badges, stats, small cards
  | 'drop-in'      // falls in with a bounce: pills, filter bars
  | 'flip-up'      // tilts up in 3D like a card being turned: project / info cards
  | 'rise-3d'      // big panels lift into place with depth
  | 'swing-left'   // sweeps in from the left with a slight turn
  | 'swing-right'; // sweeps in from the right with a slight turn

const E = [0.16, 1, 0.3, 1] as const;

// Clipped elements are (partly) invisible to IntersectionObserver, so they trigger on ANY overlap.
export const CLIP_ANIMATIONS: AnimationType[] = ['wipe-right', 'clip-up'];

export interface UseScrollAnimationOptions {
  once?: boolean;
  amount?: number | 'some' | 'all';
  margin?: string;
  delay?: number;
  duration?: number;
}

export const motionVariants: Record<AnimationType, Variants> = {
  'fade-in-up': {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  'slide-in-left': {
    hidden: { opacity: 0, x: -36 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  'slide-in-right': {
    hidden: { opacity: 0, x: 36 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  'slide-in-down': {
    hidden: { opacity: 0, y: -28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  'blur-in': {
    hidden: { opacity: 0, y: 18, filter: 'blur(14px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.95, ease: E } },
  },
  'wipe-right': {
    hidden: { opacity: 0, x: -14, clipPath: 'inset(-25% 88% -25% -5%)' },
    visible: { opacity: 1, x: 0, clipPath: 'inset(-25% -5% -25% -5%)', transition: { duration: 0.95, ease: E } },
  },
  'clip-up': {
    hidden: { opacity: 0, y: 26, clipPath: 'inset(88% -5% -25% -5%)' },
    visible: { opacity: 1, y: 0, clipPath: 'inset(-25% -5% -25% -5%)', transition: { duration: 0.9, ease: E } },
  },
  'pop': {
    hidden: { opacity: 0, scale: 0.6, y: 22 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 17, mass: 0.9 } },
  },
  'drop-in': {
    hidden: { opacity: 0, y: -36, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 210, damping: 15 } },
  },
  'flip-up': {
    hidden: { opacity: 0, y: 46, rotateX: -50, transformPerspective: 900 },
    visible: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900, transition: { duration: 0.95, ease: E } },
  },
  'rise-3d': {
    hidden: { opacity: 0, y: 72, rotateX: 12, scale: 0.94, transformPerspective: 1300 },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transformPerspective: 1300, transition: { duration: 1.05, ease: E } },
  },
  'swing-left': {
    hidden: { opacity: 0, x: -90, rotateY: 14, transformPerspective: 1100 },
    visible: { opacity: 1, x: 0, rotateY: 0, transformPerspective: 1100, transition: { duration: 0.95, ease: E } },
  },
  'swing-right': {
    hidden: { opacity: 0, x: 90, rotateY: -14, transformPerspective: 1100 },
    visible: { opacity: 1, x: 0, rotateY: 0, transformPerspective: 1100, transition: { duration: 0.95, ease: E } },
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
};

/**
 * Custom Framer Motion Observer Hook
 * Observes element intersection and triggers smooth reveal animations
 * strictly once when entering viewport.
 */
export function useScrollAnimation(options?: UseScrollAnimationOptions) {
  const ref = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(ref, {
    once: options?.once ?? true, // Ensures animation only triggers once
    amount: options?.amount ?? 0.15,
    margin: (options?.margin as any) ?? '0px 0px -60px 0px',
  });

  return { ref, isInView };
}
