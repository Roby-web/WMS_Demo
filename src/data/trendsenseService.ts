import { TrendsenseNewsItem, Topic } from '../types';

export const GOOGLE_SHEET_CSV_URL = 
  'https://docs.google.com/spreadsheets/d/1KeOFa1LiBku94C7e-XoHzEGC9yQ37UEZsihnaAVdnUw/export?format=csv';

// Pre-populated latest items directly from the Google Sheet
export const FALLBACK_TRENDSENSE_NEWS: TrendsenseNewsItem[] = [
  {
    id: 'ts-01',
    department: 'Sức khỏe',
    publishedAt: '2026-09-03 16:59:33',
    title: 'Hiện tượng El Niño có khả năng tăng cường, có thể trở thành mạnh nhất từng ghi nhận',
    rawDate: '2026-09-03 16:59:33',
  },
  {
    id: 'ts-02',
    department: 'Giải trí',
    publishedAt: '2026-09-03 16:48:46',
    title: 'Nhà thiết kế Phước Dio qua đời sau khi điều trị bệnh hiểm nghèo',
    rawDate: '2026-09-03 16:48:46',
  },
  {
    id: 'ts-03',
    department: 'Pháp luật',
    publishedAt: '2026-09-03 16:44:07',
    title: 'Công an Hưng Yên tạm giữ tài xế xe tải gây tai nạn chết người rồi bỏ trốn',
    rawDate: '2026-09-03 16:44:07',
  },
  {
    id: 'ts-04',
    department: 'Sức khỏe',
    publishedAt: '2026-09-03 16:23:35',
    title: 'Hoa hậu Jang Jin Young qua đời do ung thư dạ dày giai đoạn cuối',
    rawDate: '2026-09-03 16:23:35',
  },
  {
    id: 'ts-05',
    department: 'Thế giới',
    publishedAt: '2026-09-03 16:18:30',
    title: 'Hai người Palestine bị giết và nhiều người khác bị thương sau khi quân đội Israel mở hỏa lực tại Beit Lahiya',
    rawDate: '2026-09-03 16:18:30',
  },
  {
    id: 'ts-06',
    department: 'Thời sự',
    publishedAt: '2026-09-03 15:51:01',
    title: 'Cao tốc Bến Lức - Long Thành dự kiến thông xe sau 12 năm xây dựng',
    rawDate: '2026-09-03 15:51:01',
  },
  {
    id: 'ts-07',
    department: 'Kinh tế',
    publishedAt: '2026-09-03 15:35:20',
    title: 'Giá vàng trong nước lập đỉnh mới, vượt mốc 88 triệu đồng/lượng chiều mua vào',
    rawDate: '2026-09-03 15:35:20',
  },
  {
    id: 'ts-08',
    department: 'Công nghệ',
    publishedAt: '2026-09-03 15:10:45',
    title: 'OpenAI ra mắt mô hình AI thế hệ mới hỗ trợ xử lý dữ liệu truyền thông đa phương tiện',
    rawDate: '2026-09-03 15:10:45',
  },
  {
    id: 'ts-09',
    department: 'Thể thao',
    publishedAt: '2026-09-03 14:55:12',
    title: 'Đội tuyển bóng chuyền nữ Việt Nam giành vé lịch sử dự giải Vô địch thế giới 2026',
    rawDate: '2026-09-03 14:55:12',
  },
  {
    id: 'ts-10',
    department: 'Giáo dục',
    publishedAt: '2026-09-03 14:30:00',
    title: 'Bộ GD&ĐT công bố định dạng đề thi tốt nghiệp THPT theo chương trình giáo dục mới',
    rawDate: '2026-09-03 14:30:00',
  },
  {
    id: 'ts-11',
    department: 'Đời sống',
    publishedAt: '2026-09-03 14:15:30',
    title: 'Hà Nội ghi nhận lượng mưa kỷ lục trong đợt chuyển mùa đầu tháng 9, ngập cục bộ nhiều tuyến',
    rawDate: '2026-09-03 14:15:30',
  },
  {
    id: 'ts-12',
    department: 'Giao thông',
    publishedAt: '2026-09-03 13:50:18',
    title: 'Đoạn trên cao tuyến đường sắt đô thị Nhổn - Ga Hà Nội chính thức vận hành thương mại',
    rawDate: '2026-09-03 13:50:18',
  },
  {
    id: 'ts-13',
    department: 'Môi trường',
    publishedAt: '2026-09-03 13:20:40',
    title: 'Cảnh báo khẩn cấp sạt lở bờ sông Tiền, di dời hơn 150 hộ dân trong đêm',
    rawDate: '2026-09-03 13:20:40',
  },
  {
    id: 'ts-14',
    department: 'Văn hóa',
    publishedAt: '2026-09-03 12:45:00',
    title: 'Khai mạc Festival di sản và văn hóa truyền thống các dân tộc năm 2026',
    rawDate: '2026-09-03 12:45:00',
  },
  {
    id: 'ts-15',
    department: 'Quốc tế',
    publishedAt: '2026-09-03 12:10:25',
    title: 'FED phát tín hiệu cân nhắc điều chỉnh lãi suất cơ bản trong phiên họp chính sách tháng 9',
    rawDate: '2026-09-03 12:10:25',
  },
  {
    id: 'ts-16',
    department: 'Y tế',
    publishedAt: '2026-09-03 11:40:10',
    title: 'Phát hiện biến thể virus hô hấp mới tại khu vực Đông Nam Á, Bộ Y tế khuyến cáo phòng ngừa',
    rawDate: '2026-09-03 11:40:10',
  },
];

