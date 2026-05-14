# Backend Setup Guide - Book Management API

## Cài đặt Dependencies

Chạy lệnh sau trong thư mục `Book/backend`:

```bash
npm install
```

Lệnh này sẽ cài đặt các packages sau:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Enable CORS
- `dotenv` - Environment variables
- `nodemon` - Auto-restart server (dev dependency)

## Cấu hình Environment Variables

File `.env` đã được tạo sẵn với nội dung:

```env
MONGODB_URI=mongodb+srv://hoainam:ab123456@cluster0.5lr6v03.mongodb.net/bookstore
DB_NAME=bookstore
PORT=3000
```

**Lưu ý**: Nếu bạn muốn sử dụng MongoDB local, thay đổi `MONGODB_URI` thành:
```env
MONGODB_URI=mongodb://localhost:27017
```

## Khởi chạy Backend

### Development mode (với nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## API Endpoints

### Books API

#### GET /api/books
Lấy danh sách tất cả sách (có populate category)

**Query Parameters:**
- `search` - Tìm kiếm theo tên hoặc tác giả
- `categoryId` - Lọc theo danh mục
- `sort` - Sắp xếp theo giá (`asc` hoặc `desc`)

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Book Name",
    "author": "Author Name",
    "price": 100000,
    "categoryId": {
      "_id": "...",
      "name": "Category Name",
      "status": "active"
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/books
Tạo sách mới

**Request Body:**
```json
{
  "name": "Book Name",
  "author": "Author Name",
  "price": 100000,
  "categoryId": "category_id_here"
}
```

#### PUT /api/books/:id
Cập nhật thông tin sách

**Request Body:**
```json
{
  "name": "Updated Book Name",
  "author": "Updated Author",
  "price": 150000,
  "categoryId": "new_category_id"
}
```

#### DELETE /api/books/:id
Xóa sách

**Response:**
```json
{
  "message": "Xóa thành công",
  "id": "book_id"
}
```

### Categories API

#### GET /api/categories
Lấy danh sách tất cả danh mục

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Category Name",
    "description": "Description",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/categories
Tạo danh mục mới

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Description",
  "status": "active"
}
```

#### PUT /api/categories/:id
Cập nhật danh mục

**Request Body:**
```json
{
  "name": "Updated Category",
  "description": "Updated Description",
  "status": "inactive"
}
```

#### DELETE /api/categories/:id
Xóa danh mục

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

## Database Schema

### Book Schema
```javascript
{
  name: String (required),
  author: String (required),
  price: Number (required),
  categoryId: ObjectId (ref: 'Category', required),
  status: String (default: 'active'),
  timestamps: true
}
```

### Category Schema
```javascript
{
  name: String (required),
  description: String,
  status: String (enum: ['active', 'inactive'], default: 'active'),
  timestamps: true
}
```

## CORS Configuration

Backend đã được cấu hình CORS để chấp nhận requests từ:
- `http://localhost:5173` (Vite dev server)

Nếu frontend chạy ở port khác, cập nhật trong `src/app.js`:
```javascript
app.use(cors({
    origin: 'http://localhost:YOUR_PORT',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
```

## Troubleshooting

### Lỗi: Cannot find package 'dotenv'
**Giải pháp:** Chạy `npm install` để cài đặt dependencies

### Lỗi: MongoDB connection failed
**Giải pháp:** 
1. Kiểm tra `MONGODB_URI` trong file `.env`
2. Đảm bảo MongoDB đang chạy (nếu dùng local)
3. Kiểm tra network connection (nếu dùng MongoDB Atlas)

### Lỗi: Port 3000 already in use
**Giải pháp:** 
1. Thay đổi `PORT` trong file `.env`
2. Hoặc kill process đang dùng port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

## Testing với Postman/Thunder Client

Import collection hoặc test thủ công:

1. **Create Category:**
   - Method: POST
   - URL: `http://localhost:3000/api/categories`
   - Body: `{ "name": "Fiction", "status": "active" }`

2. **Create Book:**
   - Method: POST
   - URL: `http://localhost:3000/api/books`
   - Body: `{ "name": "Book 1", "author": "Author 1", "price": 100000, "categoryId": "category_id_from_step_1" }`

3. **Get All Books:**
   - Method: GET
   - URL: `http://localhost:3000/api/books`
