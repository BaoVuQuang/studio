# Firebase Studio - StudyBuddy AI

Ứng dụng StudyBuddy là trợ lý học tập chạy trên Next.js, được hỗ trợ bởi Genkit và một dịch vụ FastAPI để xử lý việc tải tài liệu an toàn. Dự án bao gồm:

- **Frontend**: Next.js 15 với App Router.
- **AI Worker**: Genkit flows sử dụng Gemini.
- **Document API**: FastAPI đảm nhận kiểm tra tệp, trích xuất nội dung và logging có cấu trúc.

## Chạy ứng dụng trên máy cục bộ (Running Locally)

Các bước dưới đây hướng dẫn thiết lập đầy đủ ba tiến trình bắt buộc: FastAPI, Genkit và Next.js.

### Yêu cầu
- [Node.js](https://nodejs.org/) **>= 18** cùng `npm`
- [Python](https://www.python.org/) **>= 3.10** (khuyến nghị tạo virtualenv riêng)

### 1. Cài đặt phụ thuộc cho Next.js
Ở thư mục gốc của dự án:

```bash
npm install
```

### 2. Cài đặt phụ thuộc cho FastAPI
Tạo môi trường ảo và cài đặt thư viện Python:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows dùng .venv\Scripts\activate
pip install -r backend/requirements.txt
```

> Ghi chú: Giữ terminal này với virtualenv đang kích hoạt để dùng ở bước khởi chạy FastAPI.

### 3. Thiết lập biến môi trường
Tạo tệp `.env.local` tại thư mục gốc và thêm cấu hình tối thiểu:

```bash
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

- `GEMINI_API_KEY` dùng cho các flow Genkit.
- `NEXT_PUBLIC_API_BASE_URL` trỏ đến dịch vụ FastAPI; có thể bỏ qua nếu dùng mặc định `http://localhost:8000`.
- (Tuỳ chọn) Đặt `CHROMA_DATA_DIR=/absolute/path/to/data/chroma` nếu muốn phục vụ knowledge base từ vị trí khác.

### 4. Khởi chạy các dịch vụ
Mỗi dịch vụ nên chạy ở một terminal riêng:

**Terminal 1 – FastAPI (xử lý upload an toàn)**
```bash
uvicorn main:app --app-dir backend --port 8000 --reload
```
API cung cấp `POST /upload` (giới hạn 5MB, kiểm tra MIME) và `GET /healthz` để kiểm tra trạng thái.

**Terminal 2 – Genkit (AI flows)**
```bash
npm run genkit:dev
```
Giữ tiến trình này luôn mở để server actions có thể truy cập Gemini qua Genkit.

**Terminal 3 – Next.js frontend**
```bash
npm run dev
```
Frontend chạy tại [http://localhost:9002](http://localhost:9002).

### 5. Làm việc với knowledge base động
- Ứng dụng đọc nội dung kiến thức trực tiếp từ các tệp JSON trong `data/chroma`. Chỉnh sửa nội dung ở đây sẽ phản ánh ngay lập tức mà không cần build lại.
- Nếu thay đổi nguồn TypeScript gốc trong `src/lib/knowledge-base/**`, hãy xuất lại JSON và áp dụng script enrich:
  ```bash
  npx tsx scripts/export-knowledge.ts
  node scripts/enrich-knowledge.mjs
  ```
  Lệnh đầu tiên sinh tệp thô, lệnh thứ hai bổ sung "Hướng dẫn tự học" và "Lộ trình luyện đề" tránh trùng lặp.
- Mỗi tệp JSON sau khi enrich có thêm trường `sections` giúp frontend tải từng phần nội dung
  (kiến thức trọng tâm, tự học, lộ trình) mà không cần parse lại chuỗi markdown.

Hoàn thành các bước trên, bạn có thể mở trình duyệt và bắt đầu tương tác với StudyBuddy ngay trên máy cục bộ của mình.

