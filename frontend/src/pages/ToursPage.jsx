import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import {
  FaMountain,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaStar,
  FaClock
} from 'react-icons/fa';

const TOURS_DATA = [
  {
    id: 1,
    name: 'Trekking Tà Xùa - Chinh Phục Sống Lưng Khủng Long & Đỉnh U Bò',
    location: 'Bắc Yên, Sơn La',
    elevation: '2.865m',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Dễ - Vừa sức',
    difficultyColor: 'success',
    price: '1.850.000',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Trải nghiệm cắm trại đón bình minh trên biển mây Tà Xùa bồng bềnh 360 độ, check-in Mỏm Cá Heo và Cây Cô Đơn huyền thoại.',
    highlights: ['Săn biển mây cuồn cuộn lúc 5h30 sáng', 'Lẩu gà đen & thịt lợn bản nướng than hồng', 'Porter dẫn đường kiêm thợ ảnh có tâm'],
    rating: 4.9,
    reviews: 342
  },
  {
    id: 2,
    name: 'Trekking Lảo Thẩn - Nóc Nhà Y Tý Mùa Mây & Hoàng Hôn Dát Vàng',
    location: 'Bát Xát, Lào Cai',
    elevation: '2.860m',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Dễ (Người mới đi được)',
    difficultyColor: 'info',
    price: '2.150.000',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Cung trekking lý tưởng nhất cho người bắt đầu. Đường dốc thoai thoải qua đồi cỏ cháy, ngắm hoàng hôn dát vàng biển mây trên đỉnh Lảo Thẩn.',
    highlights: ['Lán gỗ ấm cúng của người Mông', 'Check-in Mỏm đá Câu Cá sống ảo kinh điển', 'Săn mây xác suất cao >92% từ tháng 10 - tháng 4'],
    rating: 5.0,
    reviews: 418
  },
  {
    id: 3,
    name: 'Trekking Fansipan - Nóc Nhà Đông Dương Đường Bộ Trạm Tôn',
    location: 'Sa Pa, Lào Cai',
    elevation: '3.143m',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Trung bình',
    difficultyColor: 'warning',
    price: '2.450.000',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    description: 'Chinh phục cột mốc cao nhất Tổ quốc bằng chính đôi chân mình. Băng qua rừng trúc nguyên sinh và ngắm mây cuồn cuộn vách đá Trạm Tôn.',
    highlights: ['Chạm tay vào chóp inox 3.143m kiêu hãnh', 'Nghỉ đêm tại lán 2.800m ăn lẩu cá tầm Sa Pa', 'Cấp chứng nhận & huy chương chinh phục đỉnh'],
    rating: 4.9,
    reviews: 520
  },
  {
    id: 4,
    name: 'Trekking Ky Quan San (Bạch Mộc Lương Tử) - Săn Bình Minh Đồi Muối',
    location: 'Bát Xát (Lào Cai) - Phong Thổ (Lai Châu)',
    elevation: '3.046m',
    duration: '3 Ngày 2 Đêm',
    difficulty: 'Thử thách cao',
    difficultyColor: 'danger',
    price: '2.890.000',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    description: 'Một trong 4 đỉnh núi cao và hiểm trở nhất Việt Nam. Nổi tiếng với biển mây bất tận và bình minh trên Đồi Muối đẹp ngỡ ngàng.',
    highlights: ['Bình minh đỏ rực xuyên qua biển mây Đồi Muối', 'Vượt dốc Ba Giờ & sống lưng hiểm trở', 'Rừng rêu ma mị và suối trong vắt'],
    rating: 4.8,
    reviews: 215
  },
  {
    id: 5,
    name: 'Trekking Tà Chì Nhù - Đại Dương Mây & Đồi Hoa Tím Chi Pâu',
    location: 'Trạm Tấu, Yên Bái',
    elevation: '2.979m',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Trung bình - Dốc liên tục',
    difficultyColor: 'warning',
    price: '2.250.000',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    description: 'Ngọn núi mệnh danh vương quốc của mây và gió. Mùa thu phủ kín hoa Chi Pâu tím biếc giữa biển mây trắng ngút ngàn.',
    highlights: ['Thảo nguyên hoa tím Chi Pâu tháng 9 - 10', 'Biển mây vây quanh lán 2.400m', 'Tắm suối khoáng nóng Trạm Tấu hồi phục sức khỏe'],
    rating: 4.9,
    reviews: 289
  },
  {
    id: 6,
    name: 'Trekking Ngũ Chỉ Sơn - Đệ Nhất Hùng Quan Tây Bắc',
    location: 'Tam Đường, Lai Châu / Sa Pa',
    elevation: '2.858m',
    duration: '2 Ngày 1 Đêm',
    difficulty: 'Thử thách kỹ thuật',
    difficultyColor: 'danger',
    price: '2.350.000',
    image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=800&q=80',
    description: 'Năm ngón tay chĩa thẳng lên trời xanh giữa biển mây hùng vĩ. Cung đường leo thang dây và vách đá dành cho trekker đam mê cảm giác mạnh.',
    highlights: ['Leo vách đá dựng đứng cực kỳ phấn khích', 'Rừng đỗ quyên cổ thụ ngàn năm rực rỡ', 'Tầm nhìn ngoạn mục sang đèo Ô Quy Hồ'],
    rating: 4.9,
    reviews: 174
  }
];

