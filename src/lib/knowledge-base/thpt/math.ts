// src/lib/knowledge-base/thpt/math.ts
export const math = `
  Đại số và Giải tích 10:
  Chương 1: MỆNH ĐỀ - TẬP HỢP
  - Mệnh đề: Là một khẳng định đúng hoặc một khẳng định sai.
  - Mệnh đề phủ định (của P, kí hiệu là P̅): Nếu P đúng thì P̅ sai, nếu P sai thì P̅ đúng.
  - Mệnh đề kéo theo (P ⇒ Q): Chỉ sai khi P đúng và Q sai.
  - Mệnh đề tương đương (P ⇔ Q): Đúng khi P và Q cùng đúng hoặc cùng sai.
  - Tập hợp: Một sự sưu tập các đối tượng.
  - Các phép toán tập hợp:
    + Giao (A ∩ B): Gồm các phần tử thuộc cả A và B.
    + Hợp (A ∪ B): Gồm các phần tử thuộc A hoặc thuộc B.
    + Hiệu (A \\ B): Gồm các phần tử thuộc A nhưng không thuộc B.
    + Phần bù (C_E A): Là E \\ A, khi A là tập con của E.

  Chương 2: HÀM SỐ BẬC NHẤT VÀ BẬC HAI
  - Hàm số: Một quy tắc cho mỗi giá trị x thuộc tập D có một và chỉ một giá trị y tương ứng. D là tập xác định.
  - Hàm số bậc nhất y = ax + b (a ≠ 0):
    + Đồng biến khi a > 0, nghịch biến khi a < 0.
    + Đồ thị là một đường thẳng.
  - Hàm số bậc hai y = ax² + bx + c (a ≠ 0):
    + Đồ thị là một parabol có đỉnh I(-b/2a, -Δ/4a) và trục đối xứng x = -b/2a.
    + Bề lõm hướng lên trên nếu a > 0, hướng xuống dưới nếu a < 0.
  - Dấu của tam thức bậc hai f(x) = ax² + bx + c:
    + Nếu Δ < 0: f(x) luôn cùng dấu với a.
    + Nếu Δ = 0: f(x) luôn cùng dấu với a (trừ x = -b/2a).
    + Nếu Δ > 0: f(x) có hai nghiệm x₁, x₂. "Trong trái, ngoài cùng".

  Chương 3: PHƯƠNG TRÌNH, HỆ PHƯƠNG TRÌNH
  - Phương trình bậc nhất hai ẩn, phương trình bậc hai một ẩn.
  - Định lý Vi-ét cho phương trình bậc hai ax² + bx + c = 0 (có 2 nghiệm x₁, x₂):
    + Tổng nghiệm: S = x₁ + x₂ = -b/a
    + Tích nghiệm: P = x₁ * x₂ = c/a

  Hình học 10:
  Chương 4: VECTƠ
  - Vectơ: Là một đoạn thẳng có hướng. Kí hiệu AB→.
  - Quy tắc ba điểm: AB→ + BC→ = AC→
  - Quy tắc hình bình hành: Nếu ABCD là hình bình hành thì AB→ + AD→ = AC→.
  - Tích của vectơ với một số: k * a→.
  - Tích vô hướng của hai vectơ: a→ ⋅ b→ = |a→| * |b→| * cos(a→, b→).
  - Phương pháp tọa độ trong mặt phẳng (Oxy):
    + Cho A(xₐ, yₐ), B(xₑ, yₑ) thì AB→ = (xₑ - xₐ, yₑ - yₐ).
    + |AB→| = √((xₑ - xₐ)² + (yₑ - yₐ)²).
    + a→(u₁, u₂) ⋅ b→(v₁, v₂) = u₁v₁ + u₂v₂.
    + a→ ⊥ b→ ⇔ u₁v₁ + u₂v₂ = 0.

  Chương 5: HỆ THỨC LƯỢNG TRONG TAM GIÁC
  - Cho tam giác ABC, cạnh a đối diện góc A, b đối diện góc B, c đối diện góc C. R là bán kính đường tròn ngoại tiếp, r là bán kính đường tròn nội tiếp, p là nửa chu vi.
  - Định lý Cosin: a² = b² + c² - 2bc*cos(A)
  - Định lý Sin: a/sin(A) = b/sin(B) = c/sin(C) = 2R
  - Công thức diện tích (S): S = ½ab*sin(C) = pr = √(p(p-a)(p-b)(p-c))

  Thống kê và Xác suất 10:
  Chương 6: THỐNG KÊ
  - Số trung bình, trung vị, mốt.
  - Phương sai và độ lệch chuẩn: Các số đo độ phân tán của mẫu số liệu.

  Lớp 11: ... (Bạn có thể bổ sung)
  Lớp 12: ... (Bạn có thể bổ sung)
`;
