import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMountain,
  FaCompass,
  FaArrowRight,
  FaChevronDown,
  FaMapMarkerAlt
} from 'react-icons/fa';

import CinematicScrollBackground from '../components/cinematic/CinematicScrollBackground';
import ProceduralAudio from '../components/cinematic/ProceduralAudio';
import '../components/cinematic/cinematic.css';

// Destination data synced with the 3D flight stages
const DESTINATIONS = [
  {
    id: 1,
    name: 'Tà Xùa',
    tagline: 'Biển Mây Đại Ngàn',
    region: 'Bắc Yên, Sơn La',
    elevation: '2.865m',
    coordinates: "21°24'N 104°18'E",
    season: 'Tháng 10 – Tháng 4',
    oneLiner: 'Sống lưng khủng long chênh vênh giữa biển mây trắng muốt vỗ vào vách đá.',
    scrollRange: [0.0, 0.18]
  },
  {
    id: 2,
    name: 'Y Tý',
    tagline: 'Ruộng Bậc Thang Vàng',
    region: 'Bát Xát, Lào Cai',
    elevation: '2.000m',
    coordinates: "22°37'N 103°36'E",
    season: 'Tháng 9 – Tháng 4',
    oneLiner: 'Sóng vàng ruộng bậc thang tràn ngập sương phủ bên những mái nhà nấm trình tường.',
    scrollRange: [0.22, 0.44]
  },
  {
    id: 3,
    name: 'Mã Pí Lèng',
    tagline: 'Hẻm Vực & Sông Nho Quế',
    region: 'Mèo Vạc, Hà Giang',
    elevation: '2.000m',
    coordinates: "23°14'N 105°24'E",
    season: 'Tháng 9 – Tháng 12',
    oneLiner: 'Cung đèo huyền thoại nhìn xuống dòng Nho Quế ngọc bích sâu 800 mét.',
    scrollRange: [0.46, 0.64]
  },
  {
    id: 4,
    name: 'Fansipan',
    tagline: 'Nóc Nhà Đông Dương',
    region: 'Sa Pa, Lào Cai',
    elevation: '3.143m',
    coordinates: "22°18'N 103°46'E",
    season: 'Tháng 11 – Tháng 3',
    oneLiner: 'Đỉnh núi cao nhất Việt Nam sừng sững giữa biển mây hoàng hôn dát vàng.',
    scrollRange: [0.70, 1.0]
  }
];

