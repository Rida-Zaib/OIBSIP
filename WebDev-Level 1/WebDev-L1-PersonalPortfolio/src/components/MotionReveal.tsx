import React, { ReactNode, useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useScrollAnimation, AnimationType, motionVariants, CLIP_ANIMATIONS } from '../hooks/useScrollAnimation';

interface MotionRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number; // overrides the variant's own duration (seconds)
  className?: string;
  amount?: number | 'some' | 'all';
  once?: boolean;
}

export const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  animation = 'fade-in-up',
  delay = 0,
  duration,
  className = '',
  amount = 0.15,
  once = true,
  ...rest
}) => {
  const { ref, isInView } = useScrollAnimation({ once, amount: CLIP_ANIMATIONS.includes(animation) ? 'some' : amount });
  const base = motionVariants[animation];
  // Merge delay/duration INTO the variant (a variant's own transition would otherwise ignore them)
  const variant = useMemo(() => {
    const visible: any = base.visible;
    return {
      hidden: base.hidden,
      visible: {
        ...visible,
        transition: { ...visible.transition, ...(duration !== undefined ? { duration } : {}), delay },
      },
    };
  }, [base, duration, delay]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variant}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const MotionStaggerContainer: React.FC<{
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  amount?: number;
}> = ({ children, className = '', staggerDelay = 0.1, amount = 0.12 }) => {
  const { ref, isInView } = useScrollAnimation({ once: true, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionStaggerItem: React.FC<{
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
}> = ({ children, className = '', animation = 'fade-in-up' }) => {
  return (
    <motion.div
      variants={motionVariants[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
};
