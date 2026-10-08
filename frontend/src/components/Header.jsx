import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaMountain, FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  // 4 mục điều hướng theo đúng yêu cầu:
  // Trang chủ, Điểm đến, Tour trekking, Nhật ký & Feedback
  const navItems = [
    { id: 'home', label: 'Trang chủ', to: '/' },
    { id: 'destinations', label: 'Điểm đến', to: '/destinations' },
    { id: 'tours', label: 'Tour trekking', to: '/tours' },
    { id: 'feedback', label: 'Nhật ký & Feedback', to: '/feedback' },
  ];

  const getActiveTab = useCallback((pathname) => {
    if (pathname.startsWith('/destinations')) return 'destinations';
    if (pathname.startsWith('/tours')) return 'tours';
    if (pathname.startsWith('/feedback')) return 'feedback';
    return 'home';
  }, []);

  const [activeTab, setActiveTab] = useState(() => getActiveTab(location.pathname));

  const navTrackRef = useRef(null);
  const itemRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đồng bộ activeTab khi route thay đổi
  useEffect(() => {
    setActiveTab(getActiveTab(location.pathname));
  }, [location.pathname, getActiveTab]);

  // Cập nhật vị trí viên thuốc trượt
  const updatePill = useCallback(() => {
    const track = navTrackRef.current;
    const activeEl = itemRefs.current[activeTab];
    if (track && activeEl) {
      const trackRect = track.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setPillStyle({
        left: itemRect.left - trackRect.left,
        top: itemRect.top - trackRect.top,
        width: itemRect.width,
        height: itemRect.height,
        opacity: 1,
      });
      setIsReady(true);
    }
  }, [activeTab]);

  useEffect(() => {
    updatePill();
    const t1 = setTimeout(updatePill, 40);
    const t2 = setTimeout(updatePill, 180);

    const onResize = () => updatePill();
    window.addEventListener('resize', onResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updatePill);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onResize);
    };
  }, [updatePill]);

  // Sử dụng ResizeObserver để tự động căn chỉnh viên thuốc khi resize bất kỳ
  useEffect(() => {
    if (!navTrackRef.current) return;
    const observer = new ResizeObserver(() => {
      updatePill();
    });
    observer.observe(navTrackRef.current);
    return () => observer.disconnect();
  }, [updatePill]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavClick = (item, e) => {
    if (e) e.preventDefault();
    setActiveTab(item.id);

    if (item.id === 'home' && location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(item.to);
    }
  };

  const scrollToTop = (e) => {
    setActiveTab('home');
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="cin-navbar navbar-light"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 70,
        background: scrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
        transition: 'all 0.3s ease',
        padding: scrolled ? '8px 0' : '12px 0',
        boxShadow: scrolled ? '0 10px 25px rgba(0, 0, 0, 0.06)' : '0 2px 12px rgba(0, 0, 0, 0.03)'
      }}
    >
      <Container>
        {/* Brand Logo - Giữ khung, kích thước, chữ & phụ đề đồng nhất trên mọi trang */}
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={scrollToTop}
          className="brand-logo"
          style={{
            color: '#0f172a',
            fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
            fontWeight: 900,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
            }}
          >
            <FaMountain />
          </div>
          <div className="d-flex flex-column">
            <span style={{ color: '#0f172a', lineHeight: 1, fontWeight: 900, fontSize: '1.25rem' }}>
              TRIPAHOLIC
            </span>
            <span
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: '9.5px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#ea580c',
                marginTop: '3px'
              }}
            >
              KHÁM PHÁ & SĂN MÂY
            </span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" className="border-secondary" />

        <Navbar.Collapse id="main-navbar-nav">
          {/* Thanh menu điều hướng dạng Viên Thuốc Trượt (Sliding Pill) đồng nhất */}
          <div className="mx-auto my-2 my-lg-0 pill-nav-container">
            <div ref={navTrackRef} className="pill-nav-track">
              {/* Viên thuốc trượt bao quanh mục đang chọn */}
              <div
                className="pill-nav-glider"
                style={{
                  left: `${pillStyle.left}px`,
                  top: `${pillStyle.top}px`,
                  width: `${pillStyle.width}px`,
                  height: `${pillStyle.height}px`,
                  opacity: isReady && pillStyle.opacity ? 1 : 0,
                }}
              />
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    ref={(el) => {
                      if (el) itemRefs.current[item.id] = el;
                    }}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`pill-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Cụm Đăng nhập / Đăng ký đồng nhất kích thước, kiểu dáng ở tất cả các trang */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none">
                  <FaUserCircle className="fs-4" style={{ color: '#ea580c' }} />
                  <div>
                    <span className="fw-bold" style={{ color: '#0f172a' }}>
                      {user.name || user.username}
                    </span>
                    <Badge bg="warning" text="dark" className="ms-2 small">
                      {user.role || 'user'}
                    </Badge>
                  </div>
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="d-flex align-items-center gap-1 rounded-pill px-3"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-secondary"
                  className="d-flex align-items-center gap-1 rounded-pill px-4 py-2 fw-semibold text-decoration-none"
                  style={{
                    borderColor: 'rgba(203, 213, 225, 0.9)',
                    color: '#1e293b',
                    backgroundColor: '#ffffff',
                    fontSize: '13px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <FaSignInAlt /> Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  className="d-flex align-items-center gap-1 rounded-pill px-4 py-2 fw-bold text-decoration-none border-0"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
                  }}
                >
                  <FaUserPlus /> Đăng ký
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
