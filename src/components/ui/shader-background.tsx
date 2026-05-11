import React, { useEffect, useRef } from 'react';

const ShaderBackground = ({ isLightMode = false }: { isLightMode?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        
        if (isLightMode) {
          // White dots for Light Mode
          this.radius = Math.random() * 2 + 1.5;
          this.color = '#FFFFFF';
        } else {
          // Neon cyan nodes for Dark Mode
          this.radius = Math.random() * 2 + 1;
          this.color = Math.random() > 0.5 ? '#00FFFF' : '#00E5FF';
        }
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // No dots
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000); // Higher density
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const drawLines = (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) { // Increased distance
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Opacity based on distance
            const opacity = (1 - distance / 180) * 0.4;
            // Line color based on mode
            if (isLightMode) {
               ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`; 
            } else {
               ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`; // White threads as requested
            }
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      // Clear with slight transparency for trails
      if (isLightMode) {
        // We use a completely transparent fill so that the CSS background gradient is visible
        // However, to create trailing effects on canvas we can use a slightly opaque wipe of the background color
        ctx.fillStyle = 'rgba(14, 165, 233, 0.3)'; // Match the vibrant cyan blue vibe for trails
      } else {
        ctx.fillStyle = 'rgba(3, 8, 26, 0.3)'; // Match the navy midnight tones for trails
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      drawLines(ctx);

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLightMode]);

  return (
    <>
      {/* Base Gradient Background */}
      <div 
        className="fixed top-0 left-0 w-full h-full -z-20 transition-colors duration-700"
        style={{
          background: isLightMode 
            ? 'linear-gradient(to bottom right, #0ea5e9, #38bdf8)' 
            : 'radial-gradient(circle at center, #0B1E40 0%, #03081A 100%)'
        }}
      />
      
      {/* Dynamic Network Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 mix-blend-screen"
      />
    </>
  );
};

export default ShaderBackground;
