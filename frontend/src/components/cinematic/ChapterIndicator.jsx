import React, { useState, useEffect } from 'react';

const CHAPTERS = [
  { id: 'ch-01', index: '01', title: 'NGƯỠNG CỬA MÂY', label: 'TÀ XÙA' },
  { id: 'ch-02', index: '02', title: 'HÙNG VĨ ĐẠI NGÀN', label: 'MÃ PÍ LÈNG' },
  { id: 'ch-03', index: '03', title: 'CHÒI VỌNG CẢNH', label: 'HẢO HỮU' },
  { id: 'ch-04', index: '04', title: 'ĐỈNH PHÙ VÂN', label: 'RADAR MÂY' },
  { id: 'ch-05', index: '05', title: 'HÀNH TRÌNH', label: 'ĐIỂM ĐẾN' }
];

export default function ChapterIndicator({ activeChapter = 0, onSelectChapter }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      className="chapter-rail d-none d-lg-flex flex-column align-items-center justify-content-between"
      style={{
        position: 'fixed',
        right: '28px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        height: '380px',
        pointerEvents: 'auto'
      }}
      aria-label="Điều hướng các chương"
    >
      {/* Top Vertical Altitude Label */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: 'rgba(215, 227, 219, 0.45)',
          writingMode: 'vertical-rl',
          textTransform: 'uppercase'
        }}
      >
        TỌA ĐỘ • 2.865M
      </div>

      {/* Progress Track Line */}
      <div
        style={{
          position: 'relative',
          width: '2px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          margin: '12px 0'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${scrollProgress * 100}%`,
            background: 'linear-gradient(to bottom, #f59e0b, #10b981)',
            boxShadow: '0 0 10px #f59e0b'
          }}
        />

        {/* Chapter Waypoint Pips */}
        {CHAPTERS.map((ch, idx) => {
          const topPercent = (idx / (CHAPTERS.length - 1)) * 100;
          const isActive = activeChapter === idx;

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter && onSelectChapter(idx)}
              title={`${ch.index} • ${ch.title}`}
              style={{
                position: 'absolute',
                top: `${topPercent}%`,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isActive ? '12px' : '7px',
                height: isActive ? '12px' : '7px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.35)',
                border: isActive ? '2px solid rgba(255, 255, 255, 0.9)' : 'none',
                boxShadow: isActive ? '0 0 12px #f59e0b' : 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          );
        })}
      </div>

      {/* Active Chapter Index Display */}
      <div
        style={{
          fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace",
          fontSize: '13px',
          fontWeight: 700,
          color: '#f59e0b',
          letterSpacing: '0.15em'
        }}
      >
        {CHAPTERS[activeChapter]?.index || '01'}
        <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontWeight: 400 }}> / 05</span>
      </div>
    </aside>
  );
}
