import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Breadcrumb, Modal } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { destinationService } from '../services/destination.service';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaStar,
  FaRoute,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaThLarge,
  FaList,
  FaCloud,
  FaCompass,
  FaCheckCircle,
  FaDirections,
  FaHeart
} from 'react-icons/fa';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bộ lọc danh mục địa điểm (ăn gì, chơi gì, ở đâu)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'list'

  // Modal chi tiết địa điểm khi click xem
  const [activePlaceModal, setActivePlaceModal] = useState(null);
  const [savedToNotebook, setSavedToNotebook] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await destinationService.getById(id);
        if (res?.data) {
          setDestination(res.data);
        } else {
          setError('Không tìm thấy thông tin điểm đến này.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải chi tiết điểm đến từ API.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted fw-semibold">Đang chuẩn bị cẩm nang điểm đến & tọa độ trải nghiệm...</p>
      </Container>
    );
  }

  if (error || !destination) {
    return (
      <Container className="py-5 text-center min-vh-100">
        <Alert variant="danger" className="rounded-4 p-4 max-w-600 mx-auto">
          <h4>Có lỗi xảy ra</h4>
          <p>{error || 'Điểm đến không tồn tại hoặc đã bị xóa.'}</p>
          <Button as={Link} to="/destinations" variant="outline-danger" className="rounded-pill px-4">
            Quay lại danh sách điểm đến
          </Button>
        </Alert>
      </Container>
    );
  }

  const places = destination.places || [];

  // Lọc địa điểm theo tab danh mục
  const filteredPlaces = places.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="pb-5 min-vh-100" style={{ backgroundColor: 'transparent' }}>
      {/* ==========================================================
          1. HERO COVER BANNER TOÀN CẢNH
          ========================================================== */}
      <div
        className="position-relative"
        style={{
          minHeight: '440px',
          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(2,6,23,0.85) 100%), url(${destination.cover_image || '/images/destination_banner.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          paddingTop: '85px',
          paddingBottom: '60px'
        }}
      >
        <Container className="h-100 d-flex flex-column justify-content-between">
          <Breadcrumb className="bg-transparent p-0 m-0 mb-4">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }} className="text-white opacity-75">
              Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/destinations' }} className="text-white opacity-75">
              Điểm đến
            </Breadcrumb.Item>
            <Breadcrumb.Item active className="text-warning fw-bold">
              {destination.name}
            </Breadcrumb.Item>
          </Breadcrumb>

          <div>
            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
              {destination.region && (
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '5px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <FaMapMarkerAlt style={{ color: '#ea580c' }} /> {destination.region}
                </span>
              )}
              {destination.elevation && (
                <Badge bg="info" className="px-3 py-2 rounded-pill fs-6 fw-bold">
                  🏔️ Độ cao: {destination.elevation}
                </Badge>
              )}
              {destination.cloud_chance && (
                <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fs-6 fw-bold">
                  ☁️ Tỷ lệ săn mây: {destination.cloud_chance}
                </Badge>
              )}
              {(destination.is_featured === true || destination.is_featured === 'true') && (
                <Badge bg="danger" className="px-3 py-2 rounded-pill fs-6 fw-bold">
                  ⭐ Điểm Đến Hot Nhất
                </Badge>
              )}
            </div>

            <h1
              className="fw-extrabold display-5 mb-2 text-white"
              style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                textShadow: '0 3px 12px rgba(0,0,0,0.5)'
              }}
            >
              {destination.name}
            </h1>
            <p
              className="fs-5 text-light opacity-90 max-w-800"
              style={{ maxWidth: '780px', lineHeight: 1.6, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
            >
              {destination.description}
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-n4 position-relative" style={{ zIndex: 10 }}>
        {/* ==========================================================
            2. THANH THÔNG TIN TỔNG QUAN (Thời điểm, Ngân sách, Cung đường)
            ========================================================== */}
        <Card
          className="border-0 rounded-4 p-4 mb-5"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)'
          }}
        >
          <Row className="g-4 text-center text-md-start">
            <Col xs={12} sm={4} className="border-end-md">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                <div
                  className="p-3 rounded-circle fs-3 flex-shrink-0"
                  style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}
                >
                  <FaCalendarAlt />
                </div>
                <div>
                  <div className="text-muted small fw-semibold">Thời điểm lý tưởng</div>
                  <div className="fw-bold fs-5 text-dark">{destination.best_months || 'Quanh năm'}</div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={4} className="border-end-md">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                <div
                  className="p-3 rounded-circle fs-3 flex-shrink-0"
                  style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c' }}
                >
                  <FaMoneyBillWave />
                </div>
                <div>
                  <div className="text-muted small fw-semibold">Ngân sách dự tính</div>
                  <div className="fw-bold fs-5" style={{ color: '#ea580c' }}>
                    {destination.avg_budget || '1.200.000 - 2.000.000 VNĐ'}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={4}>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                <div
                  className="p-3 rounded-circle fs-3 flex-shrink-0"
                  style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}
                >
                  <FaRoute />
                </div>
                <div>
                  <div className="text-muted small fw-semibold">Mức độ cung đường</div>
                  <div className="fw-bold fs-5 text-dark">{destination.difficulty || 'Trung bình'}</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* ==========================================================
            3. PHẦN TỌA ĐỘ TRẢI NGHIỆM KHÔNG THỂ BỎ LỠ (Ăn gì, chơi gì, ở đâu)
            THIẾT KẾ CHUẨN XÁC THEO ẢNH USER GỬI (Screenshot 2)
            ========================================================== */}
        <section className="mb-5">
          {/* Thanh phân loại tab & Chuyển đổi Grid/List */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            {/* Filter Pills */}
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
                style={{
                  background: selectedCategory === 'all' ? '#0f172a' : '#ffffff',
                  borderColor: selectedCategory === 'all' ? '#0f172a' : '#cbd5e1',
                  color: selectedCategory === 'all' ? '#ffffff' : '#334155'
                }}
              >
                Tất Cả ({String(places.length).padStart(2, '0')})
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'stay' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('stay')}
              >
                Lưu trú & Glamping
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'eat' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('eat')}
              >
                Ăn uống & Ẩm thực
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'cafe' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('cafe')}
              >
                Cà phê ngắm cảnh
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'checkin' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('checkin')}
              >
                Check-in & Viewpoint
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'trekking' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('trekking')}
              >
                Hoạt động & Trekking
              </button>
              <button
                className={`filter-btn ${selectedCategory === 'transport' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('transport')}
              >
                Cách di chuyển
              </button>
            </div>

            {/* View Switcher */}
            <div className="d-flex align-items-center gap-2 align-self-end align-self-lg-center">
              <span className="text-muted small fw-bold" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
                XEM THEO:
              </span>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm p-2 rounded-2 ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`}
                title="Dạng lưới"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-sm p-2 rounded-2 ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-secondary'}`}
                title="Dạng danh sách"
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Section Header: Eyebrow + Heading + Subtitle */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <div
                style={{
                  color: '#ea580c',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>•</span> ĐỊA ĐIỂM CHỌN LỌC ĐỘC BẢN
              </div>
              <h2
                className="fw-bold mb-0"
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '1.9rem',
                  color: '#0f172a'
                }}
              >
                Tọa độ trải nghiệm không thể bỏ lỡ
              </h2>
            </div>
            <p className="text-muted mb-0 small mt-2 mt-md-0">
              Được biên soạn từ 1.400+ đánh giá thực tế của phượt thủ Xê Dịch
            </p>
          </div>

          {/* Grid hiển thị các địa điểm thực tế */}
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 border p-4">
              <h5 className="text-muted mb-2">Chưa có địa điểm nào thuộc danh mục này.</h5>
              <Button
                variant="outline-dark"
                size="sm"
                className="rounded-pill px-3"
                onClick={() => setSelectedCategory('all')}
              >
                Xem tất cả ({places.length}) địa điểm
              </Button>
            </div>
          ) : (
            <Row xs={1} md={viewMode === 'grid' ? 2 : 1} lg={viewMode === 'grid' ? 3 : 1} className="g-4">
              {filteredPlaces.map((place) => (
                <Col key={place.id}>
                  <Card
                    className="h-100 border-0 rounded-4 overflow-hidden"
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(226, 232, 240, 0.95)',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 16px 36px rgba(15, 23, 42, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.05)';
                    }}
                    onClick={() => setActivePlaceModal(place)}
                  >
                    {/* Hình ảnh & Các Badge bao quanh ảnh */}
                    <div
                      style={{
                        height: viewMode === 'grid' ? '210px' : '240px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={place.image || destination.cover_image}
                        alt={place.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                      />

                      {/* Top-left: Category badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(15, 23, 42, 0.82)',
                          backdropFilter: 'blur(8px)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {place.category_name || 'Tọa độ thực tế'}
                      </span>

                      {/* Top-right: Rating badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(255, 255, 255, 0.96)',
                          backdropFilter: 'blur(8px)',
                          color: '#0f172a',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                        }}
                      >
                        <FaStar style={{ color: '#f59e0b', fontSize: '11px' }} />
                        <span>{place.rating || 4.9}</span>
                        <span style={{ color: '#64748b', fontWeight: 500, fontSize: '10.5px' }}>
                          ({place.review_count || '250+'})
                        </span>
                      </span>

                      {/* Bottom-left: Location tag */}
                      {place.location_tag && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            background: 'rgba(15, 23, 42, 0.85)',
                            backdropFilter: 'blur(8px)',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FaMapMarkerAlt style={{ color: '#ea580c', fontSize: '10px' }} />
                          {place.location_tag}
                        </span>
                      )}

                      {/* Bottom-right: Highlight tag */}
                      {place.highlight_tag && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            background: 'linear-gradient(135deg, #c2410c, #9a3412)',
                            color: '#ffffff',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                          }}
                        >
                          {place.highlight_tag}
                        </span>
                      )}
                    </div>

                    {/* Nội dung thông tin địa điểm */}
                    <Card.Body className="d-flex flex-column p-4">
                      <h4
                        className="fw-bold mb-2"
                        style={{
                          fontSize: '1.2rem',
                          color: '#0f172a',
                          lineHeight: 1.35
                        }}
                      >
                        {place.name}
                      </h4>

                      <p
                        className="text-muted mb-4"
                        style={{
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {place.description}
                      </p>

                      {/* Footer Row: Giá tiền & Nút CTA */}
                      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#64748b',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            {place.price_label || 'Chi phí tham khảo'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 800,
                              color: '#c2410c'
                            }}
                          >
                            {place.price_value || 'Liên hệ'}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-dark rounded-pill px-3 py-1 fw-bold text-white d-flex align-items-center gap-1"
                          style={{
                            fontSize: '0.82rem',
                            background: '#0f172a',
                            border: 'none',
                            transition: 'all 0.2s'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePlaceModal(place);
                          }}
                        >
                          {place.cta_text || 'Chi tiết →'}
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>

        {/* ==========================================================
            4. HƯỚNG DẪN DI CHUYỂN, AN TOÀN & ĐẶT VÉ
            ========================================================== */}
        <Row className="g-4 mt-2">
          <Col lg={8}>
            <Card
              className="border-0 rounded-4 p-4 mb-4"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
              }}
            >
              <h4 className="fw-bold text-dark mb-3">Kinh nghiệm thực địa & Lưu ý hành trình</h4>

              <div className="d-flex flex-column gap-3">
                <div
                  className="p-3 rounded-3 border-start border-4 border-success"
                  style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}
                >
                  <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-1">
                    <FaRoute /> Cách di chuyển & Thuê phương tiện:
                  </h6>
                  <p className="mb-0 small" style={{ color: '#166534', lineHeight: 1.6 }}>
                    {destination.how_to_get_there ||
                      'Đi xe khách hoặc Limousine từ Hà Nội lên trung tâm thị trấn, sau đó thuê xe máy chuyên đổ đèo (Wave, Blade, côn tay) để chủ động di chuyển vào các bản làng.'}
                  </p>
                </div>

                <div
                  className="p-3 rounded-3 border-start border-4 border-warning"
                  style={{ background: '#fffbeb', border: '1px solid #fef3c7' }}
                >
                  <h6 className="fw-bold text-warning d-flex align-items-center gap-2 mb-1" style={{ color: '#b45309' }}>
                    <FaExclamationTriangle /> Cảnh báo an toàn & Thời tiết vùng cao:
                  </h6>
                  <p className="mb-0 small" style={{ color: '#92400e', lineHeight: 1.6 }}>
                    {destination.warnings ||
                      'Cung đèo nhiều dốc đứng và khúc cua gắt, sương mù dày lúc 5h-7h sáng. Chú ý đi số thấp khi đổ đèo và mang theo áo ấm giữ nhiệt.'}
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          {/* Cột phải: CTA Lưu Sổ Tay & Điều Hướng */}
          <Col lg={4}>
            <Card
              className="border-0 rounded-4 p-4 sticky-top"
              style={{
                top: '90px',
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)'
              }}
            >
              <h5 className="fw-bold mb-2 text-dark">Lên Lịch Trình Khám Phá</h5>
              <p className="text-muted small mb-4">
                Lưu lại toàn bộ tọa độ ăn chơi tại <strong>{destination.name}</strong> vào sổ tay để tra cứu offline khi đi phượt.
              </p>

              <Button
                className="w-100 py-3 rounded-pill fw-bold mb-3 d-flex align-items-center justify-content-center gap-2 text-white border-0 shadow-sm"
                style={{
                  background: savedToNotebook
                    ? '#16a34a'
                    : 'linear-gradient(135deg, #f97316, #ea580c)',
                  transition: 'all 0.3s'
                }}
                onClick={() => setSavedToNotebook(!savedToNotebook)}
              >
                {savedToNotebook ? (
                  <>
                    <FaCheckCircle /> Đã lưu vào Sổ tay Phượt!
                  </>
                ) : (
                  <>
                    <FaHeart /> Lưu vào Sổ tay Phượt
                  </>
                )}
              </Button>

              <Button
                as={Link}
                to="/destinations"
                variant="outline-secondary"
                className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                style={{ borderColor: '#cbd5e1', color: '#334155' }}
              >
                <FaArrowLeft /> Xem các điểm đến phía Bắc khác
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ==========================================================
          5. MODAL CHI TIẾT ĐỊA ĐIỂM (Xem chi tiết, gọi hotline, chỉ đường)
          ========================================================== */}
      {activePlaceModal && (
        <Modal
          show={!!activePlaceModal}
          onHide={() => setActivePlaceModal(null)}
          size="lg"
          centered
        >
          <div className="position-relative" style={{ height: '280px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
            <img
              src={activePlaceModal.image || destination.cover_image}
              alt={activePlaceModal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={() => setActivePlaceModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0,0,0,0.7)'
              }}
            >
              <Badge bg="warning" text="dark" className="mb-2 px-3 py-1 rounded-pill fw-bold">
                {activePlaceModal.category_name}
              </Badge>
              <h3 className="fw-bold mb-0 text-white">{activePlaceModal.name}</h3>
            </div>
          </div>

          <Modal.Body className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt style={{ color: '#ea580c' }} />
                <span className="fw-bold text-dark">{activePlaceModal.location_tag} ({destination.name})</span>
              </div>
              <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                <FaStar /> {activePlaceModal.rating} ({activePlaceModal.review_count} lượt đánh giá thực tế)
              </div>
            </div>

            <p className="fs-6 leading-relaxed mb-4" style={{ color: '#334155', lineHeight: 1.7 }}>
              {activePlaceModal.description}
            </p>

            <div
              className="p-3 rounded-3 mb-4"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <Row className="g-3">
                <Col sm={6}>
                  <div className="text-muted small">{activePlaceModal.price_label}</div>
                  <div className="fw-bold fs-5" style={{ color: '#ea580c' }}>
                    {activePlaceModal.price_value}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="text-muted small">Hotline liên hệ / Đặt trước</div>
                  <div className="fw-bold fs-6 text-success d-flex align-items-center gap-1">
                    <FaPhoneAlt /> {activePlaceModal.contact_phone || 'Liên hệ bản địa'}
                  </div>
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={() => setActivePlaceModal(null)}
              >
                Đóng
              </Button>
              <Button
                className="rounded-pill px-4 text-white fw-bold border-0 d-flex align-items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                onClick={() => {
                  alert(`Đang mở bản đồ chỉ đường đến ${activePlaceModal.name} (${activePlaceModal.location_tag})!`);
                }}
              >
                <FaDirections /> Mở bản đồ chỉ đường
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
