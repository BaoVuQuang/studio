// src/lib/knowledge-base/thpt/math-10.ts
export const math10 = `
Kiến thức Toán Lớp 10

**Phần 1: Đại số**
*   **Chương 1: Mệnh đề - Tập hợp**
    + **Mệnh đề:** Khái niệm, mệnh đề phủ định, mệnh đề kéo theo ($P \\Rightarrow Q$), mệnh đề đảo, mệnh đề tương đương ($P \\Leftrightarrow Q$). Kí hiệu $\\forall$ (với mọi), $\\exists$ (tồn tại).
    + **Tập hợp:** Cách xác định, tập hợp rỗng, tập hợp con.
    + **Các phép toán trên tập hợp:** Giao ($A \\cap B$), hợp ($A \\cup B$), hiệu ($A \\setminus B$), phần bù.
    + **Các tập hợp số:** $N, Z, Q, R$. Các tập con thường dùng của R: khoảng, đoạn, nửa khoảng.
*   **Chương 2: Hàm số bậc nhất và bậc hai**
    + **Hàm số:** Định nghĩa, tập xác định. Sự biến thiên (đồng biến, nghịch biến). Tính chẵn lẻ.
    + **Hàm số bậc nhất ($y = ax + b, a \\ne 0$):** Khảo sát sự biến thiên và vẽ đồ thị.
    + **Hàm số bậc hai ($y = ax^2 + bx + c, a \\ne 0$):** Khảo sát sự biến thiên và vẽ đồ thị Parabol (xác định đỉnh $I(-\\frac{b}{2a}, -\\frac{\\Delta}{4a})$, trục đối xứng, giao điểm).
*   **Chương 3: Phương trình, hệ phương trình**
    + **Đại cương về phương trình.** Phương trình tương đương, phương trình hệ quả.
    + **Phương trình quy về bậc nhất, bậc hai:** Phương trình chứa ẩn ở mẫu, phương trình chứa ẩn trong dấu căn.
    + **Hệ phương trình bậc nhất nhiều ẩn** (2 ẩn, 3 ẩn): giải bằng phương pháp cộng đại số, phương pháp thế.
*   **Chương 4: Bất đẳng thức - Bất phương trình**
    + **Bất đẳng thức:** Tính chất. Bất đẳng thức về giá trị tuyệt đối. **Bất đẳng thức Cauchy (Cô-si)** cho 2 số không âm: $\\frac{a+b}{2} \\ge \\sqrt{ab}$.
    + **Bất phương trình bậc nhất một ẩn.**
    + **Dấu của nhị thức bậc nhất ($f(x) = ax + b$):** Quy tắc "phải cùng, trái khác". Xét dấu tích, thương.
    + **Bất phương trình bậc hai một ẩn:**
        *   **Dấu của tam thức bậc hai ($f(x) = ax^2 + bx + c$):** Định lí về dấu (dựa vào dấu của a và $\\Delta$).
        *   Giải bất phương trình bậc hai.
*   **Chương 6: Cung và góc lượng giác - Công thức lượng giác**
    + **Đường tròn lượng giác:** Đơn vị độ và radian.
    + **Giá trị lượng giác của một cung:** sin, cos, tan, cot.
    + **Các hệ thức lượng giác cơ bản:** $\\sin^2\\alpha + \\cos^2\\alpha = 1$, $1 + \\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}$, ...
    + **Công thức lượng giác:**
        *   Công thức cộng: $\\cos(a-b), \\sin(a-b), ...$
        *   Công thức nhân đôi: $\\sin(2a), \\cos(2a), \\tan(2a)$.
        *   Công thức biến đổi tổng thành tích và tích thành tổng.

**Phần 2: Hình học**
*   **Chương 1: Vectơ**
    + **Định nghĩa:** Vectơ, vectơ-không, độ dài, hai vectơ cùng phương, cùng hướng, bằng nhau.
    + **Các phép toán:**
        *   Tổng, hiệu của hai vectơ (quy tắc 3 điểm, quy tắc hình bình hành).
        *   Tích của vectơ với một số.
    + **Hệ trục tọa độ Oxy:** Tọa độ của điểm, tọa độ của vectơ. Biểu thức tọa độ của các phép toán vectơ.
*   **Chương 2: Tích vô hướng của hai vectơ và ứng dụng**
    + **Định nghĩa:** $\\vec{a} \\cdot \\vec{b} = |\\vec{a}| \\cdot |\\vec{b}| \\cdot \\cos(\\vec{a}, \\vec{b})$.
    + **Biểu thức tọa độ của tích vô hướng.**
    + **Ứng dụng:** Tính độ dài vectơ, tính góc giữa hai vectơ.
    + **Hệ thức lượng trong tam giác:**
        *   Định lý cosin: $a^2 = b^2 + c^2 - 2bc \\cos A$.
        *   Định lý sin: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$.
        *   Các công thức tính diện tích tam giác.
*   **Chương 3: Phương pháp tọa độ trong mặt phẳng (Oxy)**
    + **Phương trình đường thẳng:**
        *   Phương trình tham số.
        *   Phương trình tổng quát ($Ax + By + C = 0$).
    + **Vị trí tương đối của hai đường thẳng.**
    + **Góc giữa hai đường thẳng. Khoảng cách từ một điểm đến một đường thẳng.**
    + **Phương trình đường tròn:** Dạng $(x-a)^2 + (y-b)^2 = R^2$ và dạng khai triển.
    + **Phương trình đường Elip (chính tắc).**
`;
