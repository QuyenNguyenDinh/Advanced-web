import React, { useEffect, useState } from 'react';

export default function PostProcessingOverlay() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Compute silhouette parallax blur and opacity
  const fgBlur = Math.min(12, scrollProgress * 15);
  const fgOpacity = Math.max(0.2, 0.85 - scrollProgress * 0.4);

  return (
    <>
      {/* 1. Film Grain Overlay (z-index: 60) */}
      <div
        id="grain"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 60,
          opacity: 0.048,
          mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* 2. Radial Cinematic Vignette (z-index: 55) */}
      <div
        id="vignette"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 55,
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(4, 7, 13, 0.45) 80%, rgba(3, 5, 10, 0.85) 100%)'
        }}
        aria-hidden="true"
      />

      {/* 3. Foreground Silhouette Plane (z-index: 52) */}
      <div
        id="fg-sky"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '24vh',
          pointerEvents: 'none',
          zIndex: 52,
          opacity: fgOpacity,
          filter: `blur(${fgBlur}px)`,
          transition: 'filter 0.3s ease-out, opacity 0.3s ease-out',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '0 2vw'
        }}
        aria-hidden="true"
      >
        {/* Procedural SVG Pine & Alpine Ridge Silhouette Left */}
        <svg
          viewBox="0 0 450 180"
          style={{ width: '38vw', maxWidth: '420px', height: 'auto', fill: '#05080e', opacity: 0.9 }}
        >
          <path d="M0,180 L0,110 L25,125 L45,95 L65,115 L95,75 L120,105 L155,60 L185,90 L220,40 L250,80 L290,30 L320,70 L370,120 L450,180 Z" />
          <path d="M40,180 L55,130 L65,140 L75,120 L85,180 Z" opacity="0.6" />
          <path d="M140,180 L160,110 L175,130 L190,95 L205,180 Z" opacity="0.7" />
        </svg>

        {/* Procedural SVG Cliff Eaves & Highland Silhouette Right */}
        <svg
          viewBox="0 0 400 160"
          style={{ width: '32vw', maxWidth: '360px', height: 'auto', fill: '#05080e', opacity: 0.85 }}
        >
          <path d="M400,160 L400,90 L360,105 L330,70 L300,95 L260,50 L230,85 L180,30 L140,75 L90,110 L0,160 Z" />
          <path d="M310,160 L325,100 L340,120 L355,85 L370,160 Z" opacity="0.6" />
        </svg>
      </div>
    </>
  );
}
