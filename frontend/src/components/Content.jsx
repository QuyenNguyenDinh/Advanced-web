import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import api from '../services/api';
import {
  FaStar,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaRoute,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaBed,
  FaUtensils,
  FaCamera,
  FaBus,
  FaInfoCircle,
  FaRedo,
  FaSearch
} from 'react-icons/fa';

// Dữ liệu mẫu dự phòng khi backend chưa bật
const FALLBACK_DESTINATIONS = [
  {
    id: 1,
    slug: 'ta-xua',
    name: 'Tà Xùa - Thiên đường mây Bắc Yên',
    description: 'Xã vùng cao thuộc huyện Bắc Yên, Sơn La, nổi tiếng với biển mây cuồn cuộn quanh năm và Sống lưng khủng long Háng Đồng hùng vĩ.',
    cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    best_months: 'Tháng 10 - Tháng 4',
    difficulty: 'Dễ',
    how_to_get_there: 'Xe khách giường nằm từ bến Mỹ Đình/Yên Nghĩa lên Bắc Yên (~250k), sau đó thuê xe máy hoặc xe ôm lên Tà Xùa.',
    warnings: 'Đường dốc quanh co có sương mù dày đặc vào sáng sớm. Nên đi xe số hoặc tay côn, hạn chế đi xe ga.',
    avg_budget: '1.200.000 - 1.800.000 VNĐ / người',
    is_featured: true,
    places: [
      { name: 'Mây Lang Thang Homestay', type: 'stay', avg_rating: 4.8, price_range: '300.000 - 650.000 VNĐ' },
      { name: 'Tiệm Cà Phê Mị Ơi', type: 'eat', avg_rating: 4.7, price_range: '35.000 - 60.000 VNĐ' },
      { name: 'Sống Lưng Khủng Long Háng Đồng', type: 'checkin', avg_rating: 4.9, price_range: 'Miễn phí' },
      { name: 'Khánh Thịnh Limousine', type: 'transport', avg_rating: 4.6, price_range: '250.000 VNĐ' }
    ]
  },
  {
    id: 2,
    slug: 'ha-giang',
    name: 'Hà Giang - Cung đường hạnh phúc',
    description: 'Vùng đất địa đầu tổ quốc với cao nguyên đá Đồng Văn hùng vĩ, đèo Mã Pí Lèng hiểm trở và dòng sông Nho Quế xanh ngọc bích.',
    cover_image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    best_months: 'Tháng 9 - Tháng 12',
    difficulty: 'Trung bình',
    how_to_get_there: 'Xe cung điện/limousine từ Hà Nội lên TP Hà Giang (~300k - 350k). Thuê xe máy chạy cung đường Loop Đồng Văn - Mèo Vạc.',
    warnings: 'Đèo dốc đứng và nhiều cua tay áo nguy hiểm. Mùa mưa dễ có nguy cơ sạt lở đá.',
    avg_budget: '2.000.000 - 3.200.000 VNĐ / người',
    is_featured: true,
    places: [
      { name: 'Bụi Homestay Đồng Văn', type: 'stay', avg_rating: 4.9, price_range: '250.000 - 500.000 VNĐ' },
      { name: 'Thuyền Sông Nho Quế', type: 'checkin', avg_rating: 4.9, price_range: '120.000 VNĐ/vé' },
      { name: 'Quán Thắng Cố Chợ Đồng Văn', type: 'eat', avg_rating: 4.6, price_range: '50.000 - 150.000 VNĐ' }
    ]
  },
  {
    id: 3,
    slug: 'moc-chau',
    name: 'Mộc Châu - Thảo nguyên xanh ngút ngàn',
    description: 'Nổi tiếng với những đồi chè trái tim bát ngát, thung lũng mận Nà Ka trắng muốt mùa hoa và thác Dải Yếm thơ mộng.',
    cover_image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    best_months: 'Tháng 1 - Tháng 3',
    difficulty: 'Dễ',
    how_to_get_there: 'Xe khách từ bến Mỹ Đình ~180k - 220k hoặc tự lái xe máy theo QL6.',
    warnings: 'Sương mù dày đặc đèo Thung Khe vào buổi sáng sớm và đêm.',
    avg_budget: '1.000.000 - 1.500.000 VNĐ / người',
    is_featured: false,
    places: [
      { name: 'Đồi chè Trái Tim', type: 'checkin', avg_rating: 4.7, price_range: 'Miễn phí' },
      { name: 'Nhà Ta Homestay', type: 'stay', avg_rating: 4.8, price_range: '300.000 - 600.000 VNĐ' }
    ]
  }
];

