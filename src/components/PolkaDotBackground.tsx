'use client';

import { useEffect, useRef } from 'react';

export const PolkaDotBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Array<{ 
    x: number; 
    y: number; 
    isHovered: boolean; 
    hoverProgress: number;
    scale: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Set display size (css pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Scale all drawing operations by the dpr
      ctx.scale(dpr, dpr);
      
      // Regenerate dots on resize
      generateDots();
    };

    // Generate polka dots grid
    const generateDots = () => {
      dotsRef.current = [];
      const spacing = 35; // Space between dots (closer together)
      const dotRadius = 3; // Dot size (smaller)
      
      // Use display dimensions, not canvas buffer dimensions
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      
      for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
          dotsRef.current.push({
            x,
            y,
            isHovered: false,
            hoverProgress: 0,
            scale: 1,
          });
        }
      }
    };

    // Handle mouse move (account for scroll position)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { 
        x: e.clientX, 
        y: e.clientY + window.scrollY 
      };
    };

    // Animation loop
    const animate = () => {
      // Clear using display dimensions
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      
      const hoverRadius = 80; // Distance for hover effect
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      dotsRef.current.forEach((dot) => {
        // Calculate distance from mouse
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate intensity based on distance (gradient fade)
        // Closest = 1.0 (full blue), fades to 0 at hoverRadius
        let targetProgress = 0;
        if (distance < hoverRadius) {
          targetProgress = 1 - (distance / hoverRadius); // Linear fade
          targetProgress = Math.pow(targetProgress, 1.5); // Smooth curve
        }
        
        // Update hover state
        dot.isHovered = distance < hoverRadius;
        
        // Smooth transition to target with longer trail
        if (dot.hoverProgress < targetProgress) {
          dot.hoverProgress = Math.min(targetProgress, dot.hoverProgress + 0.15); // Fast fade in
        } else {
          dot.hoverProgress = Math.max(targetProgress, dot.hoverProgress - 0.02); // Slow fade out = longer trail
        }

        // Scale based on color intensity - darkest blues are bigger
        const targetScale = 1 + (dot.hoverProgress * 0.5); // 1.0 to 1.5x based on blueness
        
        if (dot.scale < targetScale) {
          dot.scale = Math.min(targetScale, dot.scale + 0.08);
        } else {
          dot.scale = Math.max(targetScale, dot.scale - 0.08);
        }

        // Interpolate color
        const lightGrey = { r: 243, g: 244, b: 246 }; // gray-100 (even lighter)
        const cosentusBlue = { r: 1, g: 178, b: 214 }; // #01B2D6
        
        const r = Math.round(lightGrey.r + (cosentusBlue.r - lightGrey.r) * dot.hoverProgress);
        const g = Math.round(lightGrey.g + (cosentusBlue.g - lightGrey.g) * dot.hoverProgress);
        const b = Math.round(lightGrey.b + (cosentusBlue.b - lightGrey.b) * dot.hoverProgress);

        // Draw dot with scale
        ctx.save();
        ctx.translate(dot.x, dot.y);
        ctx.scale(dot.scale, dot.scale);
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2); // Smaller radius
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

