# 🌿 XÊ DỊCH - NỀN TẢNG PHƯỢT & SĂN MÂY (NESTJS BACKEND)

> **Môn học:** Phát triển ứng dụng Web Nâng Cao  
> **Repository:** [https://github.com/QuyenNguyenDinh/Advanced-web](https://github.com/QuyenNguyenDinh/Advanced-web)  
> **Công nghệ:** **NestJS** (TypeScript, Module, Controller, Service, Dependency Injection) + **PostgreSQL**  
> **Thành viên nhóm:** (Điền danh sách thành viên & MSSV vào đây)

---

## 📋 MỤC LỤC & BÁO CÁO NỘP BÀI TUẦN 1

- [1. Môi trường chung & DevContainer](#1-môi-trường-chung--devcontainer)
- [2. Cấu trúc CSDL (`database.sql`)](#2-cấu-trúc-csdl-databasesql)
- [3. Hệ quản trị CSDL & Ảnh minh chứng (Câu 3)](#3-hệ-quản-trị-csdl--ảnh-minh-chứng-câu-3)
- [4. Kết nối Database (`src/database/database.service.ts`) & Ảnh minh chứng (Câu 4)](#4-kết-nối-database-srcdatabasedatabaseservicets--ảnh-minh-chứng-câu-4)
- [5. API CRUD & Ảnh minh chứng kiểm thử (Câu 5)](#5-api-crud--ảnh-minh-chứng-kiểm-thử-câu-5)
- [6. Hướng dẫn chạy dự án cục bộ](#6-hướng-dẫn-chạy-dự-án-cục-bộ)

---

## 1. Môi trường chung & DevContainer
- **Git Repo:** Đã khởi tạo và phân quyền cho các thành viên trong nhóm.
- **Cấu hình DevContainer:** File cấu hình chuẩn tại [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json) bao gồm:
  - Base Image: Node.js 22 LTS (Debian Bookworm)
  - Tự động forward các port: `3000` (NestJS Server), `5432` (PostgreSQL)
  - Cài đặt sẵn các extensions cần thiết cho VS Code: ESLint, Prettier, PostgreSQL Client, REST Client.

---

## 2. Cấu trúc CSDL (`database.sql`)
File khởi tạo và nạp dữ liệu mẫu: [`database.sql`](database.sql)
Bao gồm các bảng chính phục vụ nền tảng du lịch:
1. `users`: Quản lý người dùng, phân quyền (user/admin).
2. `destinations`: Điểm đến (Tà Xùa, Hà Giang, Mộc Châu...), mùa đẹp, độ khó, ngân sách dự tính.
3. `places`: Địa điểm dịch vụ tại điểm đến (Homestay, quán ăn, điểm check-in, nhà xe).
4. `itineraries`: Lịch trình mẫu (2N1Đ, 3N2Đ) lưu trữ dạng JSONB timeline.
5. `reviews`: Đánh giá, chấm điểm sao từ cộng đồng.

---

## 3. Hệ quản trị CSDL & Ảnh minh chứng (Câu 3)
- **Hệ quản trị CSDL lựa chọn:** **PostgreSQL**
  - *Lý do chọn:* Hỗ trợ kiểu dữ liệu mảng (`TEXT[]`), `JSONB` cho lịch trình linh hoạt, tính toàn vẹn quan hệ cao, sẵn sàng mở rộng PostGIS tính khoảng cách và tương thích trực tiếp các cloud hosting (Supabase, Neon, Railway).

### 📸 Ảnh chụp màn hình Câu 3 (Minh chứng CSDL / Bảng dữ liệu):
> *(Chụp màn hình pgAdmin / DBeaver / VS Code Postgres Extension / Supabase Table Editor hiển thị các bảng và lưu ảnh vào thư mục `docs/screenshots/cau3-database.png`)*

![Câu 3: Hệ quản trị CSDL PostgreSQL](./docs/screenshots/cau3-database.png)

---

## 4. Kết nối Database (`src/database/database.service.ts`) & Ảnh minh chứng (Câu 4)
- **File module & service kết nối:** [`src/database/database.module.ts`](src/database/database.module.ts) và [`src/database/database.service.ts`](src/database/database.service.ts)
- Sử dụng Connection Pool PostgreSQL (`pg.Pool`) được đóng gói dưới dạng NestJS Service (Dependency Injection), tự động đọc cấu hình linh hoạt từ file `.env` (`DATABASE_URL` hoặc `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`).
- Tự động kiểm tra và in log trạng thái kết nối ngay khi NestJS khởi chạy qua lifecycle hook `onModuleInit`.

### 📸 Ảnh chụp màn hình Câu 4 (Minh chứng kết nối CSDL thành công):
> *(Chụp màn hình terminal chạy `npm run start:dev` hiển thị thông báo "✅ Kết nối thành công đến PostgreSQL database!" và lưu vào `docs/screenshots/cau4-dbconnection.png`)*

![Câu 4: Kết nối database.service.ts thành công](./docs/screenshots/cau4-dbconnection.png)

---

## 5. API CRUD & Ảnh minh chứng kiểm thử (Câu 5)
- **Đối tượng phụ trách:** `Destination` (Điểm đến du lịch)
- **File Controller:** [`src/destinations/destinations.controller.ts`](src/destinations/destinations.controller.ts)
- **File Service:** [`src/destinations/destinations.service.ts`](src/destinations/destinations.service.ts)
- **File Module:** [`src/destinations/destinations.module.ts`](src/destinations/destinations.module.ts)
- **File DTO:** [`src/destinations/dto/`](src/destinations/dto/)

### Danh sách các Endpoints CRUD:
| Phương thức (Method) | Đường dẫn (Endpoint) | Chức năng | Body / Query |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/destinations` | Lấy danh sách điểm đến | `?search=ta-xua` hoặc `?featured=true` |
| **GET** | `/api/destinations/:id` | Lấy chi tiết điểm đến (kèm places) | Param: `id` |
| **POST** | `/api/destinations` | Tạo mới điểm đến | JSON: `{ slug, name, description, ... }` |
| **PUT** | `/api/destinations/:id` | Cập nhật điểm đến | Param: `id`, JSON body các trường cần sửa |
| **DELETE** | `/api/destinations/:id` | Xóa điểm đến | Param: `id` |

### 📸 Ảnh chụp màn hình Câu 5 (Minh chứng kiểm thử CRUD qua REST Client / Postman):
> *(Chụp màn hình gửi request qua file [`requests.http`](requests.http) hoặc Postman và lưu vào `docs/screenshots/cau5-crud-test.png`)*

![Câu 5: Kiểm thử API CRUD](./docs/screenshots/cau5-crud-test.png)

---

## 6. Hướng dẫn chạy dự án cục bộ

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` từ file `.env.example`:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/travel_db
```

### Bước 3: Khởi tạo dữ liệu vào PostgreSQL
Mở pgAdmin / DBeaver / terminal psql và chạy:
```bash
psql -U postgres -d travel_db -f database.sql
```

### Bước 4: Khởi động NestJS Server
Chạy chế độ phát triển (watch mode):
```bash
npm run start:dev
```
Hoặc:
```bash
npm start
```

Kiểm tra API trên trình duyệt / REST Client tại:
- Healthcheck: `http://localhost:3000/`
- Danh sách điểm đến: `http://localhost:3000/api/destinations`

---

## 7. BÁO CÁO TUẦN 2: COOKIES, SESSION, BCRYPT HASHING & JWT AUTHENTICATION

### 🎯 Các yêu cầu đã hoàn thành:
1. **Yêu cầu 1 - Cookies:**
   - Cài đặt `cookie-parser` và cấu hình middleware toàn cục trong [`src/main.ts`](src/main.ts).
   - Tích hợp đặt `jwt` vào HttpOnly Cookie khi người dùng đăng nhập (`POST /api/auth/login`).
   - Endpoint minh chứng: `GET /api/auth/cookies-demo`.
2. **Yêu cầu 2 - Session:**
   - Cài đặt `express-session` và cấu hình quản lý phiên trong [`src/main.ts`](src/main.ts).
   - Tích hợp lưu thông tin phiên người dùng khi đăng nhập.
   - Endpoint minh chứng: `GET /api/auth/session-demo` (tự động đếm số lần request trong cùng một session `sessionViews`).
3. **Yêu cầu 3 - Đăng ký & Băm mật khẩu (Bcrypt):**
   - **Entity User:** [`src/users/entities/user.entity.ts`](src/users/entities/user.entity.ts) quản lý `username`, `password`, `email`, `role` (ẩn trường password khi trả về).
   - **DTO Validation:** [`src/auth/dto/register.dto.ts`](src/auth/dto/register.dto.ts) kiểm tra tính hợp lệ của `username` (>= 3 ký tự) và `password` (>= 6 ký tự).
   - **Băm mật khẩu:** Sử dụng thư viện `bcrypt` với Salt 10 vòng (`bcrypt.hash(password, 10)`).
   - **Lưu CSDL:** Lưu bản ghi vào bảng `users` trong PostgreSQL qua [`DatabaseService`](src/database/database.service.ts).
4. **Yêu cầu 4 - Authentication & Authorisation (RBAC) sử dụng JWT:**
   - Cài đặt `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`.
   - **JWT Strategy:** [`src/auth/jwt.strategy.ts`](src/auth/jwt.strategy.ts) hỗ trợ trích xuất JWT từ cả `Authorization: Bearer <token>` và từ `Cookie: jwt`.
   - **Authentication Guard:** [`src/auth/jwt-auth.guard.ts`](src/auth/jwt-auth.guard.ts) bảo vệ các route riêng tư.
   - **Authorisation Guard (RBAC):** [`src/auth/roles.guard.ts`](src/auth/roles.guard.ts) và decorator [`src/auth/roles.decorator.ts`](src/auth/roles.decorator.ts) kiểm tra quyền (`user`, `admin`).
   - **API Đăng nhập:** `POST /api/auth/login` kiểm tra mật khẩu bằng `bcrypt.compare()`, sinh JWT Token và đồng thời thiết lập Cookie + Session.
   - **Protected Route:** `GET /api/auth/profile` chỉ cho phép truy cập khi có JWT token hợp lệ.
   - **Role-Restricted Route:** `GET /api/auth/admin-dashboard` chỉ cho phép người dùng có role `'admin'` truy cập (User thường sẽ nhận lỗi 403 Forbidden).

### 📋 Danh sách Endpoints Auth:
| Method | Endpoint | Mô tả | Yêu cầu minh chứng |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/auth/cookies-demo` | Kiểm thử đọc & ghi Cookies | Yêu cầu 1 |
| **GET** | `/api/auth/session-demo` | Kiểm thử đọc & ghi Session | Yêu cầu 2 |
| **POST** | `/api/auth/register` | Đăng ký tài khoản (Bcrypt băm pass lưu DB) | Yêu cầu 3 |
| **POST** | `/api/auth/login` | Đăng nhập & Cấp JWT access_token + Cookie | Yêu cầu 4 (Auth) |
| **GET** | `/api/auth/profile` | Xem profile người dùng (Bảo vệ bởi JWT Guard) | Yêu cầu 4 (Auth) |
| **GET** | `/api/auth/admin-dashboard` | Khu vực Admin (Bảo vệ bởi RolesGuard & JWT) | Yêu cầu 4 (Authorisation) |
| **POST** | `/api/auth/logout` | Đăng xuất (Xóa Cookie & Hủy Session) | Auth Helper |

### 📸 Hướng dẫn chụp ảnh minh chứng nộp bài:
1. **Ảnh 1 - Chụp màn hình API đã thành công:**
   - Mở file [`requests.http`](requests.http) trong VS Code (hoặc Postman).
   - Gửi request `POST /api/auth/register` (thành công 201) và `POST /api/auth/login` (thành công 200, nhận access_token).
   - Chụp lại màn hình kết quả và lưu vào: `docs/screenshots/tuan2-api-success.png`.
2. **Ảnh 2 - Chụp màn hình dữ liệu trong CSDL:**
   - Mở pgAdmin / DBeaver / Neon Dashboard:
     ```sql
     SELECT id, username, email, password, role, created_at FROM users;
     ```
   - Chụp lại màn hình thấy rõ cột `password` là chuỗi hash bcrypt (`$2b$10$...`) chứ không phải plain-text.
   - Lưu vào: `docs/screenshots/tuan2-database-hashed.png`.

---

## 8. FRONTEND (REACT + BOOTSTRAP + AXIOS)

### 🎨 Bố cục trang web:
- **Header (`Header.jsx`):** Navbar Bootstrap với logo XÊ DỊCH, menu điều hướng và nút Đăng nhập / Đăng ký.
- **Banner (`Banner.jsx`):** Hero section hình nền săn mây, ô tìm kiếm nhanh và thống kê cẩm nang phượt.
- **Content (`Content.jsx`):** Sử dụng **Axios** gọi API `GET http://localhost:3000/api/destinations`, hiển thị lưới thẻ Card Bootstrap với hình ảnh, ngân sách, mùa đi, bộ lọc độ khó, và Modal xem chi tiết dịch vụ (Homestay, Ăn uống, Check-in, Xe khách).
- **Footer (`Footer.jsx`):** Chân trang đầy đủ thông tin hỗ trợ, mạng xã hội (React Icons) và bản quyền dự án Web Nâng Cao.

### 🚀 Hướng dẫn khởi chạy Frontend:
```bash
npm run frontend:dev
```
Giao diện chạy tại: `http://localhost:5173/`


