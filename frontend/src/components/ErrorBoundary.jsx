import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            padding: '24px',
            fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif"
          }}
        >
          <Card
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '36px 30px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(234, 88, 12, 0.2)',
                color: '#ea580c',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 20px'
              }}
            >
              <FaExclamationTriangle />
            </div>

            <h3 style={{ fontWeight: 800, color: '#ffffff', marginBottom: '12px', fontSize: '1.5rem' }}>
              Đã xảy ra sự cố hiển thị
            </h3>

            <p style={{ color: '#cbd5e1', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
              Ứng dụng vừa gặp phải một ngoại lệ nhỏ trong quá trình hiển thị. Hãy nhấn nút làm mới bên dưới để tải lại trạng thái ổn định nhất.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="warning"
                onClick={this.handleReload}
                style={{
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  borderColor: 'transparent',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(234, 88, 12, 0.35)'
                }}
              >
                <FaRedo /> Tải lại trang
              </Button>
              <Button
                variant="outline-light"
                onClick={this.handleGoHome}
                style={{
                  borderRadius: '9999px',
                  padding: '10px 22px',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <FaHome /> Về trang chủ
              </Button>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details
                style={{
                  marginTop: '24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#94a3b8',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  overflowX: 'auto'
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#f59e0b' }}>
                  Chi tiết kỹ thuật (Developer)
                </summary>
                <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#f87171' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
