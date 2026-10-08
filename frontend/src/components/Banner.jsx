import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCloudSun, FaMapMarkedAlt, FaHiking } from 'react-icons/fa';

export default function Banner({ onSearchSubmit }) {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(keyword);
    } else {
      navigate(`/destinations?search=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <section className="hero-banner text-center" id="home">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero-video-bg"
      >
        <source src="/hero-clouds.webm" type="video/webm" />
        <source src="/hero-clouds.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlay */}
      <div className="hero-overlay"></div>

      <Container className="hero-content">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-dark bg-opacity-50 text-warning mb-3 fw-semibold small">
          <FaCloudSun /> Cẩm nang phượt & săn mây Tây Bắc mùa đẹp nhất
        </div>
        
        <h1 className="hero-title mb-3">
          Khám Phá Những Cung Đường <br />
          <span className="text-warning">Mây Ngàn & Đại Ngàn</span>
        </h1>
        
        <p className="hero-subtitle">
          Tìm kiếm những điểm đến lý tưởng, homestay săn mây view triệu đô, lịch trình tối ưu và cảnh báo an toàn từ cộng đồng phượt thủ.
        </p>

        {/* Ô tìm kiếm ở Banner */}
        <form onSubmit={handleSearch} className="hero-search-box">
          <InputGroup>
            <InputGroup.Text className="bg-transparent border-0 text-muted ps-3">
              <FaSearch className="text-success fs-5" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Bạn muốn đi đâu? (Ví dụ: Tà Xùa, Hà Giang, Mộc Châu...)"
              className="border-0 shadow-none py-2 px-3 fs-6"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              type="submit"
              variant="success"
              className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
              style={{ backgroundColor: '#0f766e', borderColor: '#0f766e' }}
            >
              Tìm kiếm
            </Button>
          </InputGroup>
        </form>

        {/* Thống kê nhanh */}
        <Row className="mt-5 justify-content-center g-4 text-start">
          <Col xs={12} sm={4} md={3} className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-white bg-opacity-10 fs-4 text-warning">
              <FaCloudSun />
            </div>
            <div>
              <div className="fw-bold fs-4 text-white">50+</div>
              <div className="small text-light">Điểm săn mây đỉnh cao</div>
            </div>
          </Col>
          
          <Col xs={12} sm={4} md={3} className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-white bg-opacity-10 fs-4 text-success">
              <FaMapMarkedAlt />
            </div>
            <div>
              <div className="fw-bold fs-4 text-white">200+</div>
              <div className="small text-light">Homestay & Quán cafe</div>
            </div>
          </Col>
          
          <Col xs={12} sm={4} md={3} className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-white bg-opacity-10 fs-4 text-info">
              <FaHiking />
            </div>
            <div>
              <div className="fw-bold fs-4 text-white">10.000+</div>
              <div className="small text-light">Phượt thủ đồng hành</div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
