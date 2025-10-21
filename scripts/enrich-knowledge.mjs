import fs from 'node:fs/promises';
import path from 'node:path';

const SUBJECT_SUPPLEMENTS = {
  biology: `- **Lập sơ đồ tư duy cho từng hệ cơ quan:** ghi chú chức năng, cấu trúc và các bệnh lý liên quan để khắc sâu kiến thức sinh lý học.
- **Thường xuyên quan sát thí nghiệm hoặc video mô phỏng:** đối chiếu lý thuyết với hình ảnh thực tế để hiểu cơ chế sinh học.
- **Tự đặt câu hỏi về ứng dụng đời sống:** ví dụ biến đổi gen, công nghệ sinh học, bảo tồn đa dạng sinh học.`,
  chemistry: `- **Tổng hợp bảng phản ứng đặc trưng:** phân loại theo nhóm chất, điều kiện phản ứng và dấu hiệu nhận biết để ghi nhớ lâu dài.
- **Luyện cân bằng phương trình khó:** ưu tiên bài có nhiều chất oxi hóa/khử, phản ứng chu trình hoặc đa bước để nâng cao kỹ năng.
- **Thực hành bài tập định lượng:** tập trung vào bảo toàn khối lượng, bảo toàn electron và phương pháp trung bình nhằm rèn luyện tư duy tính toán.`,
  civics: `- **Kết nối kiến thức với tình huống đời sống:** phân tích các tình huống pháp lý, đạo đức và công dân để thấy rõ ý nghĩa bài học.
- **Ôn tập theo chủ đề lớn:** quyền và nghĩa vụ, tổ chức bộ máy nhà nước, đạo đức, pháp luật… nhằm dễ hệ thống hóa khi làm bài.
- **Theo dõi thời sự:** liên hệ bài học với sự kiện gần đây để tăng khả năng vận dụng trong câu hỏi mở.`,
  english: `- **Học từ vựng theo chủ đề:** ghi chú collocations, từ đồng nghĩa/trái nghĩa và áp dụng vào câu hoàn chỉnh.
- **Luyện bốn kỹ năng cân đối:** nghe podcast, xem video ngắn, đọc tin tức và viết nhật ký để duy trì phản xạ ngôn ngữ.
- **Tự đánh giá phát âm & ngữ pháp:** ghi âm giọng nói, dùng công cụ kiểm tra ngữ pháp để sửa lỗi kịp thời.`,
  geography: `- **Khai thác Atlat và bản đồ số:** luyện kỹ năng xác định tọa độ, phân tích bản đồ khí hậu, dân cư và kinh tế vùng.
- **Ghi nhớ số liệu bằng biểu đồ:** tự vẽ biểu đồ cột, tròn, miền để hiểu sự thay đổi và so sánh giữa các vùng.
- **Liên hệ thực tế địa phương:** quan sát môi trường, tài nguyên, hoạt động kinh tế xung quanh để vận dụng kiến thức địa lý.`,
  history: `- **Lập bảng thời gian:** ghi sự kiện, nhân vật, ý nghĩa để dễ so sánh các giai đoạn lịch sử.
- **Phân tích nguyên nhân - diễn biến - kết quả:** tập trung vào mối quan hệ giữa các sự kiện để hiểu bối cảnh lịch sử.
- **Đọc thêm tư liệu gốc:** nhật ký, hồi ký, văn kiện giúp mở rộng góc nhìn và tăng khả năng làm bài luận.`,
  literature: `- **Đọc toàn văn tác phẩm:** ghi chép cảm nhận, câu dẫn tiêu biểu và phân tích nghệ thuật ngôn từ.
- **Xây dựng dàn ý mẫu:** cho từng kiểu bài (nghị luận xã hội, nghị luận văn học, phân tích nhân vật) để viết nhanh, chuẩn bố cục.
- **Đa dạng hóa ví dụ liên hệ:** sưu tầm dẫn chứng đời sống, tác phẩm khác nhằm làm bài viết phong phú hơn.`,
  math: `- **Ôn công thức trọng tâm:** lập sổ tay ký hiệu, định nghĩa, định lý và điều kiện áp dụng để không bỏ sót kiến thức.
- **Rèn bài tập phân hóa:** chọn thêm bài nâng cao về chứng minh bất đẳng thức, cực trị, tọa độ để mở rộng tư duy.
- **Sử dụng công cụ hỗ trợ:** GeoGebra, máy tính CASIO để kiểm chứng kết quả và quan sát trực quan đồ thị.`,
  physics: `- **Tóm tắt công thức theo chuyên đề:** cơ, nhiệt, điện, quang học… kèm điều kiện áp dụng và đại lượng đặc trưng.
- **Giải bài tập đa bước:** luyện phân tích lực, chọn hệ quy chiếu, thiết lập phương trình bảo toàn cho các bài khó.
- **Thực hành thí nghiệm ảo hoặc mô phỏng:** giúp hình dung hiện tượng và phát hiện lỗi sai trong suy luận.`,
  philosophy: `- **Đọc văn bản gốc của các triết gia:** ghi chú khái niệm then chốt và lập luận chính để hiểu sâu sắc.
- **So sánh trường phái:** duy vật, duy tâm, hiện sinh, phân tích cấu trúc để phát triển tư duy phản biện.
- **Liên hệ thực tiễn xã hội:** phân tích vấn đề đạo đức, công nghệ, chính trị dưới góc nhìn triết học hiện đại.`
};

