import React, { useState, useRef, ReactNode, MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxRotation?: number; // max tilt angle in degrees
  perspective?: number; // CSS perspective
  spotlight?: boolean; // whether to show mouse spotlight glow
  spotlightColor?: string;
  scaleOnHover?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxRotation = 8,
  perspective = 1000,
  spotlight = true,
  spotlightColor = 'rgba(168, 85, 247, 0.18)',
  scaleOnHover = 1.02,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized position from -0.5 to 0.5
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    setRotateX(-y * maxRotation * 2);
    setRotateY(x * maxRotation * 2);

    // Spotlight percentage position
    setSpotlightPos({
      x: ((e.clientX - rect.left) / width) * 100,
      y: ((e.clientY - rect.top) / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      className={`relative transition-transform duration-300 ease-out ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic Interactive Spotlight Glow */}
        {spotlight && isHovered && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 -z-0 overflow-hidden"
            style={{
              background: `radial-gradient(circle 280px at ${spotlightPos.x}% ${spotlightPos.y}%, ${spotlightColor}, transparent 80%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};
