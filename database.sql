DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    best_months VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'Trung bình',
    how_to_get_there TEXT,
    warnings TEXT,
    avg_budget VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    destination_id INT REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    price_range VARCHAR(100),
    opening_hours VARCHAR(100),
    avg_rating NUMERIC(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    contact_phone VARCHAR(50),
    contact_link TEXT,
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    destination_id INT REFERENCES destinations(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    total_cost VARCHAR(100),
    tags TEXT[],
    content JSONB,
    saved_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    destination_id INT REFERENCES destinations(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, name, email, password, role) VALUES
('admin', 'Admin Quản Trị', 'admin@xedich.vn', '$2b$10$epAl1lGkI9sN9jYt9/Fj2.sTqE6sTsqWb1x0m0/r23X2Fh2V5r9mK', 'admin'),
('phuotthu', 'Nguyễn Văn Phượt', 'phuotthu@gmail.com', '$2b$10$epAl1lGkI9sN9jYt9/Fj2.sTqE6sTsqWb1x0m0/r23X2Fh2V5r9mK', 'user');

INSERT INTO destinations (slug, name, description, cover_image, best_months, difficulty, how_to_get_there, warnings, avg_budget, is_featured) VALUES
(
    'ta-xua',
    'Tà Xùa - Thiên đường mây Bắc Yên',
    'Xã vùng cao thuộc huyện Bắc Yên, Sơn La, nổi tiếng với biển mây cuồn cuộn quanh năm và Sống lưng khủng long Háng Đồng hùng vĩ.',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'Tháng 10 - Tháng 4',
    'Dễ',
    'Xe khách giường nằm từ bến Mỹ Đình/Yên Nghĩa lên Bắc Yên (~250k), sau đó thuê xe máy hoặc xe ôm lên Tà Xùa (15km dốc cua).',
    'Đường dốc quanh co có sương mù dày đặc vào sáng sớm. Nên đi xe số hoặc tay côn, hạn chế đi xe ga.',
    '1.200.000 - 1.800.000 VNĐ / người',
    true
),
(
    'ha-giang',
    'Hà Giang - Cung đường hạnh phúc',
    'Vùng đất địa đầu tổ quốc với cao nguyên đá Đồng Văn hùng vĩ, đèo Mã Pí Lèng hiểm trở và dòng sông Nho Quế xanh ngọc bích.',
    'https://images.unsplash.com/photo-1528127269322-539801943592',
    'Tháng 9 - Tháng 12',
    'Trung bình',
    'Xe cung điện/limousine từ Hà Nội lên TP Hà Giang (~300k - 350k). Thuê xe máy chạy cung đường Loop Đồng Văn - Mèo Vạc.',
    'Đèo dốc đứng và nhiều cua tay áo nguy hiểm. Mùa mưa (tháng 6-8) dễ có nguy cơ sạt lở đá.',
    '2.000.000 - 3.200.000 VNĐ / người',
    true
);

INSERT INTO places (destination_id, name, type, price_range, opening_hours, avg_rating, review_count, contact_phone, contact_link, lat, lng, image) VALUES
(1, 'Mây Lang Thang Homestay', 'stay', '300.000 - 650.000 VNĐ', '24/7', 4.8, 124, '0987654321', 'https://facebook.com/maylangthang', 21.2825, 104.4712, 'https://images.unsplash.com/photo-1587061949409-02df41d5e562'),
(1, 'Tiệm Cà Phê Mị Ơi', 'eat', '35.000 - 60.000 VNĐ', '06:00 - 22:00', 4.7, 89, '0912345678', 'https://facebook.com/caphemioi', 21.2840, 104.4735, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'),
(1, 'Sống Lưng Khủng Long Háng Đồng', 'checkin', 'Miễn phí', 'Cả ngày', 4.9, 310, '', '', 21.2720, 104.4980, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'),
(1, 'Nhà xe Khánh Thịnh Limousine', 'transport', '250.000 - 300.000 VNĐ', 'Xuất bến 21h00', 4.6, 54, '0966888999', '', 21.2400, 104.4500, '');

INSERT INTO itineraries (destination_id, title, duration, total_cost, tags, content, saved_count) VALUES
(
    1,
    'Săn Mây Tà Xùa 2N1Đ - Chill Cuối Tuần',
    '2N1Đ',
    '1.500.000 VNĐ',
    ARRAY['Săn mây', 'Tiết kiệm', 'Đi nhóm bạn'],
    '[
        {"day": 1, "morning": "Lên xe từ Hà Nội đi Bắc Yên, nhận xe máy chạy lên Tà Xùa", "afternoon": "Check-in homestay, uống cafe ngắm hoàng hôn tại Tiệm Mị Ơi", "evening": "Ăn lẩu gà đen tại bản, đốt lửa trại"},
        {"day": 2, "morning": "05:00 dậy săn mây tại Sống Lưng Khủng Long, check-in Cây Cô Đơn", "afternoon": "Ăn trưa, trả phòng và di chuyển về lại thị trấn Bắc Yên lên xe về Hà Nội"}
    ]'::jsonb,
    42
);
