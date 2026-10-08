import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMountain, FaFacebook, FaInstagram, FaGithub, FaEnvelope, FaPhoneAlt, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="custom-footer" id="about">
      <Container>
        <Row className="g-4 mb-5">
          <Col lg={4} md={6}>
            <div className="footer-brand">
              <FaMountain className="text-warning" />
              <span>TRIPAHOLIC</span>
            </div>
            <p className="text-secondary pe-lg-4">
              Nền tảng chia sẻ cẩm nang phượt, săn mây và kết nối cộng đồng tripaholic văn minh khắp mọi miền Việt Nam. Cung cấp lịch trình mẫu, homestay view đẹp và lưu ý an toàn.
            </p>
            <div className="d-flex mt-3">
              <a href="#facebook" className="footer-social-icon" title="Facebook">
                <FaFacebook />
              </a>
              <a href="#instagram" className="footer-social-icon" title="Instagram">
                <FaInstagram />
              </a>
              <a href="https://github.com/QuyenNguyenDinh/Advanced-web" target="_blank" rel="noreferrer" className="footer-social-icon" title="GitHub">
                <FaGithub />
              </a>
              <a href="#email" className="footer-social-icon" title="Email">
                <FaEnvelope />
              </a>
            </div>
          </Col>

          <Col lg={2} sm={6}>
            <h6 className="text-white fw-bold mb-3">Điểm đến</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/destinations" className="text-secondary text-decoration-none hover-white">Tà Xùa</Link></li>
              <li><Link to="/destinations" className="text-secondary text-decoration-none hover-white">Hà Giang</Link></li>
              <li><Link to="/destinations" className="text-secondary text-decoration-none hover-white">Mộc Châu</Link></li>
              <li><Link to="/destinations" className="text-secondary text-decoration-none hover-white">Y Tý</Link></li>
              <li><Link to="/destinations" className="text-secondary text-decoration-none hover-white">Tất cả điểm đến</Link></li>
            </ul>
          </Col>

          <Col lg={3} sm={6}>
            <h6 className="text-white fw-bold mb-3">Dịch vụ & Tiện ích</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/tours" className="text-secondary text-decoration-none hover-white">Tour trekking săn mây</Link></li>
              <li><Link to="/feedback" className="text-secondary text-decoration-none hover-white">Nhật ký & Feedback của khách</Link></li>
              <li><Link to="/tours" className="text-secondary text-decoration-none hover-white">Porter bản địa & Bảo hiểm</Link></li>
              <li><Link to="/feedback" className="text-secondary text-decoration-none hover-white">Đánh giá 4.9⭐ cộng đồng</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="text-white fw-bold mb-3">Liên hệ hỗ trợ</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-success" />
                <span>Hotline: 0988.xxx.xxx (24/7)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-success" />
                <span>Email: hotro@xedich.vn</span>
              </li>
              <li className="mt-2">
                <span>Dự án môn học: <strong>Phát triển ứng dụng Web Nâng Cao</strong></span>
              </li>
              <li className="mt-1">
                <Link to="/session-demo" className="text-secondary text-decoration-none opacity-75" style={{ fontSize: '0.8rem' }}>
                  🛠️ Demo Kỹ thuật: Session & Cookies
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 pt-3 small text-secondary">
          <div>
            © {new Date().getFullYear()} TRIPAHOLIC Platform. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Made with <FaHeart className="text-danger" /> for Advanced Web Development
          </div>
        </div>
      </Container>
    </footer>
  );
}
