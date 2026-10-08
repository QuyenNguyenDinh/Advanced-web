import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMountain, FaUserPlus, FaLock, FaUser, FaEnvelope, FaIdCard } from 'react-icons/fa';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await register(formData);
      setSuccess('Đăng ký tài khoản thành công! Mật khẩu đã được mã hóa Bcrypt. Đang chuyển hướng sang trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký không thành công. Hãy thử lại.');
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
          width: '550px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.05) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <Container className="position-relative" style={{ zIndex: 1 }}>
        <Card 
          className="border-0 shadow-lg rounded-4 mx-auto overflow-hidden" 
          style={{ 
            maxWidth: '520px',
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
            <h3 className="fw-bold mb-1 tracking-wide" style={{ letterSpacing: '0.5px' }}>ĐĂNG KÝ TÀI KHOẢN</h3>
            <p className="mb-0 small text-white-50">Gia nhập cộng đồng phượt thủ XÊ DỊCH</p>
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
            {success && (
              <Alert 
                variant="success" 
                className="border-0 rounded-3 small mb-4"
              >
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small" style={{ color: '#334155' }}>Họ và tên hiển thị</Form.Label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{ background: '#f8fafc', color: '#ea580c', borderColor: '#cbd5e1' }}
                  >
                    <FaIdCard />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn Phượt"
                    className="py-2"
                    style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small" style={{ color: '#334155' }}>Tên đăng nhập (Username) *</Form.Label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{ background: '#f8fafc', color: '#ea580c', borderColor: '#cbd5e1' }}
                  >
                    <FaUser />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Ít nhất 3 ký tự"
                    required
                    className="py-2"
                    style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small" style={{ color: '#334155' }}>Email liên hệ</Form.Label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{ background: '#f8fafc', color: '#ea580c', borderColor: '#cbd5e1' }}
                  >
                    <FaEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="phuotthu@gmail.com"
                    className="py-2"
                    style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small" style={{ color: '#334155' }}>Mật khẩu *</Form.Label>
                <div className="input-group">
                  <span 
                    className="input-group-text" 
                    style={{ background: '#f8fafc', color: '#ea580c', borderColor: '#cbd5e1' }}
                  >
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Ít nhất 6 ký tự"
                    required
                    className="py-2"
                    style={{ borderColor: '#cbd5e1', color: '#0f172a' }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <FaUserPlus /> {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
              </Button>
            </Form>

            <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="small text-muted">Đã có tài khoản? </span>
              <Link 
                to="/login" 
                className="fw-bold text-decoration-none"
                style={{ color: '#ea580c', transition: 'color 0.2s ease' }}
              >
                Đăng nhập tại đây
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
