import React, { useEffect, useRef, useState } from 'react';

export default function CinematicHeroBg() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Mouse movement tracking for soft organic 2.5D parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 20;
      targetY = (e.clientY / window.innerHeight - 0.5) * 14;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Canvas 2D soft volumetric cloud mist & floating firefly particles
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Create 18 organic, soft billowing mist clusters (NO geometric cubes, purely soft Gaussian radial gradients)
    const mistClusters = [];
    for (let i = 0; i < 16; i++) {
      mistClusters.push({
        x: Math.random() * width,
        y: height * 0.45 + Math.random() * (height * 0.55),
        radius: 180 + Math.random() * 260,
        speedX: 0.12 + Math.random() * 0.22,
        opacity: 0.08 + Math.random() * 0.14,
        scaleY: 0.4 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Floating glowing alpine embers / dew motes
    const embers = [];
    for (let i = 0; i < 45; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2.2,
        speedY: -0.3 - Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: 0.2 + Math.random() * 0.6,
        pulseSpeed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Animation Loop
    let animId;
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.016;

      // Parallax smooth interpolation
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setMousePos({ x: currentX, y: currentY });

      ctx.clearRect(0, 0, width, height);

      // Render drifting soft mist billows
      for (let i = 0; i < mistClusters.length; i++) {
        const m = mistClusters[i];
        m.x += m.speedX;
        if (m.x - m.radius > width) {
          m.x = -m.radius;
        }

        const sway = Math.sin(time * 0.8 + m.phase) * 15;
        const cy = m.y + sway;

        ctx.save();
        ctx.translate(m.x, cy);
        ctx.scale(1.0, m.scaleY);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, m.radius);
        grad.addColorStop(0, `rgba(240, 248, 255, ${m.opacity})`);
        grad.addColorStop(0.5, `rgba(220, 235, 250, ${m.opacity * 0.5})`);
        grad.addColorStop(1, 'rgba(210, 230, 250, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render floating embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y += e.speedY;
        e.x += e.speedX;

        if (e.y < -10) e.y = height + 10;
        if (e.x < -10) e.x = width + 10;
        if (e.x > width + 10) e.x = -10;

        const pulse = (Math.sin(time * e.pulseSpeed + e.phase) + 1) * 0.5;
        const alpha = e.opacity * (0.4 + pulse * 0.6);

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
        ctx.fill();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: '#060911'
      }}
      aria-hidden="true"
    >
      {/* 1. Real High-Resolution Landscape Photo with Smooth Organic Parallax */}
      <div
        style={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: 'url("/images/taxua.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          transform: `translate3d(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px, 0) scale(1.04)`,
          transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          filter: 'brightness(0.72) contrast(1.12)'
        }}
      />

      {/* 2. Soft Atmospheric Lighting & Depth Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 25% 18%, rgba(245, 158, 11, 0.18) 0%, transparent 55%),
            linear-gradient(180deg, rgba(6, 9, 17, 0.5) 0%, rgba(6, 9, 17, 0.25) 40%, rgba(6, 9, 17, 0.85) 85%, #060911 100%)
          `
        }}
      />

      {/* 3. Soft Volumetric Cloud Mist & Embers Canvas (Organic Gaussian falloff, zero blockiness) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* 4. Film Grain Texture Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.038,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 5. Cinematic Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(4, 7, 13, 0.6) 80%, rgba(3, 5, 11, 0.92) 100%)'
        }}
      />
    </div>
  );
}
