const knowledgeBase: Record<string, string> = {
    math: `
  Định nghĩa Đạo hàm: Trong giải tích, đạo hàm của một hàm số thực là một phép toán đo lường sự biến thiên của hàm số tại một điểm nào đó. Đạo hàm của hàm số y = f(x) tại điểm x₀ được ký hiệu là f'(x₀) hoặc dy/dx|x=x₀.
  
  Công thức tính đạo hàm cơ bản:
  - (C)' = 0 (với C là hằng số)
  - (x^n)' = n*x^(n-1)
  - (sin(x))' = cos(x)
  - (cos(x))' = -sin(x)
  - (e^x)' = e^x
  - (ln(x))' = 1/x
  `,
    science: `
  Nước (H₂O) là một hợp chất hóa học của oxy và hydro. Ở điều kiện tiêu chuẩn, nó là một chất lỏng không màu, không mùi, không vị.
  
  Các trạng thái của nước:
  - Rắn: Dưới 0°C (nước đá)
  - Lỏng: Từ 0°C đến 100°C
  - Khí: Trên 100°C (hơi nước)
  `,
    history: `
  Cách mạng Tháng Tám năm 1945 là một cuộc cách mạng do Đảng Cộng sản Việt Nam lãnh đạo để giành chính quyền từ tay phát xít Nhật và thực dân Pháp, thành lập nước Việt Nam Dân chủ Cộng hòa.
  
  Sự kiện chính:
  - Ngày 19/8/1945: Khởi nghĩa giành chính quyền tại Hà Nội.
  - Ngày 2/9/1945: Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.
  `,
    literature: `
  "Truyện Kiều" của Nguyễn Du là một kiệt tác của văn học Việt Nam. Tác phẩm được viết bằng chữ Nôm, theo thể thơ lục bát.
  
  Nội dung chính: Kể về cuộc đời 15 năm lưu lạc, chìm nổi của Thúy Kiều, một người con gái tài sắc vẹn toàn nhưng số phận éo le.
  `,
    'computer-science': `
  React là một thư viện JavaScript mã nguồn mở để xây dựng giao diện người dùng (UI).
  
  Các khái niệm cốt lõi:
  - Components: Các khối xây dựng độc lập và có thể tái sử dụng.
  - JSX: Một phần mở rộng cú pháp cho JavaScript, cho phép viết mã giống HTML trong các tệp JavaScript.
  - State & Props: Dữ liệu quản lý trạng thái của component và dữ liệu được truyền từ component cha xuống component con.
  `,
  };
  
  export function getKnowledgeBase(subject: string): string | undefined {
    return knowledgeBase[subject];
  }
  