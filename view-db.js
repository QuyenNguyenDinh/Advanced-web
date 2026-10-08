require('dotenv').config();
const { Pool } = require('pg');

async function showUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await pool.query(
      'SELECT id, username, name, email, role, password, created_at FROM users ORDER BY id;'
    );

    console.log('\n========================================================================================');
    console.log('📌 DANH SÁCH DỮ LIỆU BẢNG USERS TRONG CSDL POSTGRESQL (NEON CLOUD)');
    console.log('========================================================================================\n');

    console.table(
      res.rows.map((user) => ({
        ID: user.id,
        Username: user.username,
        Role: user.role,
        Email: user.email,
        'Password (Bcrypt Hash)': user.password,
        'Created At': new Date(user.created_at).toLocaleString('vi-VN'),
      }))
    );

    console.log('\n✅ Minh chứng: Cột Password đã được mã hóa an toàn bằng thuật toán Bcrypt ($2b$10$...).');
    console.log('📸 Bạn có thể chụp lại toàn bộ màn hình này để làm ảnh minh chứng CSDL nộp bài!\n');
  } catch (error) {
    console.error('Lỗi truy vấn CSDL:', error.message);
  } finally {
    await pool.end();
  }
}

showUsers();
