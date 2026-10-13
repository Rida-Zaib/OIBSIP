import React, { useEffect, useRef, useState, ReactNode } from 'react';

type AllowedTag = 'div' | 'section' | 'article' | 'span' | 'header' | 'footer' | 'ul' | 'li' | 'main';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: string; // e.g. '28px'
  threshold?: number;
  rootMargin?: string;
  as?: AllowedTag;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 750,
  direction = 'up',
  distance = '28px',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  as = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const currentRef = domRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin]);

  const getTransform = () => {
    if (isVisible) return 'none';
    switch (direction) {
      case 'up':
        return `translateY(${distance})`;
      case 'down':
        return `translateY(-${distance})`;
      case 'left':
        return `translateX(${distance})`;
      case 'right':
        return `translateX(-${distance})`;
      case 'none':
      default:
        return 'none';
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
  };

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={domRef}
      style={style}
      className={`scroll-reveal-container ${isVisible ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};

export const StaggerItem: React.FC<{
  children: ReactNode;
  className?: string;
  index?: number;
  staggerMs?: number;
  baseDelay?: number;
}> = ({ children, className = '', index = 0, staggerMs = 100, baseDelay = 0 }) => {
  return (
    <ScrollReveal
      delay={baseDelay + index * staggerMs}
      duration={650}
      direction="up"
      distance="24px"
      className={className}
    >
      {children}
    </ScrollReveal>
  );
};
