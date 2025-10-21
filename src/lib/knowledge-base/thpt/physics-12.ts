// src/lib/knowledge-base/thpt/physics-12.ts
export const physics12 = `
Kiến thức Vật lí Lớp 12 (Chương trình cũ)

**Chương 1: Dao động cơ**
*   **Dao động điều hòa:**
    + Phương trình: $x = A \\cos(\\omega t + \\phi)$.
    + Các đại lượng: li độ (x), biên độ (A), tần số góc ($\\omega$), pha ($\omega t + \\phi$), pha ban đầu ($\phi$).
    + Vận tốc: $v = -A\\omega \\sin(\\omega t + \\phi)$.
    + Gia tốc: $a = -A\\omega^2 \\cos(\\omega t + \\phi) = -\\omega^2 x$.
*   **Con lắc lò xo:** Tần số góc $\\omega = \\sqrt{k/m}$. Chu kì $T = 2\\pi \\sqrt{m/k}$.
*   **Con lắc đơn:** Tần số góc $\\omega = \\sqrt{g/l}$ (khi góc lệch nhỏ). Chu kì $T = 2\\pi \\sqrt{l/g}$.
*   **Năng lượng trong dao động điều hòa:** Động năng, thế năng, cơ năng. $W = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2A^2$.
*   **Tổng hợp dao động điều hòa** cùng phương, cùng tần số.
*   **Dao động tắt dần, dao động cưỡng bức, hiện tượng cộng hưởng.**

**Chương 2: Sóng cơ và sóng âm**
*   **Sóng cơ:** Quá trình lan truyền dao động trong môi trường vật chất.
*   **Các đặc trưng:** Biên độ, chu kì (T), tần số (f), bước sóng ($\\lambda = vT = v/f$).
*   **Giao thoa sóng:** Hiện tượng hai sóng kết hợp gặp nhau, tạo ra các điểm có biên độ cực đại, cực tiểu.
*   **Sóng dừng:** Giao thoa của sóng tới và sóng phản xạ. Có các nút và bụng sóng.
*   **Sóng âm:** Là sóng cơ truyền trong các môi trường rắn, lỏng, khí.
*   **Các đặc trưng của âm:** Độ cao (gắn với tần số), độ to (gắn với mức cường độ âm), âm sắc (gắn với đồ thị dao động).

**Chương 3: Dòng điện xoay chiều**
*   **Đại cương:** Nguyên tắc tạo ra, các giá trị hiệu dụng ($I = I_0/\\sqrt{2}, U = U_0/\\sqrt{2}$).
*   **Các loại mạch điện xoay chiều:**
    *   Mạch chỉ có R, L, C.
    *   **Đoạn mạch RLC nối tiếp:** Tổng trở $Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$. Độ lệch pha $\\tan\\phi = (Z_L - Z_C)/R$. Định luật Ohm: $I = U/Z$.
*   **Hiện tượng cộng hưởng điện:** Khi $Z_L = Z_C$, $Z_{min}=R$, $I_{max}$, $\phi=0$.
*   **Công suất tiêu thụ:** $P = UI \\cos\\phi = I^2 R$. Hệ số công suất $\\cos\\phi = R/Z$.
*   **Máy phát điện xoay chiều, động cơ không đồng bộ ba pha.**
*   **Truyền tải điện năng và máy biến áp:** $U_1/U_2 = N_1/N_2$.

**Chương 4: Dao động và sóng điện từ**
*   **Mạch dao động LC:** Dao động điện từ tự do. Chu kì riêng $T = 2\\pi \\sqrt{LC}$.
*   **Năng lượng điện từ.**
*   **Sóng điện từ:** Là điện từ trường lan truyền trong không gian. Là sóng ngang, truyền được trong chân không với vận tốc c.
*   **Thang sóng điện từ:** Sóng vô tuyến, tia hồng ngoại, ánh sáng nhìn thấy, tia tử ngoại, tia X, tia gamma.
*   **Nguyên tắc thông tin liên lạc bằng sóng vô tuyến.**

**Chương 5: Sóng ánh sáng**
*   **Tán sắc ánh sáng:** Sự phân tách chùm ánh sáng trắng thành các màu biến thiên liên tục.
*   **Giao thoa ánh sáng:** Thí nghiệm Y-âng (Young). Vị trí vân sáng $x_s = k \\frac{\\lambda D}{a}$, vị trí vân tối $x_t = (k+1/2) \\frac{\\lambda D}{a}$. Khoảng vân $i = \\frac{\\lambda D}{a}$.
*   **Các loại quang phổ:** Liên tục, vạch phát xạ, vạch hấp thụ.
*   **Tia hồng ngoại, tia tử ngoại, tia X (tia Rơn-ghen).**

**Chương 6: Lượng tử ánh sáng**
*   **Hiện tượng quang điện.** Thuyết lượng tử ánh sáng (thuyết phôtôn).
*   **Công thức Einstein:** $hf = A + W_{đ max}$. Giới hạn quang điện.
*   **Hiện tượng quang điện trong.** Pin quang điện.
*   **Mẫu nguyên tử Bohr:** Hai tiên đề Bohr. Quang phổ vạch của nguyên tử hiđrô.
*   **Sơ lược về Laze (Laser).**

**Chương 7: Hạt nhân nguyên tử**
*   **Cấu tạo và tính chất hạt nhân:** Proton, nơtron. Độ hụt khối và năng lượng liên kết.
*   **Phản ứng hạt nhân:** Bảo toàn số khối và điện tích.
*   **Phóng xạ:** Đặc điểm và các loại tia ($\\alpha, \\beta^+, \\beta^-, \\gamma$). Định luật phóng xạ $N(t) = N_0 e^{-\\lambda t}$. Chu kì bán rã T.
*   **Phản ứng phân hạch, phản ứng nhiệt hạch.**
`;
