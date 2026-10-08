import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div
      className={`d-flex flex-column min-vh-100 ${isHome ? 'cin-layout-home' : ''}`}
      style={{ backgroundColor: 'transparent', color: '#1e293b' }}
    >
      <Header />
      <main className="flex-grow-1" style={isHome ? { position: 'relative', zIndex: 10 } : { paddingTop: '76px' }}>
        <Outlet />
      </main>
      <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#0f172a' }}>
        <Footer />
      </div>
    </div>
  );
}
