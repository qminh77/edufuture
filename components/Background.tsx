import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  o: number; // opacity base
  size: number;
}

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const STAR_COUNT = 800;
    let speed = 2; // Warp speed
    const FOV = 250; // Field of view

    // Handle Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * canvas.width,
          o: Math.random(),
          size: Math.random() * 2 // Base size
        });
      }
    };

    // Handle Mouse
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX - innerWidth / 2) * 0.1, // Parallax intensity
        y: (e.clientY - innerHeight / 2) * 0.1
      };
    };

    const render = () => {
      // Clear canvas with a slight fade for trails (optional, here we clear fully for sharpness)
      ctx.fillStyle = '#030508'; // Matches 'void' background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Update and Draw Stars
      stars.forEach(star => {
        // Move star towards screen
        star.z -= speed;

        // Reset if it passes the camera or goes off screen
        if (star.z <= 1) { // z <= 1 to avoid division by zero
          star.z = canvas.width;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        // Apply mouse parallax to position
        const x = star.x - mouseRef.current.x * (canvas.width / star.z);
        const y = star.y - mouseRef.current.y * (canvas.width / star.z);

        // 3D Projection
        const scale = FOV / star.z;
        const x2d = cx + x * scale;
        const y2d = cy + y * scale;

        // Calculate size based on depth
        // Math.max(0, ...) prevents the IndexSizeError
        const radius = Math.max(0, star.size * scale);

        // Draw star if within bounds and visible
        if (radius > 0 && x2d >= 0 && x2d <= canvas.width && y2d >= 0 && y2d <= canvas.height) {
          const alpha = Math.min(1, (1 - star.z / canvas.width) * star.o * 2);
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`;
          ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Initialize
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default Starfield;