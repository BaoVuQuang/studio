// src/lib/knowledge-base/daihoc/math.ts
export const math = `
Kiến thức Toán cao cấp (Đại cương)

Toán cao cấp là tên gọi chung cho các môn toán cơ bản được giảng dạy trong chương trình đại cương của các trường đại học khối kỹ thuật, kinh tế và khoa học tự nhiên. Nội dung chủ yếu bao gồm Giải tích, Đại số tuyến tính và Xác suất thống kê.

**1. Giải tích (Calculus):**
*   **Giải tích 1 (Hàm một biến):**
    *   **Giới hạn và Liên tục:**
        *   Giới hạn của dãy số. Các định lý về giới hạn.
        *   Giới hạn của hàm số. Vô cùng bé (VCB), vô cùng lớn (VCL), các quy tắc ngắt bỏ VCB, VCL.
        *   Các dạng vô định: $\\frac{0}{0}, \\frac{\\infty}{\\infty}, 0 \cdot \\infty, \\infty - \\infty, 1^\\infty, 0^0, \\infty^0$.
        *   Hàm số liên tục tại một điểm, trên một khoảng.
    *   **Đạo hàm và Vi phân:**
        *   Định nghĩa đạo hàm. Ý nghĩa hình học và cơ học.
        *   Các quy tắc tính đạo hàm. Đạo hàm cấp cao.
        *   Vi phân: Định nghĩa và ứng dụng tính gần đúng.
        *   Các định lý về giá trị trung bình: Rolle, Lagrange, Cauchy.
        *   Công thức Taylor, Maclaurin. Ứng dụng khai triển hàm số.
        *   Quy tắc L'Hôpital để khử dạng vô định.
    *   **Khảo sát hàm số:** Chiều biến thiên, cực trị, tiệm cận, lồi lõm, điểm uốn.
    *   **Tích phân:**
        *   Tích phân bất định: Nguyên hàm, các phương pháp tính (đổi biến, từng phần).
        *   Tích phân xác định: Định nghĩa theo tổng Riemann, tính chất, công thức Newton-Leibniz.
        *   Ứng dụng: Tính diện tích, độ dài cung, thể tích và diện tích vật thể tròn xoay.
        *   Tích phân suy rộng: Loại 1 (cận vô hạn) và loại 2 (hàm không bị chặn).

*   **Giải tích 2 (Hàm nhiều biến):**
    *   **Hàm số nhiều biến:** Tập xác định, giới hạn, tính liên tục.
    *   **Đạo hàm riêng và Vi phân toàn phần:** Đạo hàm riêng cấp 1, cấp cao. Vi phân toàn phần.
    *   **Cực trị:** Cực trị tự do (điều kiện cần, điều kiện đủ), cực trị có điều kiện (phương pháp nhân tử Lagrange).
    *   **Tích phân bội:**
        *   Tích phân kép (hai lớp): Định nghĩa, cách tính trong hệ tọa độ Descartes và tọa độ cực.
        *   Tích phân bội ba (ba lớp): Cách tính trong hệ tọa độ Descartes, trụ và cầu.
        *   Ứng dụng tính diện tích mặt, thể tích vật thể.
    *   **Tích phân đường, tích phân mặt:** Các loại và ứng dụng.

**2. Đại số tuyến tính (Linear Algebra):**
*   **Ma trận và Định thức:**
    *   Các phép toán trên ma trận: cộng, trừ, nhân ma trận với số, nhân hai ma trận, chuyển vị.
    *   Định thức của ma trận vuông: Tính chất và các phương pháp tính (khai triển, đưa về dạng tam giác).
    *   Ma trận nghịch đảo: Điều kiện tồn tại và các phương pháp tìm (phần phụ đại số, khử Gauss-Jordan).
*   **Hệ phương trình tuyến tính:**
    *   Phương pháp khử Gauss.
    *   Phương pháp Cramer.
    *   Hạng của ma trận và điều kiện có nghiệm của hệ phương trình (Định lý Kronecker-Capelli).
*   **Không gian vector:**
    *   Định nghĩa, không gian con.
    *   Sự độc lập tuyến tính, phụ thuộc tuyến tính. Cơ sở và số chiều.
*   **Ánh xạ tuyến tính:**
    *   Định nghĩa, ma trận của ánh xạ tuyến tính.
    *   Giá trị riêng, vector riêng của ma trận.
    *   Chéo hóa ma trận: Điều kiện và cách chéo hóa.
*   **Dạng toàn phương:** Đưa dạng toàn phương về dạng chính tắc bằng phép biến đổi trực giao (phương pháp Lagrange).

**3. Xác suất và Thống kê (Probability and Statistics):**
*   **Xác suất:**
    *   Phép thử và biến cố. Các định nghĩa về xác suất (cổ điển, thống kê).
    *   Các công thức tính xác suất: Cộng, nhân (cho biến cố độc lập và phụ thuộc).
    *   Công thức xác suất đầy đủ và công thức Bayes.
    *   Dãy phép thử Bernoulli.
*   **Biến ngẫu nhiên và quy luật phân phối xác suất:**
    *   Biến ngẫu nhiên rời rạc, liên tục.
    *   Các đặc trưng số: kỳ vọng (giá trị trung bình), phương sai, độ lệch chuẩn.
    *   Một số quy luật phân phối thông dụng: Nhị thức, Poisson, Chuẩn.
*   **Thống kê:**
    *   Mẫu thống kê và các đặc trưng mẫu.
    *   Ước lượng tham số: Ước lượng điểm, ước lượng khoảng tin cậy.
    *   Kiểm định giả thuyết thống kê về các tham số (kỳ vọng, phương sai, tỷ lệ).
`;
