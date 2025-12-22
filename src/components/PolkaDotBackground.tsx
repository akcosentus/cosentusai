'use client';

import { useEffect, useRef } from 'react';

export const PolkaDotBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Array<{ x: number; y: number; isHovered: boolean; hoverProgress: number }>>([]);
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
      const spacing = 50; // Space between dots
      const dotRadius = 4; // Dot size
      
      for (let x = spacing; x < canvas.width; x += spacing) {
        for (let y = spacing; y < canvas.height; y += spacing) {
          dotsRef.current.push({
            x,
            y,
            isHovered: false,
            hoverProgress: 0,
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
        
        // Update hover state
        if (distance < hoverRadius) {
          dot.isHovered = true;
          dot.hoverProgress = Math.min(1, dot.hoverProgress + 0.1);
        } else {
          dot.isHovered = false;
          dot.hoverProgress = Math.max(0, dot.hoverProgress - 0.05);
        }

        // Interpolate color
        const lightGrey = { r: 209, g: 213, b: 219 }; // gray-300
        const cosentusBlue = { r: 1, g: 178, b: 214 }; // #01B2D6
        
        const r = Math.round(lightGrey.r + (cosentusBlue.r - lightGrey.r) * dot.hoverProgress);
        const g = Math.round(lightGrey.g + (cosentusBlue.g - lightGrey.g) * dot.hoverProgress);
        const b = Math.round(lightGrey.b + (cosentusBlue.b - lightGrey.b) * dot.hoverProgress);

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fill();
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

