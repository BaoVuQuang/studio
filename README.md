# Firebase Studio - StudyBuddy AI

Đây là một ứng dụng Next.js được phát triển trong Firebase Studio, đóng vai trò như một trợ lý học tập được hỗ trợ bởi AI.

Để bắt đầu, hãy xem qua tệp `src/app/page.tsx`.

## Chạy ứng dụng trên máy cục bộ (Running Locally)

Bạn hoàn toàn có thể chạy và phát triển ứng dụng này trên máy tính của mình. Dưới đây là các bước cần thiết:

### Yêu cầu
- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
- [npm](https://www.npmjs.com/) (thường đi kèm với Node.js)

### 1. Cài đặt các gói phụ thuộc (Dependencies)
Mở một cửa sổ dòng lệnh (terminal) trong thư mục gốc của dự án và chạy lệnh sau:
```bash
npm install
```

### 2. Thiết lập Biến môi trường (Environment Variables)
Để các tính năng AI hoạt động, bạn cần cung cấp khóa API Gemini của mình.

1.  Tạo một tệp mới ở thư mục gốc của dự án và đặt tên là `.env.local`.
2.  Thêm nội dung sau vào tệp, thay thế `your_api_key_here` bằng khóa API thực của bạn:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### 3. Chạy ứng dụng
Ứng dụng này yêu cầu hai tiến trình phải chạy song song. Bạn sẽ cần mở **hai cửa sổ dòng lệnh (terminal)** riêng biệt.

**Trong Terminal 1 - Chạy máy chủ Genkit (AI Backend):**
```bash
npm run genkit:dev
```
Lệnh này sẽ khởi động máy chủ Genkit, nơi xử lý các yêu cầu đến các mô hình AI. Hãy giữ cho terminal này luôn chạy.

**Trong Terminal 2 - Chạy ứng dụng Next.js (Giao diện người dùng):**
```bash
npm run dev
```
Lệnh này sẽ khởi động máy chủ phát triển của Next.js.

### 4. Truy cập ứng dụng
Sau khi cả hai máy chủ đã khởi động thành công, bạn có thể mở trình duyệt và truy cập vào địa chỉ sau để xem ứng dụng:

[http://localhost:9002](http://localhost:9002)

Bây giờ bạn đã có thể tương tác và tiếp tục phát triển ứng dụng trên chính máy tính của mình!