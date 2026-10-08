import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMountain, FaSignInAlt, FaLock, FaUser } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ username, password });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 min-vh-100 d-flex align-items-center position-relative" style={{ backgroundColor: 'transparent' }}>
      {/* Ambient glow decoration */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Card 
          className="border-0 shadow-lg rounded-4 mx-auto overflow-hidden" 
          style={{ 
            maxWidth: '460px',
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)'
          }}
        >
          {/* Card Header */}
          <div 
            className="p-4 text-center text-white position-relative" 
            style={{ 
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <div 
              className="d-inline-flex p-3 rounded-circle mb-2"
              style={{ background: 'rgba(0, 0, 0, 0.12)', backdropFilter: 'blur(10px)' }}
            >
              <FaMountain className="fs-2 text-white" />
            </div>
            <h3 className="fw-bold mb-1 tracking-wide" style={{ letterSpacing: '0.5px' }}>ĐĂNG NHẬP XÊ DỊCH</h3>
            <p className="mb-0 small text-white-50">Cộng đồng trekking & săn mây Tây Bắc</p>
          </div>

          <Card.Body className="p-4 p-md-5">
            {error && (
              <Alert 
                variant="danger" 
                className="border-0 rounded-3 small mb-4"
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small" style={{ color: '#334155' }}>Tên đăng nhập (Username)</Form.Label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{ background: '#f8fafc', color: '#ea580c', borderColor: '#cbd5e1' }}
                  >
                    <FaUser />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Nhập username"
                    required
                    className="py-2"
                    style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small" style={{ color: '#334155' }}>Mật khẩu</Form.Label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{ background: '#f8fafc', color: '#ea580c', borderColor: '#cbd5e1' }}
                  >
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    required
                    className="py-2"
                    style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 py-3 rounded-pill fw-bold border-0 d-flex align-items-center justify-content-center gap-2 text-white shadow-sm"
                style={{ 
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 8px 24px rgba(234, 88, 12, 0.28)',
                  transition: 'all 0.25s ease'
                }}
                disabled={loading}
              >
                <FaSignInAlt /> {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
              </Button>
            </Form>

            <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="small text-muted">Chưa có tài khoản? </span>
              <Link 
                to="/register" 
                className="fw-bold text-decoration-none" 
                style={{ color: '#ea580c', transition: 'color 0.2s ease' }}
              >
                Đăng ký thành viên
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
