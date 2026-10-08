import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { authService } from '../services/auth.service';
import { FaCookieBite, FaClock, FaCheckCircle, FaRedo } from 'react-icons/fa';

export default function SessionDemoPage() {
  const [cookieData, setCookieData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loadingCookie, setLoadingCookie] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  const testCookies = async () => {
    setLoadingCookie(true);
    try {
      const data = await authService.getCookiesDemo();
      setCookieData(data);
    } catch (err) {
      setCookieData({ error: err.message });
    } finally {
      setLoadingCookie(false);
    }
  };

  const testSession = async () => {
    setLoadingSession(true);
    try {
      const data = await authService.getSessionDemo();
      setSessionData(data);
    } catch (err) {
      setSessionData({ error: err.message });
    } finally {
      setLoadingSession(false);
    }
  };

  return (
    <div className="py-5 min-vh-100" style={{ backgroundColor: 'transparent' }}>
      <Container>
        <div className="text-center mb-5">
          <span 
            className="px-3 py-1 rounded-pill small fw-bold text-uppercase d-inline-block mb-3"
            style={{
              background: '#fff7ed',
              color: '#ea580c',
              border: '1px solid #ffedd5'
            }}
          >
            Minh Chứng Tuần 2
          </span>
          <h2 className="fw-bold" style={{ color: '#0f172a' }}>
            Kiểm Tra Cookies & Session Trực Quan
          </h2>
          <p className="max-w-600 mx-auto" style={{ color: '#475569' }}>
            Trang kiểm thử tương tác thực tế với 2 middleware Cookies (cookie-parser) và Session (express-session) được cài đặt trên NestJS Backend.
          </p>
        </div>

        <Row className="g-4">
          {/* CỘT 1: COOKIES DEMO */}
          <Col md={6}>
            <Card 
              className="border-0 shadow-sm rounded-4 p-4 h-100"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div 
                  className="p-3 rounded-circle fs-3"
                  style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c' }}
                >
                  <FaCookieBite />
                </div>
                <div>
                  <h4 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Yêu cầu 1: Cookies</h4>
                  <small className="text-muted">Middleware: cookie-parser</small>
                </div>
              </div>

              <p className="small" style={{ color: '#334155' }}>
                Bấm nút bên dưới để gửi request đến endpoint <code>GET /api/auth/cookies-demo</code>. Backend sẽ thiết lập cookie <code>user_preference_theme</code> và <code>last_visit</code> cho trình duyệt của bạn.
              </p>

              <Button
                className="py-2 px-4 rounded-pill fw-bold mb-3 d-flex align-items-center justify-content-center gap-2 border-0 text-white shadow-sm"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                onClick={testCookies}
                disabled={loadingCookie}
              >
                <FaRedo className={loadingCookie ? 'fa-spin' : ''} />
                {loadingCookie ? 'Đang gửi request...' : 'Gửi Request Kiểm Tra Cookie'}
              </Button>

              {cookieData && (
                <div className="mt-3">
                  <h6 className="fw-bold small text-success d-flex align-items-center gap-1">
                    <FaCheckCircle /> Kết quả trả về từ Backend:
                  </h6>
                  <pre 
                    className="p-3 rounded-3 small font-monospace" 
                    style={{ maxHeight: '200px', overflowY: 'auto', background: '#f8fafc', color: '#ea580c', border: '1px solid #e2e8f0' }}
                  >
                    {JSON.stringify(cookieData, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </Col>

          {/* CỘT 2: SESSION DEMO */}
          <Col md={6}>
            <Card 
              className="border-0 shadow-sm rounded-4 p-4 h-100"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
              }}
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div 
                  className="p-3 rounded-circle fs-3"
                  style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}
                >
                  <FaClock />
                </div>
                <div>
                  <h4 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Yêu cầu 2: Session</h4>
                  <small className="text-muted">Middleware: express-session</small>
                </div>
              </div>

              <p className="small" style={{ color: '#334155' }}>
                Bấm nút bên dưới để gửi request đến <code>GET /api/auth/session-demo</code>. Mỗi lần bấm, Backend sẽ tự động tăng số lần đếm (<code>sessionViews + 1</code>) tương ứng với Session ID của bạn!
              </p>

              <Button
                className="py-2 px-4 rounded-pill fw-bold mb-3 d-flex align-items-center justify-content-center gap-2 border-0 text-white shadow-sm"
                style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}
                onClick={testSession}
                disabled={loadingSession}
              >
                <FaRedo className={loadingSession ? 'fa-spin' : ''} />
                {loadingSession ? 'Đang cập nhật phiên...' : 'Gửi Request Tăng Session Views'}
              </Button>

              {sessionData && (
                <div className="mt-3">
                  <h6 className="fw-bold small text-info d-flex align-items-center gap-1">
                    <FaCheckCircle /> Dữ liệu phiên hiện tại:
                  </h6>
                  <div 
                    className="p-3 rounded-3 small mb-2"
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}
                  >
                    <div><strong style={{ color: '#0f172a' }}>Session ID:</strong> <code>{sessionData.sessionId}</code></div>
                    <div className="fs-5 fw-bold text-success mt-1">
                      Số lần truy cập phiên (Views): {sessionData.sessionViews}
                    </div>
                  </div>
                  <pre 
                    className="p-3 rounded-3 small font-monospace" 
                    style={{ maxHeight: '150px', overflowY: 'auto', background: '#f8fafc', color: '#0284c7', border: '1px solid #e2e8f0' }}
                  >
                    {JSON.stringify(sessionData, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
