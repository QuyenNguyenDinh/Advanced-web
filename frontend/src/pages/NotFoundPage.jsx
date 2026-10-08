import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCompass, FaHome } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center position-relative">
      <div 
        className="display-1 fw-black mb-2" 
        style={{ 
          background: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900,
          textShadow: '0 10px 30px rgba(245, 158, 11, 0.3)'
        }}
      >
        404
      </div>
      <FaCompass className="display-4 mb-3" style={{ color: '#fbbf24' }} />
      <h2 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Cung Đường Này Chưa Có Trên Bản Đồ!</h2>
      <p className="mb-4" style={{ color: '#475569', maxWidth: '500px' }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ mới trên hành trình XÊ DỊCH.
      </p>
      <Button
        as={Link}
        to="/"
        className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 border-0 text-white shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
        }}
      >
        <FaHome /> Quay về Trang chủ
      </Button>
    </Container>
  );
}