/**
 * Format relative time in Vietnamese (e.g. 32' trước, 3h 48' trước)
 */
export function formatTimeAgoVi(publishedAtStr: string, referenceTime: Date = new Date()): string {
  try {
    // Normalise format like '2026-09-03 16:59:33'
    const cleanStr = publishedAtStr.trim().replace(' ', 'T');
    const pubDate = new Date(cleanStr);
    
    if (isNaN(pubDate.getTime())) {
      return publishedAtStr;
    }

    const diffMs = referenceTime.getTime() - pubDate.getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

    if (diffMinutes < 60) {
      return `${diffMinutes}' trước`;
    }

    const hours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `${hours}h trước`;
      }
      return `${hours}h ${remainingMinutes}' trước`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} ngày trước`;
    }

    return pubDate.toLocaleDateString('vi-VN');
  } catch {
    return publishedAtStr;
  }
}

/**
 * Parse standard CSV with quoted values support
 */
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentField.trim());
      if (row.some(cell => cell.length > 0)) {
        result.push(row);
      }
      row = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField || row.length > 0) {
    row.push(currentField.trim());
    if (row.some(cell => cell.length > 0)) {
      result.push(row);
    }
  }

  return result;
}

/**
 * Fetch Trendsense news from public Google Sheet
 */
export async function fetchTrendsenseNews(): Promise<TrendsenseNewsItem[]> {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*',
      },
    });

    if (!response.ok) {
      console.warn('Google Sheet fetch returned status:', response.status);
      return FALLBACK_TRENDSENSE_NEWS;
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (!rows || rows.length < 2) {
      return FALLBACK_TRENDSENSE_NEWS;
    }

    // Identify header positions: Ban, Thời gian xuất bản, Tiêu đề
    const headerRow = rows[0].map(h => h.toLowerCase().trim());
    let deptIdx = headerRow.findIndex(h => h.includes('ban') || h.includes('chuyên mục') || h.includes('category'));
    let timeIdx = headerRow.findIndex(h => h.includes('thời gian') || h.includes('time') || h.includes('ngày') || h.includes('date'));
    let titleIdx = headerRow.findIndex(h => h.includes('tiêu đề') || h.includes('tên') || h.includes('title'));

    if (deptIdx === -1) deptIdx = 0;
    if (timeIdx === -1) timeIdx = 1;
    if (titleIdx === -1) titleIdx = 2;

    const items: TrendsenseNewsItem[] = [];
    const now = new Date();

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      const department = row[deptIdx]?.trim() || 'Thời sự';
      const publishedAt = row[timeIdx]?.trim() || '';
      const title = row[titleIdx]?.trim() || '';

      if (!title) continue;

      items.push({
        id: `ts-${i}-${Date.now().toString(36)}`,
        department,
        publishedAt,
        rawDate: publishedAt,
        title,
        timeAgoText: formatTimeAgoVi(publishedAt, now),
      });
    }

    return items.length > 0 ? items : FALLBACK_TRENDSENSE_NEWS;
  } catch (error) {
    console.warn('Error fetching Trendsense Google Sheet:', error);
    return FALLBACK_TRENDSENSE_NEWS;
  }
}

/**
 * Check if a news title matches any topic in the system
 */
export function findMatchingTopics(newsTitle: string, topics: Topic[]): Topic[] {
  if (!newsTitle || !topics || topics.length === 0) return [];

  const cleanNews = normalizeString(newsTitle);
  const newsWords = cleanNews.split(/\s+/).filter(w => w.length > 2);

  return topics.filter(topic => {
    const cleanTopic = normalizeString(topic.title);

    // Exact match or substring inclusion
    if (cleanTopic === cleanNews) return true;
    if (cleanTopic.includes(cleanNews) || cleanNews.includes(cleanTopic)) return true;

    // Check significant word intersection
    if (newsWords.length >= 3) {
      let matchedWords = 0;
      for (const word of newsWords) {
        if (cleanTopic.includes(word)) {
          matchedWords++;
        }
      }
      const overlapRatio = matchedWords / newsWords.length;
      if (overlapRatio >= 0.65 && matchedWords >= 4) {
        return true;
      }
    }

    return false;
  });
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
