export type TopicStatus = 'Chờ duyệt' | 'Đang triển khai' | 'Lên kế hoạch' | 'Từ chối' | 'Hoàn thành' | 'Quá hạn';

export type PriorityLevel = 'Quan trọng' | 'Bình thường' | 'Ưu tiên cao';

export type UserRole = 'Ban biên tập' | 'Trưởng ban' | 'Phóng viên';

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
}

export interface TrendsenseNewsItem {
  id: string;
  department: string; // Ban
  publishedAt: string; // Thời gian xuất bản
  title: string; // Tiêu đề
  timeAgoText?: string;
  rawDate?: string;
}

export interface NotificationItem {
  id: string;
  user: string;
  action: string;
  topicTitle: string;
  timeAgo: string;
  type: 'approved' | 'rejected' | 'accepted' | 'comment';
}

export type ActiveFilterTab = 'all' | 'assigned' | 'important' | 'completed' | 'in_progress' | 'overdue' | 'trendsense_matched';