// Floating destination info card — translucent frosted glass, see-through depth, crystal-clear typography
function FloatingDestCard({ dest, opacity, side }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        [side]: '32px',
        zIndex: 30,
        maxWidth: '350px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.42) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.75)',
        borderRadius: '24px',
        padding: '24px 26px',
        opacity,
        transform: `translateY(${(1 - opacity) * 20}px)`,
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: opacity > 0.3 ? 'auto' : 'none',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 4px 12px rgba(0, 0, 0, 0.03)',
        fontFamily: "'Be Vietnam Pro', sans-serif"
      }}
    >
      {/* Location eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: '#c2410c',
          textTransform: 'uppercase',
          fontWeight: 700,
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)'
        }}
      >
        <FaMapMarkerAlt style={{ fontSize: '10px' }} />
        <span>{dest.region}</span>
        <span style={{ color: 'rgba(148, 163, 184, 0.8)' }}>|</span>
        <span style={{ color: '#475569', fontWeight: 600 }}>{dest.elevation}</span>
      </div>

      {/* Destination name - Đậm nét, sắc sảo, nổi bật trên nền kính xuyên thấu */}
      <h3
        style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontWeight: 900,
          fontSize: '1.75rem',
          color: '#0f172a',
          margin: '0 0 4px 0',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
        }}
      >
        {dest.name}
      </h3>

      <div
        style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '13.5px',
          fontWeight: 700,
          color: '#ea580c',
          marginBottom: '10px',
          letterSpacing: '0.01em',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.6)'
        }}
      >
        {dest.tagline}
      </div>

      {/* One-liner description - Chữ đậm nét 500, màu than chì sắc nét dễ đọc */}
      <p
        style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '13.5px',
          lineHeight: 1.65,
          color: '#0f172a',
          margin: '0 0 14px 0',
          fontWeight: 500,
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.6)'
        }}
      >
        {dest.oneLiner}
      </p>

      {/* Link */}
      <Link
        to={`/destinations/${dest.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '6px',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontSize: '13.5px',
          fontWeight: 800,
          color: '#ea580c',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          transition: 'all 0.2s ease',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.6)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#c2410c';
          e.currentTarget.style.transform = 'translateX(3px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#ea580c';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        Khám phá {dest.name} <FaArrowRight style={{ fontSize: '11px' }} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(window.scrollY / maxScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity for each destination card based on scroll
  const getDestOpacity = (dest) => {
    const [start, end] = dest.scrollRange;
    const p = scrollProgress;
    const fadeIn = 0.04;
    const fadeOut = 0.04;
    if (p < start) return 0;
    if (p < start + fadeIn) return (p - start) / fadeIn;
    if (p <= end - fadeOut) return 1;
    if (p <= end) return (end - p) / fadeOut;
    return 0;
  };

  // Hero fades out as user scrolls
  const heroOpacity = Math.max(0, 1 - scrollProgress * 5.5);

  return (
    <div style={{ backgroundColor: 'transparent', minHeight: '100vh', position: 'relative' }}>
      {/* 1. CINEMATIC 3D SCROLL BACKGROUND */}
      <CinematicScrollBackground />

      {/* 2. PROCEDURAL AMBIENT AUDIO */}
      <ProceduralAudio />

      {/* 3. MAIN CONTENT LAYER */}
      <div className="cinematic-page">

        {/* ========== HERO — Minimal, transparent, lets background breathe ========== */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 clamp(24px, 5vw, 80px)',
            opacity: heroOpacity,
            transform: `translateY(${(1 - heroOpacity) * -30}px)`,
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            pointerEvents: heroOpacity > 0.2 ? 'auto' : 'none'
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            {/* Eyebrow */}
            <div className="cin-eyebrow">
              <span className="cin-eyebrow-line" />
              <span>TRIPAHOLIC • PHƯỢT & SĂN MÂY TÂY BẮC</span>
            </div>

            {/* Main Headline */}
            <h1 className="cin-headline" style={{ fontSize: 'clamp(2.6rem, 5.2vw, 4.8rem)' }}>
              Khám Phá Những <br />
              <span className="cin-headline-serif">Cung Đường Mây Ngàn</span>
            </h1>

            {/* Compact subtitle */}
            <p
              className="cin-narrative"
              style={{ maxWidth: '520px', marginBottom: '28px' }}
            >
              Hành trình đưa bạn chạm tay vào đại dương mây bồng bềnh tại những đỉnh đèo ngoạn mục bậc nhất non sông.
            </p>

            {/* Single CTA */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/destinations" className="cin-btn-primary">
                <FaCompass /> Khám Phá Điểm Đến
              </Link>
              <Link to="/destinations" className="cin-btn-secondary">
                <FaMountain /> Tất Cả Địa Danh
              </Link>
            </div>
          </div>

          {/* Scroll hint */}
          <div
            className="cin-scroll-hint"
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: '#e2e8f0',
                marginBottom: '6px',
                fontWeight: 600
              }}
            >
              CUỘN ĐỂ BAY CÙNG MÂY
            </div>
            <FaChevronDown style={{ color: '#fbbf24', fontSize: '14px' }} />
          </div>
        </section>

        {/* ========== SCROLL SPACER — Creates enough scroll height for the cinematic flight ========== */}
        <div style={{ height: '420vh' }} aria-hidden="true" />
      </div>

      {/* 4. FLOATING DESTINATION INFO CARDS — Appear based on scroll progress */}
      {DESTINATIONS.map((dest, idx) => {
        const opacity = getDestOpacity(dest);
        if (opacity <= 0.01) return null;
        const side = idx % 2 === 0 ? 'right' : 'left';
        return (
          <FloatingDestCard
            key={dest.id}
            dest={dest}
            opacity={opacity}
            side={side}
          />
        );
      })}
    </div>
  );
}
