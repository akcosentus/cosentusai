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

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate dots on resize
      generateDots();
    };

    // Generate polka dots grid
    const generateDots = () => {
      dotsRef.current = [];
      const spacing = 35; // Space between dots (closer together)
      const dotRadius = 3; // Dot size (smaller)
      
      for (let x = spacing; x < canvas.width; x += spacing) {
        for (let y = spacing; y < canvas.height; y += spacing) {
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

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
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
        const wasHovered = dot.isHovered;
        dot.isHovered = distance < hoverRadius;
        
        // Smooth transition to target
        if (dot.hoverProgress < targetProgress) {
          const oldProgress = dot.hoverProgress;
          dot.hoverProgress = Math.min(targetProgress, dot.hoverProgress + 0.15);
          
          // Pop up animation when transitioning to blue (not grey dots)
          if (oldProgress < 0.1 && dot.hoverProgress > 0.1) {
            dot.scale = 1.4; // Subtle pop (was 2.5)
          }
        } else {
          dot.hoverProgress = Math.max(targetProgress, dot.hoverProgress - 0.08);
        }

        // Animate scale back down
        if (dot.scale > 1) {
          dot.scale = Math.max(1, dot.scale - 0.12); // Smooth return to normal
        }
        
        // Scale should be tied to color intensity for blue dots
        if (dot.hoverProgress > 0.3) {
          const scaleBoost = 1 + (dot.hoverProgress * 0.15); // Max 1.15x at full blue
          if (dot.scale < scaleBoost) {
            dot.scale = Math.min(scaleBoost, dot.scale + 0.05);
          }
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

