export type TopicStatus = 'Chờ duyệt' | 'Đang triển khai' | 'Lên kế hoạch' | 'Từ chối' | 'Hoàn thành' | 'Quá hạn';

export type PriorityLevel = 'Quan trọng' | 'Bình thường' | 'Ưu tiên cao';

export type UserRole = 'Ban biên tập' | 'Trưởng ban' | 'Phóng viên';

export type SensitivityLevel = 1 | 2 | 3;

export const SENSITIVITY_LEVELS = [
  { level: 1 as const, name: 'Mức 1: Thông thường', shortName: 'Mức 1', description: 'Theo dõi thường quy, tuân thủ quy chuẩn biên tập' },
  { level: 2 as const, name: 'Mức 2: Tăng cường', shortName: 'Mức 2', description: 'Cần Trưởng ban duyệt góc tiếp cận, kiểm chứng nguồn tin chặt chẽ' },
  { level: 3 as const, name: 'Mức 3: Đặc biệt', shortName: 'Mức 3', description: 'Báo cáo trực tiếp Ban biên tập chỉ đạo, kiểm duyệt trước khi xuất bản' },
];

export const SENSITIVITY_CATEGORIES = [
  'Chính trị, Đảng, Nhà nước',
  'Lịch sử, danh nhân, sản phẩm khai thác lịch sử',
  'Quốc phòng, an ninh, chủ quyền lãnh thổ, khủng bố, bạo lực có tổ chức',
  'Đối ngoại, quan hệ quốc tế',
  'Tư pháp, điều tra, phòng chống tham nhũng, Chống phá nhà nước, phản động',
  'Trẻ em, nạn nhân, nhóm cần bảo vệ đặc biệt',
  'Dân tộc, tôn giáo, tín ngưỡng, nhân quyền',
  'An ninh phi truyền thống: tài chính - tiền tệ, năng lượng, dịch bệnh, thảm họa',
] as const;

export type SensitivityCategory = typeof SENSITIVITY_CATEGORIES[number];

export interface Topic {
  id: string;
  stt: number;
  title: string;
  category?: string;
  author: string;
  authorAvatar?: string;
  department: string;
  status: TopicStatus;
  deadline: string; // e.g. "17/1, 20:00"
  deadlineDate: string; // YYYY-MM-DD or relative
  isDueToday: boolean;
  daysUntilDeadline: number; // 0 = today, < 0 = overdue, 1-3 = next 3 days, >3 = later
  isImportant: boolean;
  isEditorAssigned?: boolean;
  fromTrendsense?: boolean;
  trendsenseNewsId?: string;
  userNeed?: string;
  commentsCount?: number;
  tags?: string[];
  description?: string;
  createdAt: string;
  articleStatus?: 'Chưa tạo bài' | 'Đã tạo bài' | string;
  publishPeriod?: 'in_range_1_7' | 'after_7' | 'no_deadline';
  isSensitive?: boolean;
  sensitivityLevel?: SensitivityLevel;
  sensitivityCategory?: string;
}

export interface TrendsenseNewsItem {
  id: string;
  department: string; // Ban
  publishedAt: string; // Thời gian xuất bản
  title: string; // Tiêu đề
  timeAgoText?: string;
  rawDate?: string;
  feedType?: 'important' | 'my_feed';
}

export interface NotificationItem {
  id: string;
  user: string;
  action: string;
  topicTitle: string;
  timeAgo: string;
  type: 'approved' | 'rejected' | 'accepted' | 'comment' | 'warning';
}

export type ActiveFilterTab = 'all' | 'assigned' | 'important' | 'completed' | 'in_progress' | 'overdue' | 'trendsense_matched';

