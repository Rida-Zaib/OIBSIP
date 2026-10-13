import { Variants } from 'framer-motion';

/**
 * Universal Motion System for Rida Zaib Portfolio
 * Standardizes professional cubic-bezier easing: [0.22, 1, 0.36, 1]
 */
export const EASING_BEZIER = [0.22, 1, 0.36, 1] as const;

export const TRANSITION_SMOOTH = {
  duration: 0.8,
  ease: EASING_BEZIER,
};

export const TRANSITION_FAST = {
  duration: 0.35,
  ease: EASING_BEZIER,
};

export const motionVariants: Record<string, Variants> = {
  // Fade In Up
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASING_BEZIER },
    },
  },

  // Simple Clean Fade In
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: EASING_BEZIER },
    },
  },

  // Scale In / Pop In
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: EASING_BEZIER },
    },
  },

  // Slide Left
  slideLeft: {
    hidden: { opacity: 0, x: -45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.85, ease: EASING_BEZIER },
    },
  },

  // Slide Right
  slideRight: {
    hidden: { opacity: 0, x: 45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.85, ease: EASING_BEZIER },
    },
  },

  // Stagger Container
  staggerChildren: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  },

  // Alias for stagger
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },

  // Fast Stagger Container
  staggerFast: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },

  // Card Reveal with 3D depth pop
  cardReveal: {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.65, ease: EASING_BEZIER },
    },
  },

  // Alternating project card reveals
  projectSlideLeft: {
    hidden: { opacity: 0, x: -60, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASING_BEZIER },
    },
  },

  projectSlideRight: {
    hidden: { opacity: 0, x: 60, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASING_BEZIER },
    },
  },

  // Education Timeline Drawing
  timelineDraw: {
    hidden: { scaleY: 0, originY: 0 },
    visible: {
      scaleY: 1,
      originY: 0,
      transition: { duration: 1.2, ease: EASING_BEZIER },
    },
  },

  // SVG Connection Path Drawing
  drawPath: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.4, ease: EASING_BEZIER },
    },
  },

  // Scene Transition for Hero Scenes
  sceneTransition: {
    initial: { opacity: 0, scale: 0.95, y: 15 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASING_BEZIER },
    },
    exit: {
      opacity: 0,
      scale: 1.03,
      y: -15,
      transition: { duration: 0.6, ease: EASING_BEZIER },
    },
  },

  // Character Idle Breathing / Floating
  characterIdle: {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 0.8, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Technology Badge Orbit Floating
  floating: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  floatingSlow: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  floatingReverse: {
    animate: {
      y: [0, 8, 0],
      transition: {
        duration: 5.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Contact Glow Expansion
  expandGlow: {
    hidden: { scale: 0.7, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: EASING_BEZIER },
    },
  },

  // Pulse Glow
  pulseGlow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(168, 85, 247, 0.2)',
        '0 0 40px rgba(168, 85, 247, 0.5)',
        '0 0 20px rgba(168, 85, 247, 0.2)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
};