export default function Content({ searchTerm }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // FETCH DỮ LIỆU BẰNG AXIOS TỪ BACKEND NESTJS
  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/destinations');
      if (response.data && response.data.data && response.data.data.length > 0) {
        setDestinations(response.data.data);
      } else {
        setDestinations(FALLBACK_DESTINATIONS);
      }
    } catch (err) {
      console.warn('Không thể kết nối Backend NestJS, sử dụng dữ liệu mẫu:', err.message);
      setError('Chưa kết nối được với Backend (Hãy đảm bảo Backend NestJS đang chạy để nạp dữ liệu từ PostgreSQL).');
      setDestinations(FALLBACK_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Lọc dữ liệu theo từ khóa tìm kiếm và nút lọc
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'FEATURED') return dest.is_featured === true || dest.is_featured === 'true';
    if (activeFilter === 'EASY') return dest.difficulty?.toLowerCase().includes('dễ');
    if (activeFilter === 'MEDIUM') return dest.difficulty?.toLowerCase().includes('trung bình');
    return true;
  });

  const handleOpenDetail = (dest) => {
    setSelectedDestination(dest);
    setShowModal(true);
  };

  const getPlaceIcon = (type) => {
    switch (type) {
      case 'stay': return <FaBed className="text-primary" />;
      case 'eat': return <FaUtensils className="text-danger" />;
      case 'checkin': return <FaCamera className="text-warning" />;
      case 'transport': return <FaBus className="text-success" />;
      default: return <FaMapMarkerAlt className="text-secondary" />;
    }
  };

  return (
    <section className="py-5" id="destinations">
      <Container>
        {/* Tiêu đề & Bộ lọc */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="text-success fw-bold text-uppercase small tracking-wide">
              Điểm hẹn mây ngàn
            </span>
            <h2 className="fw-extrabold fs-2 mt-1 mb-0" style={{ color: '#0f172a' }}>
              Điểm Đến Nổi Bật Dành Cho Bạn
            </h2>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ALL')}
            >
              Tất cả ({destinations.length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'FEATURED' ? 'active' : ''}`}
              onClick={() => setActiveFilter('FEATURED')}
            >
              ⭐ Nổi bật
            </button>
            <button
              className={`filter-btn ${activeFilter === 'EASY' ? 'active' : ''}`}
              onClick={() => setActiveFilter('EASY')}
            >
              Độ khó: Dễ
            </button>
            <button
              className={`filter-btn ${activeFilter === 'MEDIUM' ? 'active' : ''}`}
              onClick={() => setActiveFilter('MEDIUM')}
            >
              Độ khó: Trung bình
            </button>
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-circle d-flex align-items-center justify-content-center p-2"
              title="Tải lại dữ liệu từ API"
              onClick={fetchDestinations}
            >
              <FaRedo className={loading ? 'fa-spin' : ''} />
            </Button>
          </div>
        </div>

        {/* Thông báo nếu chạy chế độ fallback */}
        {error && (
          <Alert variant="info" className="d-flex align-items-center gap-2 py-2 px-3 rounded-4 mb-4 small">
            <FaInfoCircle className="fs-5 flex-shrink-0" />
            <div>{error}</div>
          </Alert>
        )}

        {/* Trạng thái Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted fw-semibold">Đang tải dữ liệu từ API Backend...</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
            <FaSearch className="fs-1 text-muted mb-3" />
            <h5 className="fw-bold">Không tìm thấy điểm đến nào phù hợp</h5>
            <p className="text-muted">Hãy thử tìm với từ khóa khác hoặc bấm nút Tất cả để xem lại.</p>
            <Button variant="success" onClick={() => { setActiveFilter('ALL'); }}>
              Xem tất cả điểm đến
            </Button>
          </div>
        ) : (
          /* Danh sách thẻ Card */
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredDestinations.map((dest) => (
              <Col key={dest.id || dest.slug}>
                <Card className="destination-card">
                  {/* Ảnh cover & Badges */}
                  <div className="card-img-wrapper">
                    <img
                      src={dest.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                      alt={dest.name}
                      loading="lazy"
                    />
                    {(dest.is_featured === true || dest.is_featured === 'true') && (
                      <span className="card-featured-badge">
                        <FaStar /> Điểm Hot
                      </span>
                    )}
                    <span className="card-difficulty-badge">
                      {dest.difficulty || 'Dễ'}
                    </span>
                  </div>

                  {/* Nội dung Card */}
                  <div className="card-body-custom">
                    <h3 className="destination-name">{dest.name}</h3>
                    <p className="destination-desc">{dest.description}</p>

                    <div className="meta-row">
                      <div className="meta-item">
                        <FaCalendarAlt />
                        <span><strong>Mùa đẹp:</strong> {dest.best_months || 'Quanh năm'}</span>
                      </div>
                      <div className="meta-item">
                        <FaMoneyBillWave />
                        <span><strong>Chi phí:</strong> {dest.avg_budget || '1.000.000 - 2.000.000 VNĐ'}</span>
                      </div>
                    </div>

                    <Button
                      className="btn-explore mt-auto"
                      onClick={() => handleOpenDetail(dest)}
                    >
                      Xem chi tiết & Dịch vụ
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Modal Chi tiết Điểm đến */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        {selectedDestination && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold fs-4 text-success">
                {selectedDestination.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-3">
              <div className="rounded-4 overflow-hidden mb-3" style={{ maxHeight: '300px' }}>
                <img
                  src={selectedDestination.cover_image}
                  alt={selectedDestination.name}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              <h6 className="fw-bold text-dark mb-2">Giới thiệu tổng quan:</h6>
              <p className="text-secondary">{selectedDestination.description}</p>

              {/* Cách di chuyển & Lưu ý */}
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold text-success d-flex align-items-center gap-2">
                      <FaRoute /> Cách di chuyển
                    </h6>
                    <small className="text-muted">
                      {selectedDestination.how_to_get_there || 'Đang cập nhật lộ trình chi tiết...'}
                    </small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 h-100">
                    <h6 className="fw-bold text-warning d-flex align-items-center gap-2">
                      <FaExclamationTriangle /> Lưu ý an toàn
                    </h6>
                    <small className="text-dark">
                      {selectedDestination.warnings || 'Chuẩn bị trang phục ấm và kiểm tra xe trước khi khởi hành.'}
                    </small>
                  </div>
                </Col>
              </Row>

              {/* Danh sách địa điểm dịch vụ (places) */}
              {selectedDestination.places && selectedDestination.places.length > 0 && (
                <div className="mt-4">
                  <h6 className="fw-bold text-dark mb-3">Địa điểm lưu trú & Trải nghiệm gợi ý:</h6>
                  <div className="d-flex flex-column gap-2">
                    {selectedDestination.places.map((place, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center justify-content-between p-2 px-3 border rounded-3 bg-white"
                      >
                        <div className="d-flex align-items-center gap-2">
                          {getPlaceIcon(place.type)}
                          <span className="fw-semibold">{place.name}</span>
                          <Badge bg="light" text="dark" className="border">
                            {place.price_range}
                          </Badge>
                        </div>
                        {place.avg_rating > 0 && (
                          <span className="text-warning fw-bold small d-flex align-items-center gap-1">
                            <FaStar /> {place.avg_rating}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="rounded-pill px-4">
                Đóng
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  );
}
