import React, { useEffect, useRef } from 'react';

export default function CursorWisps() {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let lastX = mouseX;
    let lastY = mouseY;
    let distanceAccumulator = 0;
    let particles = [];

    // Resize
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse movement
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update the smooth cursor dot directly
      dot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0)`;

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      distanceAccumulator += dist;

      // Emit particles BY DISTANCE TRAVELLED (per cinematic-webgl rule)
      const DISTANCE_THRESHOLD = 7;
      if (distanceAccumulator >= DISTANCE_THRESHOLD) {
        const count = Math.min(4, Math.floor(distanceAccumulator / DISTANCE_THRESHOLD));
        distanceAccumulator = 0;

        for (let i = 0; i < count; i++) {
          const t = i / count;
          const interpX = lastX + dx * t;
          const interpY = lastY + dy * t;

          particles.push({
            x: interpX + (Math.random() - 0.5) * 4,
            y: interpY + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.8 + dx * 0.05,
            vy: -0.8 - Math.random() * 1.4 + dy * 0.05, // Curling upward drift
            size: 2.2 + Math.random() * 2.8,
            life: 1.0,
            decay: 0.02 + Math.random() * 0.02,
            hue: Math.random() > 0.4 ? 38 + Math.random() * 12 : 18 + Math.random() * 14 // Warm Amber & Golden Sunrise
          });
        }
      }

      lastX = mouseX;
      lastY = mouseY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Animation frame for canvas rendering
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Render wisps
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.015; // Upward buoyant acceleration
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 92%, 48%, ${p.life * 0.75})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, ${p.life * 0.8})`;
        ctx.fill();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Interactive Cursor Dot (z-index: 80) */}
      <div
        ref={dotRef}
        className="cur-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#d97706',
          boxShadow: '0 0 10px rgba(217, 119, 6, 0.7), 0 0 20px rgba(245, 158, 11, 0.4)',
          pointerEvents: 'none',
          zIndex: 80,
          willChange: 'transform'
        }}
        aria-hidden="true"
      />

      {/* Spirit Trail Canvas (z-index: 79) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 79
        }}
        aria-hidden="true"
      />
    </>
  );
}