export default function ToursPage() {
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    people: '1',
    note: ''
  });

  const handleOpenBooking = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setBookingSuccess(false);
      setFormData({ name: '', phone: '', date: '', people: '1', note: '' });
    }, 1800);
  };

  const filteredTours = TOURS_DATA.filter((tour) => {
    if (filterDifficulty === 'ALL') return true;
    if (filterDifficulty === 'EASY') return tour.difficulty.toLowerCase().includes('dễ');
    if (filterDifficulty === 'MEDIUM') return tour.difficulty.toLowerCase().includes('trung bình');
    if (filterDifficulty === 'HARD') return tour.difficulty.toLowerCase().includes('thử thách');
    return true;
  });

  return (
    <div className="py-5 min-vh-100" style={{ backgroundColor: 'transparent' }}>
      <Container>
        {/* Hero Banner Header */}
        <div
          className="rounded-4 p-4 p-md-5 mb-5 text-white position-relative overflow-hidden shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #065f46 0%, #0f766e 55%, #0284c7 100%)',
            boxShadow: '0 12px 35px rgba(15, 118, 110, 0.25)'
          }}
        >
          <div style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>
              <FaMountain /> TOUR TREKKING SĂN MÂY CHUYÊN NGHIỆP
            </div>
            <h1 className="fw-bold display-6 mb-3">
              Chinh Phục Đỉnh Cao & <br />
              <span style={{ color: '#fef08a' }}>Đại Dương Mây Ngàn</span>
            </h1>
            <p className="text-white-50 mb-4" style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.9)' }}>
              Đồng hành cùng đội ngũ Leader & Porter bản địa dày dạn kinh nghiệm. Đảm bảo an toàn tuyệt đối, đồ ăn nóng sốt và những khoảnh khắc săn mây để đời.
            </p>

            <div className="d-flex flex-wrap gap-4 pt-2">
              <div className="d-flex align-items-center gap-2">
                <FaShieldAlt style={{ color: '#a7f3d0', fontSize: '20px' }} />
                <span className="small">Bảo hiểm 100tr/vụ</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaUsers style={{ color: '#fde047', fontSize: '20px' }} />
                <span className="small">Porter 1 kèm 2-3 khách</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaStar style={{ color: '#fde047', fontSize: '20px' }} />
                <span className="small">4.9/5 ⭐ (1.250+ Trekker)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Danh Sách Tour Trekking</h3>
            <p className="small mb-0" style={{ color: '#475569' }}>Chọn cung đường phù hợp với thể lực và quỹ thời gian của bạn</p>
          </div>

          <div className="d-flex gap-2">
            {[
              { id: 'ALL', label: 'Tất cả tour' },
              { id: 'EASY', label: 'Dễ (Newbie)' },
              { id: 'MEDIUM', label: 'Vừa sức' },
              { id: 'HARD', label: 'Thử thách cao' }
            ].map((btn) => (
              <Button
                key={btn.id}
                variant="outline-secondary"
                className={`rounded-pill px-3 py-1 small fw-semibold`}
                style={
                  filterDifficulty === btn.id
                    ? { backgroundColor: '#ea580c', borderColor: '#ea580c', color: '#ffffff', boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)' }
                    : { background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }
                }
                onClick={() => setFilterDifficulty(btn.id)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        <Row className="g-4">
          {filteredTours.map((tour) => (
            <Col lg={4} md={6} key={tour.id}>
              <Card
                className="h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column hover-lift"
                style={{ background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.95)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={tour.image}
                    alt={tour.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      gap: '6px'
                    }}
                  >
                    <Badge bg={tour.difficultyColor} className="px-2 py-1 rounded-pill">
                      {tour.difficulty}
                    </Badge>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(8px)',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: '1px solid rgba(226, 232, 240, 0.9)',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <FaMountain className="me-1 text-warning" /> {tour.elevation}
                  </div>
                </div>

                <Card.Body className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <div className="d-flex align-items-center gap-1 small mb-2" style={{ color: '#64748b' }}>
                      <FaMapMarkerAlt style={{ color: '#ea580c' }} />
                      <span>{tour.location}</span>
                      <span className="mx-1">•</span>
                      <FaClock style={{ color: '#f59e0b' }} />
                      <span>{tour.duration}</span>
                    </div>

                    <h5 className="fw-bold mb-2" style={{ color: '#0f172a', lineHeight: 1.4, fontSize: '1.1rem' }}>
                      {tour.name}
                    </h5>

                    <p className="small mb-3" style={{ lineHeight: 1.6, color: '#475569' }}>
                      {tour.description}
                    </p>

                    <div className="mb-3">
                      {tour.highlights.map((h, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 mb-1" style={{ fontSize: '12.5px', color: '#334155' }}>
                          <FaCheckCircle style={{ color: '#059669', marginTop: '3px', flexShrink: 0 }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-top border-light-subtle d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted small d-block">Giá trọn gói từ</span>
                      <span className="fw-bold fs-5" style={{ color: '#ea580c' }}>
                        {tour.price} <small className="fs-6 fw-normal text-muted">đ/người</small>
                      </span>
                    </div>

                    <Button
                      className="rounded-pill px-3 py-2 fw-bold text-white border-0 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 14px rgba(234, 88, 12, 0.28)' }}
                      onClick={() => handleOpenBooking(tour)}
                    >
                      Đặt Tour
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 overflow-hidden shadow-lg">
        <div style={{ background: '#ffffff', color: '#0f172a' }}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5" style={{ color: '#0f172a' }}>
              Đăng Ký Tư Vấn: {selectedTour?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {bookingSuccess ? (
              <Alert variant="success" className="text-center rounded-3">
                <FaCheckCircle className="fs-2 mb-2 text-success" />
                <h5 className="fw-bold">Gửi yêu cầu thành công!</h5>
                <p className="mb-0 small">Đội ngũ Tripaholic sẽ liên hệ tư vấn lịch trình và giữ chỗ cho bạn trong vòng 15 phút.</p>
              </Alert>
            ) : (
              <Form onSubmit={handleBookingSubmit}>
                <div className="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div>
                    <small className="text-muted d-block">Thời lượng: {selectedTour?.duration}</small>
                    <strong style={{ color: '#0f172a' }}>{selectedTour?.location}</strong>
                  </div>
                  <span className="fw-bold fs-5" style={{ color: '#ea580c' }}>
                    {selectedTour?.price} đ
                  </span>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Họ và tên của bạn *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="text-white"
                    style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-light">Số điện thoại / Zalo *</Form.Label>
                  <Form.Control
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    className="text-white"
                    style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-light">Ngày dự kiến đi</Form.Label>
                      <Form.Control
                        type="date"
                        className="text-white"
                        style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-light">Số lượng người</Form.Label>
                      <Form.Select
                        className="text-white"
                        style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                        value={formData.people}
                        onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                      >
                        <option value="1">1 người</option>
                        <option value="2">2 người</option>
                        <option value="3-5">3 - 5 người</option>
                        <option value="6+">Đoàn trên 6 người</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-light">Ghi chú thêm</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Yêu cầu riêng, đón tại Hà Nội..."
                    className="text-white"
                    style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="warning"
                  className="w-100 rounded-pill py-2 fw-bold text-white shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', borderColor: 'transparent' }}
                >
                  Gửi Yêu Cầu Giữ Chỗ Ngay
                </Button>
              </Form>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
}
