# Knowledge Base Review

## Data Source and Loading Flow
- The runtime knowledge base is now loaded lazily from JSON files in `data/chroma`, avoiding bundling the textual payload in the client. The loader normalizes the key, caches results, and falls back between grade-specific and general subjects for each education level.【F:src/lib/knowledge-base.ts†L1-L52】
- JSON files are generated from the existing TypeScript modules via `scripts/export-knowledge.ts`, which mirrors the subject mappings defined in the per-level index files inside `src/lib/knowledge-base` to keep the textual content in one source of truth.【F:scripts/export-knowledge.ts†L1-L36】【F:src/lib/knowledge-base/thpt/index.ts†L1-L86】【F:src/lib/knowledge-base/thcs/index.ts†L1-L66】【F:src/lib/knowledge-base/daihoc/index.ts†L1-L23】

## Coverage by Education Level
| Level | Subjects & Keys | Notes |
| --- | --- | --- |
| THCS | Toán, Văn, Lịch sử, Địa lí, GDCD, Tiếng Anh, Vật lí, Hóa học, Sinh học; hầu hết có biến thể từng khối 6-9, riêng Tiếng Anh chỉ có một bộ nội dung chung.【F:src/lib/knowledge-base/thcs/index.ts†L1-L66】 | Nên cân nhắc bổ sung nội dung riêng cho Tiếng Anh theo từng khối để đồng đều với môn khác. |
| THPT | Toán, Lí, Hóa, Sinh, Văn, Sử, Địa, GDCD, Tiếng Anh; mỗi môn có phiên bản tổng quát và biến thể cho từng lớp 10-12.【F:src/lib/knowledge-base/thpt/index.ts†L1-L86】 | Bố cục tốt cho việc tái sử dụng; cần làm rõ khi nào dùng bản tổng quát so với lớp cụ thể. |
| Đại học | Toán, Lí, Hóa, Sinh, Văn, Sử, Địa, Tiếng Anh, Chính trị/triết học (dùng cùng nội dung với `civics`).【F:src/lib/knowledge-base/daihoc/index.ts†L1-L23】 | Chỉ có mỗi môn một bộ nội dung, phù hợp vì không phân lớp. |

## Content Characteristics
- Các tệp sử dụng markdown tiếng Việt với cấu trúc đề mục rõ ràng theo chương/bài, ví dụ Sinh học 10 có các phần giới thiệu thế giới sống, sinh học tế bào, vi sinh vật kèm mô tả chi tiết từng chủ đề.【F:src/lib/knowledge-base/thpt/biology-10.ts†L1-L73】
- Những môn khác giữ phong cách tương tự với danh sách bullet và tách chương rõ ràng, như Toán 6 bao gồm số học, hình học và các chủ đề nâng cao cho học sinh cấp hai.【F:src/lib/knowledge-base/thcs/math-6.ts†L1-L74】
- Các đoạn mô tả đều là văn bản thuần túy, không đi kèm metadata như mục tiêu học tập, độ khó hay liên kết tài nguyên ngoài, nên việc tái sử dụng cho các tính năng khác (ví dụ quiz, gợi ý tài nguyên) còn hạn chế.

## Observations and Improvement Opportunities
1. **Phạm vi nội dung chưa đồng đều:** Một số môn chỉ có nội dung chung (ví dụ Tiếng Anh THCS) trong khi các môn khác tách riêng theo khối; cần thống nhất chiến lược để hệ thống ưu tiên đúng bộ kiến thức.【F:src/lib/knowledge-base/thcs/index.ts†L34-L66】
2. **Thiếu metadata có cấu trúc:** Hiện chỉ có chuỗi markdown thô, không có thẻ mô tả kỹ năng, chủ đề con hoặc trọng số bài học. Khi tích hợp với hệ thống tìm kiếm hoặc quiz, nên bổ sung metadata tách rời nội dung chính.
3. **Chưa có kiểm thử tính toàn vẹn:** Không có script nào xác nhận JSON được sinh đúng định dạng (ví dụ khóa trùng, nội dung rỗng). Có thể thêm bước lint/validate trong CI để đảm bảo chất lượng dữ liệu ổn định.
4. **Quy trình cập nhật:** Việc chỉnh sửa cần thay đổi file TypeScript rồi chạy script xuất JSON thủ công. Nên bổ sung tài liệu hướng dẫn và tự động hóa (npm script + kiểm tra git diff) để tránh lệch pha giữa nguồn TypeScript và JSON runtime.

## Suggested Next Steps
- **Chuẩn hóa metadata:** Thiết kế schema (ví dụ `{grade, subject, topics[], difficulty}`) lưu riêng trong JSON để phục vụ truy vấn nâng cao và cá nhân hóa quiz.
- **Bổ sung lớp Tiếng Anh theo khối:** Viết thêm nội dung cho các lớp THCS/THPT nhằm cân bằng trải nghiệm giữa môn học.【F:src/lib/knowledge-base/thcs/index.ts†L22-L66】【F:src/lib/knowledge-base/thpt/index.ts†L27-L86】
- **Thiết lập kiểm tra tự động:** Thêm script validate chạy trong CI để phát hiện khóa trùng, nội dung thiếu dòng tiêu đề hoặc chiều dài quá ngắn trước khi xuất bản.