const PRACTICE_ROADMAPS = {
  biology: `- **Chủ đề gen - ADN - ARN:** làm quen dạng câu hỏi vận dụng cao, giải thích cơ chế sinh học phân tử thông qua sơ đồ và bảng tóm tắt.
- **Sinh thái học ứng dụng:** luyện đề về dòng năng lượng, chuỗi thức ăn và cân bằng hệ sinh thái, liên hệ với biến đổi khí hậu ở Việt Nam.
- **Ôn tập kỹ thuật thực nghiệm:** đọc và phân tích đồ thị, bảng số liệu trong các đề thi học sinh giỏi và tốt nghiệp.`,
  chemistry: `- **Đề tổng hợp vô cơ:** tập trung vào chuỗi phản ứng và bài toán khối lượng kết hợp, ghi chú điều kiện xảy ra phản ứng.
- **Chuyên đề hữu cơ nâng cao:** luyện tập cơ chế phản ứng cộng, thế, trùng hợp với câu hỏi suy luận cấu trúc từ dữ kiện phổ.
- **Thực hành phòng thi:** giới hạn thời gian 50 phút/đề, ghi chú lỗi thường gặp (quên điều kiện, đổi đơn vị, làm tròn).`,
  civics: `- **Phân tích tình huống pháp luật:** chọn đề yêu cầu viện dẫn luật hoặc nghị định mới, luyện cách cấu trúc câu trả lời theo mở bài - thân bài - kết luận.
- **Câu hỏi mở về đạo đức & công dân:** thực hành lập luận hai chiều, đưa ví dụ thực tế và đề xuất giải pháp.
- **Đề trắc nghiệm kỹ năng sống:** ghi nhớ thuật ngữ trọng tâm, luyện phản xạ xử lý câu hỏi tình huống với thời gian ngắn.`,
  english: `- **Reading & Use of English:** luyện đề Cambridge B1/B2, chú ý phân tích cấu trúc đoạn văn và suy luận ý chính.
- **Listening shadowing:** chọn podcast 3-5 phút, ghi lại key words và tóm tắt nội dung bằng tiếng Anh.
- **Writing & Speaking review:** tạo checklist tiêu chí chấm điểm (task response, coherence, grammar, vocabulary) để tự đánh giá.`,
  geography: `- **Atlat chuyên đề:** luyện đề yêu cầu xác định tọa độ, phân tích biểu đồ khí hậu, cơ cấu kinh tế, thực hành viết đoạn nhận xét.
- **Địa lí kinh tế vùng:** so sánh lợi thế từng vùng kinh tế trọng điểm, cập nhật số liệu mới nhất từ Niên giám thống kê.
- **Dạng bài thực tiễn:** áp dụng kiến thức vào quy hoạch đô thị, biến đổi khí hậu, phát triển bền vững ở địa phương.`,
  history: `- **Đề theo trục thời gian:** luyện bảng so sánh các giai đoạn cách mạng, rút ra điểm giống/khác để trả lời câu hỏi tổng hợp.
- **Chứng minh nhận định:** thực hành viết đoạn văn chứng minh ý kiến lịch sử bằng dẫn chứng xác thực.
- **Khai thác nguồn sử liệu:** phân tích bản đồ, ảnh tư liệu, văn kiện để tăng kỹ năng đọc hiểu nguồn.`,
  literature: `- **Đề nghị luận văn học:** luyện viết đủ ba phần, chú trọng phân tích dẫn chứng và liên hệ tác phẩm cùng thời.
- **Đề nghị luận xã hội:** chuẩn bị kho dẫn chứng thời sự, nhân vật truyền cảm hứng, dữ liệu thống kê đáng tin cậy.
- **Luyện viết trong 90 phút:** canh giờ như thi thật, sau mỗi bài tự rà soát bố cục, luận điểm, lỗi diễn đạt.`,
  math: `- **Chuyên đề hàm số & đồ thị:** luyện đề có yêu cầu biện luận nghiệm, khảo sát hàm số, phân tích đồ thị.
- **Tổ hợp - xác suất - xác định:** ôn lại dạng đếm đường đi, nhị thức Niu-tơn, biến ngẫu nhiên rời rạc/liên tục với bài tập phân hóa.
- **Hình học giải tích & không gian:** thực hành dựng tọa độ, chứng minh hình học bằng vector, máy tính cầm tay để kiểm tra kết quả.`,
  physics: `- **Đề cơ học & dao động:** luyện bài tổng hợp lực, bài toán năng lượng, dao động điều hòa ghép hệ.
- **Điện học nâng cao:** tập trung dạng mạch xoay chiều, cộng hưởng, bài toán đồ thị điện áp-dòng điện.
- **Quang học & hạt nhân:** ôn lý thuyết trọng tâm và bài tập tính toán bước sóng, năng lượng, chu kỳ bán rã.`,
  philosophy: `- **Đọc - phản hồi văn bản:** luyện viết phản hồi 300-400 từ cho các trích đoạn triết học hiện đại.
- **Đề so sánh học thuyết:** chuẩn bị bảng đối chiếu quan điểm, phạm trù, phương pháp luận giữa các trường phái.
- **Vận dụng thực tiễn:** phân tích tình huống đạo đức, chính trị, công nghệ dựa trên khung lý thuyết đã học.`,
};

