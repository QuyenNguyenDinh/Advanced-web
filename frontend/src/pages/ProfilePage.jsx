import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { FaUserCircle, FaEnvelope, FaIdBadge, FaShieldAlt, FaKey, FaSignOutAlt, FaCookieBite, FaClock } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await authService.getProfile();
        setProfileData(res.user);
      } catch (err) {
        setError('Phiên làm việc hoặc JWT Token đã hết hạn. Vui lòng đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const token = authService.getToken();

  return (
    <div className="py-5 min-vh-100" style={{ backgroundColor: 'transparent' }}>
      <Container>
        <div className="max-w-800 mx-auto" style={{ maxWidth: '850px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Hồ Sơ Cá Nhân</h2>
              <p className="small mb-0" style={{ color: '#475569' }}>Thông tin tài khoản được bảo vệ bởi JWT Guard (Backend NestJS)</p>
            </div>
            <Button 
              variant="outline-danger" 
              className="rounded-pill px-4 fw-semibold" 
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" /> Đăng xuất
            </Button>
          </div>

          {error && (
            <Alert 
              variant="warning" 
              className="rounded-4 p-4 mb-4 border-0"
              style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e' }}
            >
              <h5>{error}</h5>
              <Button 
                as={Link} 
                to="/login" 
                className="rounded-pill mt-2 border-0 fw-bold px-4 py-2"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff' }}
              >
                Đăng nhập lại
              </Button>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-3 text-muted">Đang xác thực JWT token...</p>
            </div>
          ) : profileData ? (
            <Row className="g-4">
              {/* Thẻ thông tin chính */}
              <Col md={5}>
                <Card 
                  className="border-0 shadow-sm rounded-4 p-4 text-center h-100"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
                  }}
                >
                  <div className="my-3">
                    <FaUserCircle className="display-1" style={{ color: '#ea580c' }} />
                  </div>
                  <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{profileData.name || profileData.username}</h4>
                  <p className="small mb-3 text-muted">@{profileData.username}</p>

                  <div className="mb-4">
                    <span 
                      className="px-3 py-1 rounded-pill small fw-bold text-uppercase d-inline-block"
                      style={{
                        background: '#fff7ed',
                        color: '#ea580c',
                        border: '1px solid #ffedd5'
                      }}
                    >
                      {profileData.role || 'user'}
                    </span>
                  </div>

                  <hr style={{ borderColor: '#f1f5f9' }} />

                  <div className="text-start small d-flex flex-column gap-2" style={{ color: '#475569' }}>
                    <div><strong style={{ color: '#0f172a' }}>ID CSDL:</strong> #{profileData.id}</div>
                    <div><strong style={{ color: '#0f172a' }}>Ngày gia nhập:</strong> {new Date(profileData.created_at || Date.now()).toLocaleDateString('vi-VN')}</div>
                  </div>
                </Card>
              </Col>

              {/* Thẻ chi tiết và kỹ thuật */}
              <Col md={7}>
                <Card 
                  className="border-0 shadow-sm rounded-4 p-4 mb-4"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
                  }}
                >
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                    <FaIdBadge style={{ color: '#ea580c' }} /> Chi tiết tài khoản
                  </h5>

                  <div className="d-flex flex-column gap-3">
                    <div 
                      className="p-3 rounded-3"
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                    >
                      <div className="small text-muted">Email đăng ký:</div>
                      <div className="fw-semibold d-flex align-items-center gap-2 mt-1" style={{ color: '#0f172a' }}>
                        <FaEnvelope style={{ color: '#ea580c' }} /> {profileData.email || 'Chưa cập nhật'}
                      </div>
                    </div>

                    <div 
                      className="p-3 rounded-3"
                      style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}
                    >
                      <div className="small text-muted">Trạng thái bảo mật:</div>
                      <div className="fw-semibold text-success d-flex align-items-center gap-2 mt-1">
                        <FaShieldAlt /> Mật khẩu đã được mã hóa Bcrypt an toàn
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Trạng thái công nghệ Authentication */}
                <Card 
                  className="border-0 shadow-sm rounded-4 p-4"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
                  }}
                >
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
                    <FaKey style={{ color: '#f59e0b' }} /> Thông tin Phiên & Token
                  </h5>

                  <div className="small">
                    <div className="mb-2 d-flex justify-content-between">
                      <span className="text-muted">Cơ chế xác thực:</span>
                      <strong className="text-primary">JWT Bearer Token + HttpOnly Cookie</strong>
                    </div>

                    <div className="mb-2 d-flex justify-content-between">
                      <span className="text-muted">Trạng thái phiên (Session):</span>
                      <strong className="text-success">Đã kết nối Express-Session</strong>
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 text-muted">JWT Access Token hiện tại (Trích xuất):</div>
                      <div 
                        className="p-2 rounded text-break font-monospace small" 
                        style={{ 
                          maxHeight: '80px', 
                          overflowY: 'auto',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          color: '#0f172a'
                        }}
                      >
                        {token || 'Không tìm thấy token trong localStorage'}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
