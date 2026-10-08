import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, ProgressBar } from 'react-bootstrap';
import {
  FaStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaUserCheck
} from 'react-icons/fa';

const INITIAL_FEEDBACKS = [
  {
    id: 1,
    author: 'Nguyễn Hoàng Nam & Nhóm bạn',
    location: 'Hà Nội',
    tour: 'Trekking Tà Xùa 2N1Đ - Sống Lưng Khủng Long',
    rating: 5,
    date: '15/02/2026',
    verified: true,
    likes: 48,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Biển mây vỡ òa lúc 5h30 sáng - Trải nghiệm không bao giờ quên!',
    content:
      'Lần đầu tiên cả nhóm 6 người lên Tà Xùa. Tối hôm trước nghe tiếng gió rít lo lắng cả đêm vì sợ mù sương, ai ngờ 5h30 sáng mở cửa lán ra thì choáng ngợp thực sự! Cả một thung lũng mây trắng bồng bềnh cuộn trào ngay dưới chân. Cảm ơn anh leader Tuấn và anh porter bản địa đã chăm sóc nhóm từng ly từng tí, nướng gà đen thơm nức mũi.',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 2,
    author: 'Lê Phương Thảo',
    location: 'TP. Hồ Chí Minh',
    tour: 'Trekking Lảo Thẩn 2N1Đ - Nóc Nhà Y Tý',
    rating: 5,
    date: '28/01/2026',
    verified: true,
    likes: 62,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Con gái miền Nam một mình ra Bắc trekking - Quá đỗi tự hào!',
    content:
      'Ban đầu mình rất sợ thể lực không đủ vì chỉ quen ngồi văn phòng. Nhưng cung Lảo Thẩn thực sự rất thân thiện, dốc thoai thoải vừa đi vừa ngắm cảnh. Đỉnh cao nhất là hoàng hôn dát vàng trên đồi cỏ cháy, nhìn xuống biển mây đỏ rực mà ứa nước mắt vì đẹp. Các anh trong đoàn hỗ trợ cõng bớt balo, tối ngủ lán gỗ ấm cực kỳ.',
    photos: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 3,
    author: 'Trần Quốc Huy & Mai Linh',
    location: 'Đà Nẵng',
    tour: 'Cung Phượt Hà Giang - Mã Pí Lèng & Sông Nho Quế',
    rating: 5,
    date: '10/01/2026',
    verified: true,
    likes: 35,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    title: 'Hẻm Tu Sản đẹp nghẹt thở, xe máy cào cào chạy cực đầm',
    content:
      'Chuyến đi kỷ niệm 2 năm yêu nhau của tụi mình. Đèo Mã Pí Lèng hùng vĩ đến rợn ngợp. Đoàn tổ chức chèo SUP trên dòng Nho Quế màu xanh ngọc bích cực kỳ chill. Hướng dẫn viên địa phương am hiểu văn hóa người Mông, chỉ toàn quán ăn ngon và góc chụp ảnh độc quyền không chen chúc.',
    photos: []
  },
  {
    id: 4,
    author: 'Vũ Minh Anh',
    location: 'Hải Phòng',
    tour: 'Trekking Ky Quan San (Bạch Mộc Lương Tử) 3N2Đ',
    rating: 5,
    date: '22/12/2025',
    verified: true,
    likes: 54,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Bình minh Đồi Muối xứng đáng là cảnh tượng đẹp nhất thanh xuân',
    content:
      'Chặng leo đêm 3h sáng lên đỉnh săn mặt trời mọc thực sự thử thách ý chí. Nhưng khoảnh khắc vầng dương đỏ rực trồi lên từ biển mây trắng ngắt mênh mông, mọi mệt mỏi tan biến hết. Porter người Mông nấu cơm lam, thịt nướng và trà gừng nóng hồi sức cực nhanh. Chuẩn chỉ từ A đến Z!',
    photos: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 5,
    author: 'Phạm Thu Hà',
    location: 'Hà Nội',
    tour: 'Trekking Fansipan 2N1Đ Đường Bộ Trạm Tôn',
    rating: 5,
    date: '05/12/2025',
    verified: true,
    likes: 41,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    title: 'Chạm tay vào chóp inox 3.143m - Cảm xúc tự hào khó tả',
    content:
      'Đi cáp treo lên đỉnh đã nhiều lần, nhưng cảm giác tự dùng đôi chân vượt qua rừng trúc nguyên sinh và vách đá Trạm Tôn để lên đỉnh nó sướng gấp bội lần. Đội ngũ Tripaholic chuẩn bị đồ bảo hộ, gậy leo núi và lẩu cá tầm tại lán 2.800m trên cả tuyệt vời.',
    photos: []
  }
];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [likedMap, setLikedMap] = useState({});
  const [filterTour, setFilterTour] = useState('ALL');
  const [newFeedback, setNewFeedback] = useState({
    author: '',
    location: '',
    tour: 'Trekking Tà Xùa 2N1Đ - Sống Lưng Khủng Long',
    rating: 5,
    title: '',
    content: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleLike = (id) => {
    setLikedMap((prev) => {
      const isLiked = !!prev[id];
      setFeedbacks((list) =>
        list.map((item) =>
          item.id === id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item
        )
      );
      return { ...prev, [id]: !isLiked };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const createdItem = {
      id: Date.now(),
      author: newFeedback.author,
      location: newFeedback.location || 'Việt Nam',
      tour: newFeedback.tour,
      rating: Number(newFeedback.rating),
      date: new Date().toLocaleDateString('vi-VN'),
      verified: true,
      likes: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      title: newFeedback.title || 'Cảm nhận tuyệt vời về chuyến đi',
      content: newFeedback.content,
      photos: []
    };
    setFeedbacks([createdItem, ...feedbacks]);
    setSubmitted(true);
    setNewFeedback({
      author: '',
      location: '',
      tour: 'Trekking Tà Xùa 2N1Đ - Sống Lưng Khủng Long',
      rating: 5,
      title: '',
      content: ''
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const filteredList = feedbacks.filter((item) => {
    if (filterTour === 'ALL') return true;
    return item.tour.toLowerCase().includes(filterTour.toLowerCase());
  });

  return (
    <div className="py-5 min-vh-100" style={{ backgroundColor: 'transparent' }}>
      <Container>
        {/* Banner Header */}
        <div
          className="rounded-4 p-4 p-md-5 mb-5 text-white position-relative overflow-hidden shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 45%, #f59e0b 100%)',
            boxShadow: '0 12px 35px rgba(234, 88, 12, 0.25)'
          }}
        >
          <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>
              <FaQuoteLeft /> NHẬT KÝ & CẢM NHẬN KHÁCH HÀNG
            </div>
            <h1 className="fw-bold display-6 mb-3">
              Những Bước Chân Thật, <br />
              <span style={{ color: '#fef08a' }}>Cảm Xúc Biển Mây Đích Thực</span>
            </h1>
            <p className="mb-4" style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.92)' }}>
              Đọc những dòng nhật ký chân thực và feedback đánh giá từ hơn 1.250+ trekker đã cùng Tripaholic chinh phục các đỉnh cao Tây Bắc.
            </p>

            <div className="d-flex flex-wrap gap-4 pt-2">
              <div className="d-flex align-items-center gap-2">
                <FaStar style={{ color: '#fef08a', fontSize: '22px' }} />
                <span className="fw-bold fs-5 text-white">4.9 / 5.0</span>
                <span className="small" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>(1.250+ đánh giá)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle style={{ color: '#a7f3d0', fontSize: '20px' }} />
                <span className="small text-white">94.2% Tỉ lệ săn mây thành công</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaUserCheck style={{ color: '#bae6fd', fontSize: '20px' }} />
                <span className="small text-white">100% Đánh giá người thật</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown & Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 text-center d-flex flex-column justify-content-center" style={{ background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.95)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}>
              <h1 className="fw-bold mb-1" style={{ color: '#ea580c', fontSize: '3.5rem' }}>
                4.9
              </h1>
              <div className="d-flex justify-content-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} style={{ color: '#f59e0b', fontSize: '20px' }} />
                ))}
              </div>
              <p className="text-muted small mb-0">Dựa trên 1.250+ đánh giá xác thực từ khách hàng đã trải nghiệm</p>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100" style={{ background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.95)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}>
              <h6 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Chỉ số hài lòng chi tiết</h6>
              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1" style={{ color: '#334155' }}>
                  <span>Chất lượng hướng dẫn viên & Porter bản địa</span>
                  <span className="fw-bold text-success">5.0 / 5.0 (99%)</span>
                </div>
                <ProgressBar variant="success" now={99} style={{ height: '7px' }} />
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1" style={{ color: '#334155' }}>
                  <span>Xác suất săn biển mây & Cảnh sắc ngoạn mục</span>
                  <span className="fw-bold" style={{ color: '#ea580c' }}>4.9 / 5.0 (95%)</span>
                </div>
                <ProgressBar variant="warning" now={95} style={{ height: '7px' }} />
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between small mb-1" style={{ color: '#334155' }}>
                  <span>Chất lượng đồ ăn & Chỗ ngủ nghỉ tại lán</span>
                  <span className="fw-bold text-primary">4.8 / 5.0 (93%)</span>
                </div>
                <ProgressBar variant="info" now={93} style={{ height: '7px' }} />
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1" style={{ color: '#334155' }}>
                  <span>Trang bị an toàn & Hỗ trợ y tế đường trekking</span>
                  <span className="fw-bold text-success">4.9 / 5.0 (98%)</span>
                </div>
                <ProgressBar variant="success" now={98} style={{ height: '7px' }} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filter buttons */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Nhật Ký & Chia Sẻ Từ Khách Trước</h4>
            <p className="small mb-0" style={{ color: '#475569' }}>Lắng nghe kinh nghiệm thực tế trước khi bắt đầu hành trình của bạn</p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'Tất cả feedback' },
              { id: 'Tà Xùa', label: 'Tà Xùa' },
              { id: 'Lảo Thẩn', label: 'Lảo Thẩn (Y Tý)' },
              { id: 'Fansipan', label: 'Fansipan' },
              { id: 'Ky Quan San', label: 'Bạch Mộc Lương Tử' }
            ].map((btn) => (
              <Button
                key={btn.id}
                variant="outline-secondary"
                className={`rounded-pill px-3 py-1 small fw-semibold`}
                style={
                  filterTour === btn.id
                    ? { backgroundColor: '#ea580c', borderColor: '#ea580c', color: '#ffffff', boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)' }
                    : { background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }
                }
                onClick={() => setFilterTour(btn.id)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Feedbacks Grid */}
        <Row className="g-4 mb-5">
          {filteredList.map((item) => (
            <Col lg={6} key={item.id}>
              <Card
                className="border-0 shadow-sm rounded-4 p-4 h-100 d-flex flex-column justify-content-between"
                style={{ background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.95)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)' }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="rounded-circle object-fit-cover shadow-sm"
                        style={{ width: '48px', height: '48px', border: '2px solid #e2e8f0' }}
                      />
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>{item.author}</h6>
                          {item.verified && (
                            <Badge bg="success" className="d-flex align-items-center gap-1 rounded-pill small py-1">
                              <FaCheckCircle style={{ fontSize: '10px' }} /> Đã đi tour
                            </Badge>
                          )}
                        </div>
                        <small className="text-muted">
                          {item.location} • {item.date}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex text-warning">
                      {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="badge rounded-pill" style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', color: '#ea580c', fontSize: '11.5px', padding: '6px 12px' }}>
                      <FaMapMarkerAlt className="me-1 text-danger" /> {item.tour}
                    </span>
                  </div>

                  <h6 className="fw-bold mb-2" style={{ color: '#0f172a', lineHeight: 1.4 }}>
                    "{item.title}"
                  </h6>

                  <p className="small mb-3" style={{ lineHeight: 1.7, fontSize: '13.5px', color: '#475569' }}>
                    {item.content}
                  </p>

                  {item.photos && item.photos.length > 0 && (
                    <div className="d-flex gap-2 mb-3 overflow-hidden rounded-3">
                      {item.photos.map((p, idx) => (
                        <img
                          key={idx}
                          src={p}
                          alt="Ảnh chụp từ khách"
                          style={{
                            width: '120px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
                  <span className="text-muted small">Cảm ơn bạn đã đồng hành cùng Tripaholic</span>
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className="btn btn-sm d-flex align-items-center gap-1 border-0"
                    style={{ color: likedMap[item.id] ? '#ef4444' : '#64748b' }}
                  >
                    {likedMap[item.id] ? <FaHeart /> : <FaRegHeart />}
                    <span>{item.likes} hữu ích</span>
                  </button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Submit feedback form */}
        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 mt-4" style={{ background: '#ffffff', border: '1px solid rgba(226, 232, 240, 0.95)', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)' }}>
          <div className="text-center max-w-600 mx-auto mb-4" style={{ maxWidth: '600px' }}>
            <div className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', fontSize: '12px', fontWeight: 600 }}>
              <FaPaperPlane /> CHIA SẺ TRẢI NGHIỆM CỦA BẠN
            </div>
            <h3 className="fw-bold" style={{ color: '#0f172a' }}>
              Bạn Đã Đi Tour Cùng Tripaholic?
            </h3>
            <p className="text-muted small">
              Hãy để lại nhật ký và cảm nhận để giúp các trekker tương lai có thêm kinh nghiệm quý giá cho chuyến đi nhé!
            </p>
          </div>

          {submitted && (
            <Alert variant="success" className="text-center rounded-3 max-w-600 mx-auto" style={{ maxWidth: '600px' }}>
              <FaCheckCircle className="me-2" /> Cảm ơn bạn! Đánh giá & nhật ký của bạn đã được đăng thành công.
            </Alert>
          )}

          <Form onSubmit={handleFormSubmit} style={{ maxWidth: '720px', margin: '0 auto' }}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Họ và tên của bạn *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Tuấn Anh"
                    value={newFeedback.author}
                    onChange={(e) => setNewFeedback({ ...newFeedback, author: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Đến từ tỉnh / thành phố</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ví dụ: Hà Nội, TP.HCM, Đà Nẵng..."
                    value={newFeedback.location}
                    onChange={(e) => setNewFeedback({ ...newFeedback, location: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Tour bạn đã trải nghiệm *</Form.Label>
                  <Form.Select
                    value={newFeedback.tour}
                    onChange={(e) => setNewFeedback({ ...newFeedback, tour: e.target.value })}
                  >
                    <option value="Trekking Tà Xùa 2N1Đ - Sống Lưng Khủng Long">Trekking Tà Xùa 2N1Đ - Sống Lưng Khủng Long</option>
                    <option value="Trekking Lảo Thẩn 2N1Đ - Nóc Nhà Y Tý">Trekking Lảo Thẩn 2N1Đ - Nóc Nhà Y Tý</option>
                    <option value="Trekking Fansipan 2N1Đ Đường Bộ Trạm Tôn">Trekking Fansipan 2N1Đ Đường Bộ Trạm Tôn</option>
                    <option value="Trekking Ky Quan San (Bạch Mộc Lương Tử) 3N2Đ">Trekking Ky Quan San (Bạch Mộc Lương Tử) 3N2Đ</option>
                    <option value="Trekking Tà Chì Nhù 2N1Đ - Mùa Hoa Chi Pâu">Trekking Tà Chì Nhù 2N1Đ - Mùa Hoa Chi Pâu</option>
                    <option value="Cung Phượt Hà Giang - Mã Pí Lèng & Sông Nho Quế">Cung Phượt Hà Giang - Mã Pí Lèng & Sông Nho Quế</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Chấm điểm số sao</Form.Label>
                  <Form.Select
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback({ ...newFeedback, rating: e.target.value })}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Sao (Tuyệt vời)</option>
                    <option value="4">⭐⭐⭐⭐ 4 Sao (Rất tốt)</option>
                    <option value="3">⭐⭐⭐ 3 Sao (Bình thường)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Tiêu đề tóm tắt cảm nhận *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Ví dụ: Chuyến săn mây tuyệt nhất cuộc đời, leader quá chu đáo!"
                    value={newFeedback.title}
                    onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold" style={{ color: '#334155' }}>Nội dung chi tiết nhật ký / feedback *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    required
                    placeholder="Chia sẻ về cảnh quan, biển mây, porter bản địa, đồ ăn, lán ngủ, lưu ý cho người đi sau..."
                    value={newFeedback.content}
                    onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="text-center pt-2">
                <Button
                  type="submit"
                  className="rounded-pill px-5 py-2 fw-bold text-white border-0 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 18px rgba(234, 88, 12, 0.3)' }}
                >
                  <FaPaperPlane className="me-2" /> Gửi Nhật Ký / Đánh Giá
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