const DATA_ROOT = path.join(process.cwd(), 'data', 'chroma');

/**
 * Updates a single knowledge JSON file by appending modern self-study guidance and practice roadmaps.
 * The enrichment remains idempotent thanks to heading guards before mutating the JSON content.
 */
async function enrichFile(filePath) {
  // Adds modern study guidance and practice roadmaps to each JSON file without duplicating sections.
  const raw = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(raw);
  const key = typeof data.key === 'string' ? data.key : path.basename(filePath, '.json');
  const subjectKey = key.split('-')[0];
  const supplement = SUBJECT_SUPPLEMENTS[subjectKey];
  const roadmap = PRACTICE_ROADMAPS[subjectKey];

  if (typeof data.content !== 'string') {
    return;
  }

  let updated = false;

  if (supplement && !data.content.includes('### Hướng dẫn tự học cập nhật')) {
    data.content = `${data.content.trim()}\n\n### Hướng dẫn tự học cập nhật\n${supplement}\n`;
    updated = true;
  }

  if (roadmap && !data.content.includes('### Lộ trình luyện đề 2025')) {
    data.content = `${data.content.trim()}\n\n### Lộ trình luyện đề 2025\n${roadmap}\n`;
    updated = true;
  }

  if (updated) {
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
}

/**
 * Recursively walks through the data directory so every JSON knowledge file is enriched once.
 */
async function walkDirectory(dirPath) {
  // Recursively traverses the chroma data folder so every JSON file is enriched.
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      await enrichFile(fullPath);
    }
  }
}

await walkDirectory(DATA_ROOT);
