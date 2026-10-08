import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { destinationService } from '../services/destination.service';
import { useAuth } from '../context/AuthContext';
import {
  FaSearch,
  FaStar,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPlus,
  FaMapMarkerAlt,
  FaRedo,
  FaCompass,
  FaCloud,
  FaMountain,
  FaWater,
  FaLeaf
} from 'react-icons/fa';

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal tạo điểm đến mới (dành cho Admin / Quản trị)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDest, setNewDest] = useState({
    slug: '',
    name: '',
    region: 'Sơn La',
    description: '',
    cover_image: '',
    best_months: '',
    difficulty: 'Dễ',
    how_to_get_there: '',
    warnings: '',
    avg_budget: '',
    is_featured: false
  });
  const [createMsg, setCreateMsg] = useState(null);

  const { user } = useAuth();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await destinationService.getAll();
      if (res?.data) {
        setDestinations(res.data);
      }
    } catch (err) {
      console.warn('Lỗi khi tải điểm đến:', err);
      setError('Chưa kết nối được với Backend hoặc CSDL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    try {
      await destinationService.create(newDest);
      setCreateMsg({ type: 'success', text: 'Tạo điểm đến mới thành công!' });
      loadData();
      setTimeout(() => {
        setShowAddModal(false);
        setCreateMsg(null);
      }, 1200);
    } catch (err) {
      setCreateMsg({ type: 'danger', text: err.response?.data?.message || 'Lỗi khi tạo điểm đến.' });
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm và tab danh mục
  const filtered = destinations.filter((dest) => {
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      dest.name.toLowerCase().includes(q) ||
      dest.description?.toLowerCase().includes(q) ||
      dest.region?.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FEATURED') return dest.is_featured === true || dest.is_featured === 'true';
    if (activeFilter === 'CLOUD') {
      return (
        dest.name.toLowerCase().includes('tà xùa') ||
        dest.name.toLowerCase().includes('y tý') ||
        dest.name.toLowerCase().includes('fansipan') ||
        (dest.cloud_chance && parseInt(dest.cloud_chance, 10) >= 85)
      );
    }
    if (activeFilter === 'MOC_CHAU') {
      return (
        dest.name.toLowerCase().includes('mộc châu') ||
        dest.region?.toLowerCase().includes('mộc châu') ||
        dest.slug?.includes('moc-chau')
      );
    }
    if (activeFilter === 'HA_GIANG') {
      return (
        dest.name.toLowerCase().includes('hà giang') ||
        dest.region?.toLowerCase().includes('hà giang') ||
        dest.slug?.includes('ha-giang')
      );
    }
    if (activeFilter === 'MU_CANG_CHAI') {
      return (
        dest.name.toLowerCase().includes('mù cang chải') ||
        dest.region?.toLowerCase().includes('yên bái') ||
        dest.slug?.includes('mu-cang-chai')
      );
    }
    if (activeFilter === 'DONG_BAC') {
      return (
        dest.name.toLowerCase().includes('bản giốc') ||
        dest.name.toLowerCase().includes('bình liêu') ||
        dest.name.toLowerCase().includes('ba bể') ||
        dest.region?.toLowerCase().includes('cao bằng') ||
        dest.region?.toLowerCase().includes('bắc kạn') ||
        dest.region?.toLowerCase().includes('quảng ninh')
      );
    }
    return true;
  });

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'transparent' }}>
      {/* ==========================================================
          1. HERO BANNER TOÀN CẢNH (Hình ảnh Sông Nho Quế / Hà Giang)
          Đặt ngay sau thanh Header, độ phân giải cao, lộng lẫy
          ========================================================== */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '440px',
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.72) 100%), url('/images/destination_banner.png')`,
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 20px 60px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Container className="text-center text-white" style={{ maxWidth: '860px' }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ffffff',
              marginBottom: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
            }}
          >
            <FaCompass style={{ color: '#f59e0b' }} />
            <span>Kỳ Quan Non Nước • Bắc Bộ Việt Nam</span>
          </div>

          {/* Banner Title */}
          <h1
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
              textShadow: '0 3px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            Điểm Đến Hùng Vĩ Miền Bắc
          </h1>

          {/* Banner Narrative */}
          <p
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              lineHeight: 1.6,
              color: '#f1f5f9',
              maxWidth: '680px',
              margin: '0 auto 28px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
              fontWeight: 400
            }}
          >
            Hành trình chạm tay vào dòng sông Nho Quế màu ngọc bích, biển mây Tà Xùa cuộn sóng, đồi chè xanh mướt Mộc Châu và những tuyệt tác ruộng bậc thang vàng óng.
          </p>

          {/* Search Box kính mờ tích hợp ngay trên Banner */}
          <div
            style={{
              maxWidth: '560px',
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '9999px',
              padding: '6px 8px 6px 20px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.9)'
            }}
          >
            <InputGroup className="align-items-center">
              <FaSearch style={{ color: '#ea580c', fontSize: '16px', marginRight: '10px' }} />
              <Form.Control
                type="text"
                placeholder="Tìm Mộc Châu, Tà Xùa, Hà Giang, Fansipan..."
                className="border-0 shadow-none text-dark ps-0"
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕
                </button>
              )}
            </InputGroup>
          </div>
        </Container>
      </section>

      {/* ==========================================================
          2. THANH PHÂN LOẠI ĐIỂM ĐẾN PHÍA BẮC (Category Pills)
          ========================================================== */}
      <Container className="mt-4 mb-4">
        <div
          className="d-flex flex-wrap justify-content-center align-items-center gap-2 py-2 px-3 rounded-pill"
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          <button
            className={`filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            Tất cả ({destinations.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'MOC_CHAU' ? 'active' : ''}`}
            onClick={() => setActiveFilter('MOC_CHAU')}
          >
            🍵 Mộc Châu (Sơn La)
          </button>
          <button
            className={`filter-btn ${activeFilter === 'HA_GIANG' ? 'active' : ''}`}
            onClick={() => setActiveFilter('HA_GIANG')}
          >
            🌊 Hà Giang (Sông Nho Quế)
          </button>
          <button
            className={`filter-btn ${activeFilter === 'CLOUD' ? 'active' : ''}`}
            onClick={() => setActiveFilter('CLOUD')}
          >
            ☁️ Săn mây (Tà Xùa & Fansipan)
          </button>
          <button
            className={`filter-btn ${activeFilter === 'MU_CANG_CHAI' ? 'active' : ''}`}
            onClick={() => setActiveFilter('MU_CANG_CHAI')}
          >
            🌾 Mù Cang Chải (Yên Bái)
          </button>
          <button
            className={`filter-btn ${activeFilter === 'DONG_BAC' ? 'active' : ''}`}
            onClick={() => setActiveFilter('DONG_BAC')}
          >
            💦 Bản Giốc & Đông Bắc
          </button>
          <button
            className={`filter-btn ${activeFilter === 'FEATURED' ? 'active' : ''}`}
            onClick={() => setActiveFilter('FEATURED')}
          >
            ⭐ Điểm đến nổi bật
          </button>
        </div>
      </Container>

      {/* ==========================================================
          3. DANH SÁCH CÁC ĐIỂM ĐẾN PHÍA BẮC KỲ VĨ
          ========================================================== */}
      <Container>
        {error && (
          <Alert variant="warning" className="rounded-4 mb-4 border-0 shadow-sm">
            {error} (Đang hiển thị danh mục điểm đến Tây Bắc - Đông Bắc đã tuyển chọn)
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-2 text-muted fw-semibold">Đang chuẩn bị hành trình điểm đến...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-5 rounded-4 shadow-sm p-4 my-4"
            style={{
              background: '#ffffff',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              color: '#0f172a'
            }}
          >
            <h5 className="mb-2 fw-bold">Không tìm thấy điểm đến nào phù hợp với "{searchTerm}"</h5>
            <p className="text-muted mb-4">Hãy thử tìm theo tên tỉnh (Sơn La, Hà Giang, Lào Cai, Cao Bằng) hoặc tên địa danh.</p>
            <Button
              className="rounded-pill px-4 text-white fw-bold border-0"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('ALL');
              }}
            >
              Xem tất cả điểm đến ({destinations.length})
            </Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filtered.map((dest) => (
              <Col key={dest.id || dest.slug}>
                <Card
                  className="destination-card h-100"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'transform 0.28s ease, box-shadow 0.28s ease',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div className="card-img-wrapper" style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={dest.cover_image || '/images/destination_banner.png'}
                      alt={dest.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        e.target.src = '/images/destination_banner.png';
                      }}
                    />

                    {/* Vùng địa lý badge */}
                    {dest.region && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          background: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(8px)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaMapMarkerAlt style={{ color: '#ea580c' }} /> {dest.region}
                      </span>
                    )}

                    {/* Nổi bật Badge */}
                    {(dest.is_featured === true || dest.is_featured === 'true') && (
                      <span className="card-featured-badge">
                        <FaStar /> Nổi bật
                      </span>
                    )}

                    {/* Độ khó Badge */}
                    <span className="card-difficulty-badge">
                      {dest.elevation ? `${dest.elevation}` : (dest.difficulty || 'Dễ')}
                    </span>
                  </div>

                  <div className="card-body-custom d-flex flex-column p-4">
                    <h4
                      className="destination-name"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '8px',
                        lineHeight: 1.3
                      }}
                    >
                      {dest.name}
                    </h4>

                    <p
                      className="destination-desc"
                      style={{
                        fontSize: '0.9rem',
                        color: '#475569',
                        lineHeight: 1.6,
                        marginBottom: '16px',
                        flexGrow: 1
                      }}
                    >
                      {dest.description}
                    </p>

                    {/* Hộp thông tin tóm tắt mùa đẹp & chi phí */}
                    <div
                      className="meta-row mb-3"
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '0.84rem'
                      }}
                    >
                      <div className="meta-item d-flex align-items-center gap-2 mb-1">
                        <FaCalendarAlt style={{ color: '#ea580c' }} />
                        <span><strong>Mùa đẹp:</strong> {dest.best_months || 'Quanh năm'}</span>
                      </div>
                      <div className="meta-item d-flex align-items-center gap-2">
                        <FaMoneyBillWave style={{ color: '#16a34a' }} />
                        <span><strong>Chi phí dự kiến:</strong> {dest.avg_budget || '1.200.000 - 2.000.000 VNĐ'}</span>
                      </div>
                    </div>

                    {/* Nút xem chi tiết & cẩm nang */}
                    <Button
                      as={Link}
                      to={`/destinations/${dest.id || dest.slug}`}
                      className="btn-explore mt-auto w-100 py-2 fw-bold text-white border-0 rounded-pill"
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        boxShadow: '0 4px 14px rgba(234, 88, 12, 0.28)'
                      }}
                    >
                      Xem cẩm nang & Điểm check-in →
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Khu vực quản trị bổ sung điểm đến (chỉ hiển thị tinh tế dưới chân trang) */}
        <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top" style={{ borderColor: 'rgba(226, 232, 240, 0.8)' }}>
          <span className="text-muted small">
            Đang hiển thị {filtered.length} / {destinations.length} tọa độ khám phá phía Bắc
          </span>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              size="sm"
              onClick={loadData}
              className="rounded-pill px-3 text-secondary border"
            >
              <FaRedo className={loading ? 'fa-spin' : ''} /> Đồng bộ dữ liệu
            </Button>
            {user?.role === 'admin' && (
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus /> Thêm điểm đến (Admin)
              </Button>
            )}
          </div>
        </div>

        {/* Modal Thêm điểm đến mới (POST API) */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Thêm Điểm Đến Mới (POST API)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {createMsg && <Alert variant={createMsg.type}>{createMsg.text}</Alert>}
            <Form onSubmit={handleCreateDestination}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tên điểm đến *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="VD: Mộc Châu, Tà Xùa, Hà Giang..."
                      value={newDest.name}
                      onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Slug (đường dẫn URL) *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="VD: moc-chau-son-la"
                      value={newDest.slug}
                      onChange={(e) => setNewDest({ ...newDest, slug: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Khu vực / Tỉnh thành *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="VD: Sơn La, Hà Giang, Lào Cai..."
                      value={newDest.region}
                      onChange={(e) => setNewDest({ ...newDest, region: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Độ khó</Form.Label>
                    <Form.Select
                      value={newDest.difficulty}
                      onChange={(e) => setNewDest({ ...newDest, difficulty: e.target.value })}
                    >
                      <option value="Dễ">Dễ</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Thử thách">Thử thách</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Mô tả chi tiết *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      required
                      placeholder="Vẻ đẹp nổi bật, danh thắng, trải nghiệm không thể bỏ qua..."
                      value={newDest.description}
                      onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Mùa đẹp nhất</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: Tháng 10 - Tháng 4"
                      value={newDest.best_months}
                      onChange={(e) => setNewDest({ ...newDest, best_months: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Chi phí dự kiến</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: 1.500.000 - 2.500.000 VNĐ"
                      value={newDest.avg_budget}
                      onChange={(e) => setNewDest({ ...newDest, avg_budget: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Link hình ảnh bìa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="https://... hoặc /images/..."
                      value={newDest.cover_image}
                      onChange={(e) => setNewDest({ ...newDest, cover_image: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="warning" className="text-white fw-bold">
                  Lưu điểm đến
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
