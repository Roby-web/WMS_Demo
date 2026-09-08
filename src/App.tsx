import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ImportantTopicsStats, getTopicArticleWorkflow } from './components/ImportantTopicsStats';
import { TrendsenseNewsBox } from './components/TrendsenseNewsBox';
import { NotificationBanner } from './components/NotificationBanner';
import { FilterBar } from './components/FilterBar';
import { TopicsTable } from './components/TopicsTable';
import { CreateTopicModal } from './components/CreateTopicModal';
import { TopicDetailModal } from './components/TopicDetailModal';
import { SensitiveLevel3Alert } from './components/SensitiveLevel3Alert';
import { INITIAL_TOPICS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Topic, TopicStatus, ActiveFilterTab, NotificationItem, TrendsenseNewsItem, UserRole, SensitivityLevel } from './types';
import { CheckCircle, AlertCircle, Info, Zap, X, ShieldAlert } from 'lucide-react';

export default function App() {
  // User role state (Ban biên tập / Trưởng ban / Phóng viên)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Ban biên tập');

  // Navigation & layout state
  const [activeNav, setActiveNav] = useState('WMS');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('list');

  // Notification state - hidden by default as requested by the user
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Topics dataset state
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);

  // Filtering & Search state
  const [selectedStatFilter, setSelectedStatFilter] = useState<string | null>(null);
  const [activeTrendsenseFilterTitle, setActiveTrendsenseFilterTitle] = useState<string | null>(null);
  const [trendsenseMatchedTopicIds, setTrendsenseMatchedTopicIds] = useState<string[] | null>(null);
  const [filterOnlyLevel3Sensitive, setFilterOnlyLevel3Sensitive] = useState<boolean>(false);
  const [filterOnlyLevel2Sensitive, setFilterOnlyLevel2Sensitive] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUserNeed, setSelectedUserNeed] = useState('all');
  const [dateRange, setDateRange] = useState('1/1/2026 - 7/1/2026');

  // Advanced filter states
  const [selectedDeadlineRange, setSelectedDeadlineRange] = useState('all');
  const [selectedDeadlineStatus, setSelectedDeadlineStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedArticleStatus, setSelectedArticleStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [trendsenseInitialData, setTrendsenseInitialData] = useState<{
    title?: string;
    department?: string;
    fromTrendsense?: boolean;
    trendsenseNewsId?: string;
  } | null>(null);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<Topic | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error' | 'warning'; text: string } | null>(null);

  // Helper to show brief toast notification
  const showToast = (text: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculate dynamic tab counts based on current dataset
  const tabCounts = useMemo(() => {
    return {
      all: topics.length, // Dynamic accurate count
      assigned: topics.filter(t => t.isEditorAssigned).length,
      important: topics.filter(t => t.isImportant).length,
      completed: topics.filter(t => t.status === 'Hoàn thành').length,
      in_progress: topics.filter(t => t.status === 'Đang triển khai').length,
      overdue: topics.filter(t => t.status === 'Quá hạn').length,
    };
  }, [topics]);

  // Filter topics for the table
  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      // 0. Trendsense Match Check Filter
      if (trendsenseMatchedTopicIds) {
        if (!trendsenseMatchedTopicIds.includes(topic.id)) return false;
      }

      // 1. Statistics Card Drilldown Filter
      if (selectedStatFilter) {
        // === 3 BOX MỚI: TIẾN ĐỘ ĐỀ TÀI QUAN TRỌNG ===
        
        // Nhóm 1: Quan trọng - Quá hạn: hạn đăng ngày hôm qua (06/01/2026), chưa xuất bản
        if (selectedStatFilter.startsWith('imp_overdue_yesterday')) {
          if (!topic.isImportant) return false;
          if (getTopicArticleWorkflow(topic) === 'Published') return false;
          const isOverdueYesterday = 
            topic.deadlineDate === '2026-01-06' || 
            topic.daysUntilDeadline === -1 || 
            (topic.daysUntilDeadline < 0 && topic.deadlineDate <= '2026-01-06') ||
            (topic.status === 'Quá hạn' && topic.deadlineDate <= '2026-01-06');
          if (!isOverdueYesterday) return false;

          if (selectedStatFilter === 'imp_overdue_yesterday_Created') {
            if (getTopicArticleWorkflow(topic) !== 'Created') return false;
          } else if (selectedStatFilter === 'imp_overdue_yesterday_Verifying') {
            if (getTopicArticleWorkflow(topic) !== 'Verifying') return false;
          } else if (selectedStatFilter === 'imp_overdue_yesterday_Publishing') {
            if (getTopicArticleWorkflow(topic) !== 'Publishing') return false;
          }
        }

        // Nhóm 2: Quan trọng - Đến hạn hôm nay: hạn đăng hôm nay (07/01/2026)
        else if (selectedStatFilter.startsWith('imp_due_today')) {
          if (!topic.isImportant) return false;
          const isDueToday = 
            topic.isDueToday || 
            topic.daysUntilDeadline === 0 || 
            topic.deadlineDate === '2026-01-07';
          if (!isDueToday) return false;

          if (selectedStatFilter === 'imp_due_today_Created') {
            if (getTopicArticleWorkflow(topic) !== 'Created') return false;
          } else if (selectedStatFilter === 'imp_due_today_Verifying') {
            if (getTopicArticleWorkflow(topic) !== 'Verifying') return false;
          } else if (selectedStatFilter === 'imp_due_today_Publishing') {
            if (getTopicArticleWorkflow(topic) !== 'Publishing') return false;
          } else if (selectedStatFilter === 'imp_due_today_Published') {
            if (getTopicArticleWorkflow(topic) !== 'Published') return false;
          }
        }

        // Nhóm 3: Quan trọng - Sắp đến hạn (ngày mai): hạn đăng ngày mai (08/01/2026)
        else if (selectedStatFilter.startsWith('imp_due_tomorrow')) {
          if (!topic.isImportant) return false;
          const isDueTomorrow = 
            topic.daysUntilDeadline === 1 || 
            topic.deadlineDate === '2026-01-08';
          if (!isDueTomorrow) return false;

          if (selectedStatFilter === 'imp_due_tomorrow_Created') {
            if (getTopicArticleWorkflow(topic) !== 'Created') return false;
          } else if (selectedStatFilter === 'imp_due_tomorrow_Verifying') {
            if (getTopicArticleWorkflow(topic) !== 'Verifying') return false;
          } else if (selectedStatFilter === 'imp_due_tomorrow_Publishing') {
            if (getTopicArticleWorkflow(topic) !== 'Publishing') return false;
          } else if (selectedStatFilter === 'imp_due_tomorrow_Published') {
            if (getTopicArticleWorkflow(topic) !== 'Published') return false;
          }
        }

        // BBT Filters cũ (hỗ trợ tương thích ngược nếu có)
        else if (selectedStatFilter === 'all_important') {
          if (!topic.isImportant) return false;
        } else if (selectedStatFilter === 'range_1_to_7') {
          if (!topic.isImportant) return false;
          const match = topic.publishPeriod === 'in_range_1_7' || 
            (topic.deadlineDate && topic.deadlineDate <= '2026-01-07' && topic.deadlineDate >= '2026-01-01');
          if (!match) return false;
        } else if (selectedStatFilter === 'da_xuat_ban') {
          if (!topic.isImportant) return false;
          if (topic.status !== 'Hoàn thành') return false;
        } else if (selectedStatFilter === 'dang_trien_khai') {
          if (!topic.isImportant) return false;
          if (topic.status !== 'Đang triển khai' && topic.status !== 'Lên kế hoạch') return false;
        } else if (selectedStatFilter === 'qua_han') {
          if (!topic.isImportant) return false;
          if (topic.status !== 'Quá hạn' && !(topic.daysUntilDeadline < 0 && topic.status !== 'Hoàn thành')) return false;
        } else if (selectedStatFilter === 'after_7') {
          if (!topic.isImportant) return false;
          const match = topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07');
          if (!match) return false;
        } else if (selectedStatFilter === 'han_trong_3_ngay') {
          if (!topic.isImportant) return false;
          const match = (topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07')) && 
            topic.daysUntilDeadline > 0 && topic.daysUntilDeadline <= 3;
          if (!match) return false;
        } else if (selectedStatFilter === 'han_sau_3_ngay') {
          if (!topic.isImportant) return false;
          const match = (topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07')) && 
            topic.daysUntilDeadline > 3;
          if (!match) return false;
        } else if (selectedStatFilter === 'no_deadline') {
          if (!topic.isImportant) return false;
          if (topic.publishPeriod !== 'no_deadline' && topic.deadline !== 'Chưa có' && topic.deadline) return false;
        }

        // Trưởng ban Filters (12 Đề tài cần thực hiện)
        else if (selectedStatFilter === 'all_truongban') {
          if (topic.publishPeriod === 'no_deadline' || topic.deadline === 'Chưa có' || !topic.deadline) return false;
        } else if (selectedStatFilter === 'tb_range_1_to_7') {
          if (topic.publishPeriod === 'no_deadline' || topic.deadline === 'Chưa có' || !topic.deadline) return false;
          const match = topic.publishPeriod === 'in_range_1_7' || 
            (topic.deadlineDate && topic.deadlineDate <= '2026-01-07' && topic.deadlineDate >= '2026-01-01');
          if (!match) return false;
        } else if (selectedStatFilter === 'tb_hoan_thanh') {
          if (topic.status !== 'Hoàn thành') return false;
        } else if (selectedStatFilter === 'tb_da_tao_bai') {
          if (topic.status === 'Hoàn thành') return false;
          if (topic.articleStatus !== 'Đã tạo bài') return false;
        } else if (selectedStatFilter === 'tb_chua_tao_bai') {
          if (topic.status === 'Hoàn thành' || topic.status === 'Quá hạn') return false;
          if (topic.articleStatus !== 'Chưa tạo bài') return false;
        } else if (selectedStatFilter === 'tb_qua_han') {
          if (topic.status !== 'Quá hạn' && !(topic.daysUntilDeadline < 0 && topic.status !== 'Hoàn thành')) return false;
        } else if (selectedStatFilter === 'tb_after_7') {
          const match = topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07');
          if (!match) return false;
        } else if (selectedStatFilter === 'tb_han_trong_3_ngay') {
          const match = (topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07')) && 
            topic.daysUntilDeadline > 0 && topic.daysUntilDeadline <= 3;
          if (!match) return false;
        } else if (selectedStatFilter === 'tb_han_sau_3_ngay') {
          const match = (topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07')) && 
            topic.daysUntilDeadline > 3;
          if (!match) return false;
        }
      }

      // 2. Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = topic.title.toLowerCase().includes(query);
        const matchAuthor = topic.author.toLowerCase().includes(query);
        const matchDept = topic.department?.toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchDept) return false;
      }

      // 3. Status dropdown filter
      if (selectedStatus !== 'all' && topic.status !== selectedStatus) {
        return false;
      }

      // 4. User Need dropdown filter
      if (selectedUserNeed !== 'all' && topic.userNeed !== selectedUserNeed) {
        return false;
      }

      // 5. Advanced Deadline Range Filter (Hạn hoàn thành / hạn đăng bài)
      if (selectedDeadlineRange !== 'all') {
        if (selectedDeadlineRange === 'in_range_1_7') {
          const match = topic.publishPeriod === 'in_range_1_7' || 
            (topic.deadlineDate && topic.deadlineDate <= '2026-01-07' && topic.deadlineDate >= '2026-01-01');
          if (!match) return false;
        } else if (selectedDeadlineRange === 'after_7') {
          const match = topic.publishPeriod === 'after_7' || (topic.deadlineDate && topic.deadlineDate > '2026-01-07');
          if (!match) return false;
        } else if (selectedDeadlineRange === 'today') {
          if (!topic.isDueToday && topic.daysUntilDeadline !== 0) return false;
        } else if (selectedDeadlineRange === 'no_deadline') {
          if (topic.publishPeriod !== 'no_deadline' && topic.deadline !== 'Chưa có' && topic.deadline) return false;
        }
      }

      // 6. Advanced Deadline Status Filter (Tình trạng hạn)
      if (selectedDeadlineStatus !== 'all') {
        if (selectedDeadlineStatus === 'due_today') {
          if (!topic.isDueToday && topic.daysUntilDeadline !== 0) return false;
        } else if (selectedDeadlineStatus === 'within_3_days') {
          if (!(topic.daysUntilDeadline > 0 && topic.daysUntilDeadline <= 3)) return false;
        } else if (selectedDeadlineStatus === 'after_3_days') {
          if (!(topic.daysUntilDeadline > 3)) return false;
        } else if (selectedDeadlineStatus === 'overdue') {
          const isOverdue = topic.status === 'Quá hạn' || (topic.daysUntilDeadline < 0 && topic.status !== 'Hoàn thành');
          if (!isOverdue) return false;
        } else if (selectedDeadlineStatus === 'on_time') {
          const isOnTime = topic.status === 'Hoàn thành' || (topic.daysUntilDeadline >= 0 && topic.status !== 'Quá hạn');
          if (!isOnTime) return false;
        } else if (selectedDeadlineStatus === 'no_deadline') {
          if (topic.publishPeriod !== 'no_deadline' && topic.deadline !== 'Chưa có' && topic.deadline) return false;
        }
      }

      // 7. Advanced Department Filter (Cấp Trưởng ban: Bỏ lọc theo ban)
      if (currentUserRole !== 'Trưởng ban' && selectedDepartment !== 'all' && topic.department !== selectedDepartment) {
        return false;
      }

      // 8. Advanced Author Filter (Cấp Ban biên tập: Bỏ lọc theo phóng viên)
      if (currentUserRole !== 'Ban biên tập' && selectedAuthor !== 'all' && topic.author !== selectedAuthor) {
        return false;
      }

      // 9. Advanced Article Status Filter
      if (selectedArticleStatus !== 'all') {
        const hasArticle = topic.articleStatus === 'Đã tạo bài' || topic.status === 'Hoàn thành';
        if (selectedArticleStatus === 'Đã tạo bài' && !hasArticle) return false;
        if (selectedArticleStatus === 'Chưa tạo bài' && hasArticle) return false;
      }

      // 10. Advanced Priority Filter
      if (selectedPriority !== 'all') {
        if (selectedPriority === 'important' && !topic.isImportant) return false;
        if (selectedPriority === 'trendsense' && !topic.fromTrendsense && !topic.tags?.includes('Trendsense')) return false;
        if (selectedPriority === 'editor' && !topic.isEditorAssigned && !topic.tags?.includes('Gửi BBT')) return false;
        if (selectedPriority === 'sensitive_all' && !topic.isSensitive) return false;
        if (selectedPriority === 'sensitive_level3' && (!topic.isSensitive || topic.sensitivityLevel !== 3)) return false;
        if (selectedPriority === 'sensitive_level2' && (!topic.isSensitive || topic.sensitivityLevel !== 2)) return false;
        if (selectedPriority === 'sensitive_level1' && (!topic.isSensitive || topic.sensitivityLevel !== 1)) return false;
      }

      // 11. Bộ lọc riêng cho Đề tài nhạy cảm Mức 3 (khi kích hoạt từ banner cảnh báo)
      if (filterOnlyLevel3Sensitive) {
        if (!topic.isSensitive || topic.sensitivityLevel !== 3) return false;
      }

      // 12. Bộ lọc riêng cho Đề tài nhạy cảm Mức 2 (khi kích hoạt từ banner cảnh báo)
      if (filterOnlyLevel2Sensitive) {
        if (!topic.isSensitive || topic.sensitivityLevel !== 2) return false;
      }

      return true;
    });
  }, [
    topics, 
    trendsenseMatchedTopicIds, 
    selectedStatFilter, 
    searchTerm, 
    selectedStatus, 
    selectedUserNeed,
    selectedDeadlineRange,
    selectedDeadlineStatus,
    selectedDepartment,
    selectedAuthor,
    selectedArticleStatus,
    selectedPriority,
    filterOnlyLevel3Sensitive,
    filterOnlyLevel2Sensitive,
    currentUserRole
  ]);

  // Handlers for Trendsense Actions
  const handleOpenCreateModalFromTrendsense = (newsItem: TrendsenseNewsItem) => {
    setTrendsenseInitialData({
      title: newsItem.title,
      department: newsItem.department,
      fromTrendsense: true,
      trendsenseNewsId: newsItem.id,
    });
    setIsCreateModalOpen(true);
  };

  const handleFilterMatchedTopics = (newsTitle: string, matchedTopics: Topic[]) => {
    setActiveTrendsenseFilterTitle(newsTitle);
    setTrendsenseMatchedTopicIds(matchedTopics.map(t => t.id));
    setSelectedStatFilter(null);
    showToast(`Đang hiển thị ${matchedTopics.length} đề tài trùng khớp với tin Trendsense`, 'info');
    
    // Smooth scroll down to review result box / table
    setTimeout(() => {
      const targetEl = document.getElementById('trendsense-review-result-box') || document.getElementById('topics-table-container');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  const handleClearTrendsenseFilter = () => {
    setActiveTrendsenseFilterTitle(null);
    setTrendsenseMatchedTopicIds(null);
  };

  // Handlers for topic actions
  const handleCreateTopic = (newTopicData: Partial<Topic>) => {
    const newTopic: Topic = {
      id: `t-${Date.now()}`,
      stt: topics.length + 1,
      title: newTopicData.title || 'Đề tài chưa có tiêu đề',
      author: newTopicData.author || 'Phóng viên',
      department: newTopicData.department || 'Thời sự',
      status: newTopicData.status || 'Chờ duyệt',
      deadline: newTopicData.deadline || '17/1, 20:00',
      deadlineDate: newTopicData.isDueToday ? '2025-01-17' : '2025-01-19',
      isDueToday: Boolean(newTopicData.isDueToday),
      daysUntilDeadline: newTopicData.daysUntilDeadline ?? (newTopicData.isDueToday ? 0 : 2),
      isImportant: Boolean(newTopicData.isImportant),
      isEditorAssigned: false,
      fromTrendsense: Boolean(newTopicData.fromTrendsense),
      trendsenseNewsId: newTopicData.trendsenseNewsId,
      userNeed: newTopicData.userNeed || '',
      commentsCount: 0,
      tags: newTopicData.tags || [],
      description: newTopicData.description || '',
      createdAt: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isSensitive: newTopicData.isSensitive,
      sensitivityLevel: newTopicData.sensitivityLevel,
      sensitivityCategory: newTopicData.sensitivityCategory,
      isDepartmentHeadApproved: false,
    };

    setTopics([newTopic, ...topics]);
    setTrendsenseInitialData(null);

    // ================= XỬ LÝ THEO QUY TRÌNH 3 CẤP ĐỀ TÀI NHẠY CẢM =================
    // Phóng viên đề xuất đề tài tích chọn nhạy cảm:
    // - Mức 1: chỉ hiển thị nhận diện ở list (không thông báo đầu trang)
    // - Mức 2: Trưởng ban nhận được thông báo trên đầu trang quản lý
    // - Mức 3: Trưởng ban nhận được thông báo trên đầu. Nếu Trưởng ban duyệt (giữ nguyên Mức 3) thì Ban biên tập mới nhận được thông báo trên đầu trang.
    if (newTopic.isSensitive) {
      if (newTopic.sensitivityLevel === 3) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          user: newTopic.author,
          action: 'đã đề xuất đề tài nhạy cảm Mức 3 (Đặc biệt):',
          topicTitle: newTopic.title,
          timeAgo: 'Vừa xong',
          type: 'warning',
        };
        setNotifications(prev => [newNotif, ...prev]);
        showToast('⚠️ Đã gửi đề xuất Mức 3: Đã gửi thông báo tới Trưởng ban thẩm duyệt trước khi trình BBT!', 'warning');
      } else if (newTopic.sensitivityLevel === 2) {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          user: newTopic.author,
          action: 'đã đề xuất đề tài nhạy cảm Mức 2 (Tăng cường):',
          topicTitle: newTopic.title,
          timeAgo: 'Vừa xong',
          type: 'info',
        };
        setNotifications(prev => [newNotif, ...prev]);
        showToast('⚡ Đã gửi đề xuất Mức 2: Trưởng ban đã nhận được thông báo trên đầu trang quản lý!', 'info');
      } else {
        showToast('ℹ️ Đã đề xuất đề tài Mức 1: Chỉ hiển thị nhận diện ở danh sách đề tài.', 'info');
      }
    } else {
      showToast(
        newTopic.fromTrendsense 
          ? `Đã giao đề tài từ Trendsense: "${newTopic.title.substring(0, 35)}..." thành công!` 
          : `Đã tạo đề xuất đề tài "${newTopic.title.substring(0, 35)}..." thành công!`
      );
    }
  };

  // Trưởng ban duyệt đề tài nhạy cảm Mức 3:
  // - Giữ nguyên Mức 3 -> Cảnh báo xuất hiện trên đầu trang của Ban biên tập
  // - Hạ xuống Mức 2 -> Xử lý nội bộ cấp ban, không gửi cảnh báo tới Ban biên tập
  const handleDepartmentHeadApproveSensitiveTopic = (
    topicId: string, 
    keepLevel3: boolean, 
    note?: string
  ) => {
    const timeStr = new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return keepLevel3 
          ? {
              ...t,
              isDepartmentHeadApproved: true,
              departmentHeadApprovedLevel: 3,
              departmentHeadApprovedAt: timeStr,
              departmentHeadNote: note || 'Trưởng ban đã thẩm định hồ sơ, giữ nguyên Mức 3 và trình Ban biên tập chỉ đạo.',
              status: 'Đang triển khai' as TopicStatus,
            }
          : {
              ...t,
              isDepartmentHeadApproved: true,
              sensitivityLevel: 2,
              departmentHeadApprovedLevel: 2,
              departmentHeadApprovedAt: timeStr,
              departmentHeadNote: note || 'Trưởng ban đã phê duyệt và hạ xuống Mức 2 để xử lý tại Ban chuyên môn.',
              status: 'Đang triển khai' as TopicStatus,
            };
      }
      return t;
    }));

    if (selectedTopicDetail && selectedTopicDetail.id === topicId) {
      setSelectedTopicDetail(prev => prev ? {
        ...prev,
        isDepartmentHeadApproved: true,
        departmentHeadApprovedLevel: keepLevel3 ? 3 : 2,
        sensitivityLevel: keepLevel3 ? 3 : 2,
        departmentHeadApprovedAt: timeStr,
        departmentHeadNote: note,
        status: 'Đang triển khai' as TopicStatus,
      } : null);
    }

    if (keepLevel3) {
      showToast('✅ Trưởng ban đã DUYỆT & GIỮ NGUYÊN MỨC 3. Ban biên tập đã nhận được thông báo trên đầu trang!', 'warning');
      const targetTopic = topics.find(t => t.id === topicId);
      if (targetTopic) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            user: 'Trưởng ban ' + targetTopic.department,
            action: 'đã duyệt đề tài nhạy cảm Mức 3 và trình Ban biên tập:',
            topicTitle: targetTopic.title,
            timeAgo: 'Vừa xong',
            type: 'warning',
          },
          ...prev
        ]);
      }
    } else {
      showToast('⚡ Trưởng ban đã duyệt và hạ xuống Mức 2 (xử lý nội bộ ban, không trình BBT).', 'info');
    }
  };

  // Ban biên tập phát lệnh chỉ đạo định hướng đề tài Mức 3
  const handleEditorialDirective = (topicId: string, directive: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          editorialBoardDirective: directive,
          editorialBoardApproved: true,
        };
      }
      return t;
    }));

    if (selectedTopicDetail && selectedTopicDetail.id === topicId) {
      setSelectedTopicDetail(prev => prev ? {
        ...prev,
        editorialBoardDirective: directive,
        editorialBoardApproved: true,
      } : null);
    }

    showToast('✅ Ban biên tập đã ban hành ý kiến chỉ đạo định hướng xuất bản!', 'success');
  };

  // Ban biên tập thay đổi mức nhạy cảm
  const handleChangeSensitivityLevel = (
    topicId: string, 
    newLevel: SensitivityLevel | 0, 
    reason?: string
  ) => {
    const targetTopic = topics.find(t => t.id === topicId);
    const oldLevel = targetTopic?.sensitivityLevel;

    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const isSensitive = newLevel > 0;
        const sensitivityLevel = newLevel > 0 ? (newLevel as SensitivityLevel) : undefined;
        return {
          ...t,
          isSensitive,
          sensitivityLevel,
          editorialBoardDirective: reason || t.editorialBoardDirective,
          editorialBoardApproved: true,
        };
      }
      return t;
    }));

    if (selectedTopicDetail && selectedTopicDetail.id === topicId) {
      setSelectedTopicDetail(prev => prev ? {
        ...prev,
        isSensitive: newLevel > 0,
        sensitivityLevel: newLevel > 0 ? (newLevel as SensitivityLevel) : undefined,
        editorialBoardDirective: reason || prev.editorialBoardDirective,
        editorialBoardApproved: true,
      } : null);
    }

    const levelName = newLevel === 3 
      ? 'Mức 3: Đặc biệt' 
      : newLevel === 2 
      ? 'Mức 2: Tăng cường' 
      : newLevel === 1 
      ? 'Mức 1: Thông thường' 
      : 'Không nhạy cảm (Đã bỏ)';

    showToast(`✅ Ban biên tập đã đổi mức nhạy cảm thành: ${levelName}`, 'success');

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        user: 'Ban biên tập',
        action: `đã thay đổi mức nhạy cảm (từ Mức ${oldLevel || 'khác'} ➔ ${levelName}) cho đề tài:`,
        topicTitle: targetTopic?.title || '',
        timeAgo: 'Vừa xong',
        type: 'warning',
      },
      ...prev
    ]);
  };

  // Tạo nhanh đề tài mẫu kiểm tra luồng 3 cấp
  const handleQuickCreateSampleTopic = (level: 1 | 2 | 3) => {
    const timestamp = Date.now();
    const timeStr = new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    let title = '';
    let category = '';
    let dept = 'Thời sự - Chính trị';

    if (level === 1) {
      title = `[Mức 1] Theo dõi biến động nguồn cung và chuỗi cung ứng nông sản xuất khẩu ${timestamp % 1000}`;
      category = 'An ninh phi truyền thống: tài chính - tiền tệ, năng lượng, dịch bệnh, thảm họa';
      dept = 'Kinh doanh';
    } else if (level === 2) {
      title = `[Mức 2] Rà soát quy hoạch đất đai và bảo tồn kiến trúc di sản khu vực nội đô ${timestamp % 1000}`;
      category = 'Lịch sử, danh nhân, sản phẩm khai thác lịch sử';
      dept = 'Đô thị - Quy hoạch';
    } else {
      title = `[Mức 3] Điều tra độc quyền dấu hiệu sai phạm đấu thầu thiết bị y tế ${timestamp % 1000}`;
      category = 'Tư pháp, điều tra, phòng chống tham nhũng, Chống phá nhà nước, phản động';
      dept = 'Pháp luật - Điều tra';
    }

    const newTopic: Topic = {
      id: `t-demo-${timestamp}`,
      stt: topics.length + 1,
      title,
      author: 'Nguyễn Văn Hùng (PV)',
      department: dept,
      status: 'Chờ duyệt',
      deadline: '8/1, 20:00',
      deadlineDate: '2026-01-08',
      isDueToday: false,
      daysUntilDeadline: 1,
      isImportant: true,
      isEditorAssigned: false,
      userNeed: 'Mới',
      commentsCount: 1,
      tags: ['Demo 3 cấp', `Mức ${level}`],
      description: `Đề tài thử nghiệm kiểm tra luồng 3 cấp (Mức ${level}).`,
      createdAt: timeStr,
      isSensitive: true,
      sensitivityLevel: level,
      sensitivityCategory: category,
      isDepartmentHeadApproved: false,
    };

    setTopics(prev => [newTopic, ...prev]);

    if (level === 1) {
      showToast('✅ Đã tạo test Mức 1: Chỉ hiển thị nhận diện ở danh sách đề tài (không có cảnh báo đầu trang)!', 'info');
    } else if (level === 2) {
      showToast('⚡ Đã tạo test Mức 2: Trưởng ban đã nhận thông báo trên đầu trang quản lý!', 'info');
    } else {
      showToast('⚠️ Đã tạo test Mức 3: Trưởng ban nhận thông báo đầu trang để duyệt trước khi trình BBT!', 'warning');
    }
  };

  const handleRequestCancel = (topicId: string, topicTitle: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn gửi yêu cầu huỷ đề tài: "${topicTitle}"?`);
    if (confirmed) {
      setTopics(topics.map(t => t.id === topicId ? { ...t, status: 'Từ chối' as TopicStatus } : t));
      showToast(`Đã gửi yêu cầu huỷ đề tài "${topicTitle.substring(0, 30)}..."`, 'info');
    }
  };

  const handleCreateArticle = (topicId: string, topicTitle: string) => {
    showToast(`Đang mở giao diện soạn thảo bài viết cho đề tài: "${topicTitle.substring(0, 30)}..."`);
  };

  const handleOpenArticle = (topicId: string, topicTitle: string) => {
    showToast(`Đang mở bài viết chi tiết: "${topicTitle.substring(0, 30)}..."`);
  };

  const handleStatusChange = (topicId: string, newStatus: TopicStatus) => {
    setTopics(topics.map(t => t.id === topicId ? { ...t, status: newStatus } : t));
    if (selectedTopicDetail && selectedTopicDetail.id === topicId) {
      setSelectedTopicDetail(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Đã cập nhật trạng thái đề tài thành "${newStatus}"!`);
  };

  const handleToggleImportant = (topicId: string) => {
    setTopics(topics.map(t => {
      if (t.id === topicId) {
        const nextImp = !t.isImportant;
        showToast(nextImp ? 'Đã gán cờ Quan trọng' : 'Đã bỏ cờ Quan trọng', 'info');
        return { ...t, isImportant: nextImp };
      }
      return t;
    }));
    if (selectedTopicDetail && selectedTopicDetail.id === topicId) {
      setSelectedTopicDetail(prev => prev ? { ...prev, isImportant: !prev.isImportant } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-sm font-semibold ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 text-white border-slate-700' 
              : toastMessage.type === 'info'
              ? 'bg-blue-900 text-white border-blue-700'
              : 'bg-rose-900 text-white border-rose-700'
          }`}>
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Header with 3-Level Role Selector */}
      <Header
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        unreadCount={notifications.length}
        showNotificationBanner={showNotificationBanner}
        setShowNotificationBanner={setShowNotificationBanner}
        userRole={currentUserRole}
        setUserRole={(role) => {
          setCurrentUserRole(role);
          showToast(`Đã chuyển cấp sang: ${role}`, 'info');
        }}
      />

      {/* Workspace Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeSidebarItem={activeSidebarItem}
          setActiveSidebarItem={setActiveSidebarItem}
          onOpenCreateModal={() => {
            setTrendsenseInitialData(null);
            setIsCreateModalOpen(true);
          }}
        />

        {/* Center Main Dashboard Canvas */}
        <main id="main-content-dashboard" className="flex-1 overflow-y-auto p-3.5 sm:p-5 max-w-[1600px] mx-auto w-full space-y-2.5">
          
          {/* ================= BOX CẢNH BÁO TRÊN ĐẦU: ĐỀ TÀI NHẠY CẢM THEO LUỒNG 3 CẤP ================= */}
          <SensitiveLevel3Alert
            topics={topics}
            userRole={currentUserRole}
            onSelectTopic={(topic) => setSelectedTopicDetail(topic)}
            onFilterLevel3={(active) => setFilterOnlyLevel3Sensitive(active)}
            isFilteringLevel3={filterOnlyLevel3Sensitive}
            onFilterLevel2={(active) => setFilterOnlyLevel2Sensitive(active)}
            isFilteringLevel2={filterOnlyLevel2Sensitive}
            onDepartmentHeadApprove={handleDepartmentHeadApproveSensitiveTopic}
            onEditorialDirective={handleEditorialDirective}
            onChangeSensitivityLevel={handleChangeSensitivityLevel}
            onQuickSwitchRole={(role) => {
              setCurrentUserRole(role);
              showToast(`Đã chuyển sang vai trò: ${role}`, 'info');
            }}
            onQuickCreateSampleTopic={handleQuickCreateSampleTopic}
            onOpenCreateModal={() => {
              setTrendsenseInitialData(null);
              setIsCreateModalOpen(true);
            }}
          />

          {/* ================= HÀNG 2 CỘT: BOX TRENDSENSE (BÊN TRÁI - GIẢM WIDTH, CHO SCROLL) & TIẾN ĐỘ QUAN TRỌNG (BÊN PHẢI - 3 BLOCK) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
            {/* Box Bên Trái: Trendsense - Giảm width (chiếm 4/12 trên màn hình lớn), cuộn nội bộ */}
            <div className="w-full h-full flex flex-col lg:col-span-5 xl:col-span-4 min-w-0">
              <TrendsenseNewsBox
                topics={topics}
                onOpenCreateModalWithTrendsense={handleOpenCreateModalFromTrendsense}
                onFilterMatchedTopics={handleFilterMatchedTopics}
                activeTrendsenseFilterTitle={activeTrendsenseFilterTitle}
                onClearTrendsenseFilter={handleClearTrendsenseFilter}
                userRole={currentUserRole}
                onShowToast={showToast}
              />
            </div>

            {/* Box Bên Phải: Tiến độ đề tài quan trọng - Rộng rãi với 3 block */}
            <div className="w-full h-full flex flex-col lg:col-span-7 xl:col-span-8 min-w-0">
              <ImportantTopicsStats
                topics={topics}
                userRole={currentUserRole}
                selectedStatFilter={selectedStatFilter}
                onSelectStatFilter={(filterKey) => {
                  setSelectedStatFilter(filterKey);
                  if (filterKey) {
                    setActiveTrendsenseFilterTitle(null);
                    setTrendsenseMatchedTopicIds(null);
                  }
                }}
                showNotificationBanner={showNotificationBanner}
                onToggleNotificationBanner={() => setShowNotificationBanner(!showNotificationBanner)}
                notificationCount={notifications.length}
              />
            </div>
          </div>

          {/* ================= 3. TOÀN BỘ BỘ LỌC (CHUYỂN XUỐNG DƯỚI BOX TIN MỚI & TIẾN ĐỘ) ================= */}
          <FilterBar
            userRole={currentUserRole}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedUserNeed={selectedUserNeed}
            setSelectedUserNeed={setSelectedUserNeed}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onOpenCreateModal={() => {
              setTrendsenseInitialData(null);
              setIsCreateModalOpen(true);
            }}
            selectedStatFilter={selectedStatFilter}
            onClearStatFilter={() => setSelectedStatFilter(null)}
            selectedDeadlineRange={selectedDeadlineRange}
            setSelectedDeadlineRange={setSelectedDeadlineRange}
            selectedDeadlineStatus={selectedDeadlineStatus}
            setSelectedDeadlineStatus={setSelectedDeadlineStatus}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedAuthor={selectedAuthor}
            setSelectedAuthor={setSelectedAuthor}
            selectedArticleStatus={selectedArticleStatus}
            setSelectedArticleStatus={setSelectedArticleStatus}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            onResetAllFilters={() => {
              setSelectedStatFilter(null);
              setActiveTrendsenseFilterTitle(null);
              setTrendsenseMatchedTopicIds(null);
              setSelectedDeadlineRange('all');
              setSelectedDeadlineStatus('all');
              setSelectedDepartment('all');
              setSelectedAuthor('all');
              setSelectedArticleStatus('all');
              setSelectedPriority('all');
              setSelectedUserNeed('all');
              setSelectedStatus('all');
              setFilterOnlyLevel3Sensitive(false);
              setSearchTerm('');
            }}
          />

          {/* ================= 3. OPTIONAL COLLAPSIBLE NOTIFICATION BANNER ================= */}
          {showNotificationBanner && (
            <NotificationBanner
              notifications={notifications}
              onHide={() => setShowNotificationBanner(false)}
              onSelectNotification={(notif) => {
                showToast(`Thông báo: ${notif.user} ${notif.action} "${notif.topicTitle.substring(0, 30)}..."`, 'info');
              }}
            />
          )}

          {/* ================= 4. ACTIVE TRENDSENSE FILTER BAR (KẾT QUẢ ĐỐI SOÁT - TRÊN DANH SÁCH ĐỀ TÀI) ================= */}
          {activeTrendsenseFilterTitle && (
            <div id="trendsense-review-result-box" className="mb-4 bg-rose-50/90 border border-rose-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start sm:items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                      Kết quả đối soát đề tài trùng khớp
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      {filteredTopics.length} đề tài trong hệ thống
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-0.5 font-medium line-clamp-1">
                    Tin Trendsense: <span className="italic font-semibold text-gray-900">"{activeTrendsenseFilterTitle}"</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleClearTrendsenseFilter}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-100 rounded-lg border border-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Xoá đối soát & Xem tất cả ({topics.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* Thanh trạng thái đang lọc đề tài nhạy cảm Mức 3 */}
          {filterOnlyLevel3Sensitive && (
            <div id="filter-level3-status-bar" className="bg-rose-100/90 border border-rose-300 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-950">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Đang lọc danh sách: Đề tài nhạy cảm Mức 3 (Đặc biệt) ({filteredTopics.length} đề tài)</span>
              </div>
              <button
                onClick={() => setFilterOnlyLevel3Sensitive(false)}
                className="text-xs font-bold text-rose-700 hover:text-rose-950 bg-white hover:bg-rose-50 border border-rose-300 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Xoá lọc & Xem tất cả ({topics.length})
              </button>
            </div>
          )}

          {/* ================= TOPICS TABLE ================= */}
          <div id="topics-table-container">
            <TopicsTable
              topics={filteredTopics}
              onSelectTopic={(topic) => setSelectedTopicDetail(topic)}
              onRequestCancel={handleRequestCancel}
              onCreateArticle={handleCreateArticle}
              onOpenArticle={handleOpenArticle}
              onStatusChange={handleStatusChange}
            />
          </div>
        </main>
      </div>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTrendsenseInitialData(null);
        }}
        onSubmit={handleCreateTopic}
        initialData={trendsenseInitialData}
      />

      {/* Topic Detail Modal */}
      <TopicDetailModal
        topic={selectedTopicDetail}
        isOpen={Boolean(selectedTopicDetail)}
        onClose={() => setSelectedTopicDetail(null)}
        onUpdateStatus={handleStatusChange}
        onToggleImportant={handleToggleImportant}
        userRole={currentUserRole}
        onDepartmentHeadApprove={handleDepartmentHeadApproveSensitiveTopic}
        onEditorialDirective={handleEditorialDirective}
        onChangeSensitivityLevel={handleChangeSensitivityLevel}
      />
    </div>
  );
}

