import { useEffect, useRef } from 'react';

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height + 20; 
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 10;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 10; 
        this.radius = Math.random() * 6 + 4;
        this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
        this.gravity = 0.35;
        this.drag = 0.96;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.008;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
      }

      update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.rotation += this.rotationSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.radius, -this.radius / 2, this.radius * 2, this.radius);
        ctx.restore();
      }
    }

    let particles = [];
    
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    const addSideBursts = () => {
      for (let i = 0; i < 30; i++) {
        const p = new Particle();
        p.x = 0;
        p.y = canvas.height * 0.8;
        const angle = -Math.random() * Math.PI * 0.25 - 0.1; 
        const speed = Math.random() * 20 + 15;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        particles.push(p);
      }
      for (let i = 0; i < 30; i++) {
        const p = new Particle();
        p.x = canvas.width;
        p.y = canvas.height * 0.8;
        const angle = -Math.random() * Math.PI * 0.25 - 2.2; 
        const speed = Math.random() * 20 + 15;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        particles.push(p);
      }
    };
    
    addSideBursts();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default Confetti;
