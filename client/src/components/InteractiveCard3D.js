import React, { useRef, useState, useCallback } from 'react';

const InteractiveCard3D = ({ 
  children, 
  className = '', 
  perspective = 1000,
  maxTilt = 15,
  scaleOnHover = 1.05,
  shadowIntensity = 0.3,
  resetDuration = 600,
  ...props 
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    shadow: 0
  });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position relative to center
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;
    
    // Calculate shadow offset (subtle effect)
    const shadowX = (mouseX / (rect.width / 2)) * 10;
    const shadowY = (mouseY / (rect.height / 2)) * 10;
    
    setTransform({
      rotateX,
      rotateY,
      scale: scaleOnHover,
      shadow: shadowIntensity,
      shadowX,
      shadowY
    });
  }, [maxTilt, scaleOnHover, shadowIntensity]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    // Smooth reset to original position
    setTimeout(() => {
      setTransform({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        shadow: 0,
        shadowX: 0,
        shadowY: 0
      });
    }, 50); // Small delay for smooth transition
  }, []);

  const cardStyle = {
    transform: `
      perspective(${perspective}px) 
      rotateX(${transform.rotateX}deg) 
      rotateY(${transform.rotateY}deg) 
      scale(${transform.scale})
    `,
    transformStyle: 'preserve-3d',
    transition: isHovered 
      ? 'transform 0.1s ease-out' 
      : `transform ${resetDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
    boxShadow: isHovered 
      ? `
        ${transform.shadowX}px ${transform.shadowY}px 30px rgba(0, 0, 0, ${transform.shadow}),
        ${transform.shadowX * 0.5}px ${transform.shadowY * 0.5}px 15px rgba(0, 0, 0, ${transform.shadow * 0.5})
      `
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    transitionProperty: isHovered 
      ? 'transform' 
      : 'transform, box-shadow',
    transitionDuration: isHovered ? '0.1s' : `${resetDuration}ms`,
    transitionTimingFunction: isHovered 
      ? 'ease-out' 
      : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };

  return (
    <div
      ref={cardRef}
      className={`interactive-card-3d ${className}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export default InteractiveCard3D;
