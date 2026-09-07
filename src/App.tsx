import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ImportantTopicsStats } from './components/ImportantTopicsStats';
import { TrendsenseNewsBox } from './components/TrendsenseNewsBox';
import { NotificationBanner } from './components/NotificationBanner';
import { FilterBar } from './components/FilterBar';
import { TopicsTable } from './components/TopicsTable';
import { CreateTopicModal } from './components/CreateTopicModal';
import { TopicDetailModal } from './components/TopicDetailModal';
import { INITIAL_TOPICS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Topic, TopicStatus, ActiveFilterTab, NotificationItem, TrendsenseNewsItem, UserRole } from './types';
import { CheckCircle, AlertCircle, Info, Zap, X } from 'lucide-react';

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
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Helper to show brief toast notification
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
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
        // BBT Filters
        if (selectedStatFilter === 'all_important') {
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
    };

    setTopics([newTopic, ...topics]);
    setTrendsenseInitialData(null);
    showToast(
      newTopic.fromTrendsense 
        ? `Đã giao đề tài từ Trendsense: "${newTopic.title.substring(0, 35)}..." thành công!` 
        : `Đã tạo đề xuất đề tài "${newTopic.title.substring(0, 35)}..." thành công!`
    );
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
        <main id="main-content-dashboard" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto w-full space-y-4">
          
          {/* ================= 1. BỘ LỌC ĐƯA LÊN ĐẦU TIÊN (KÈM BỘ LỌC NÂNG CAO) ================= */}
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
              setSearchTerm('');
            }}
          />

          {/* ================= 2. TOP SECTION: TIN MỚI TRENDSENSE (TRÁI) & TIẾN ĐỘ ĐỀ TÀI (PHẢI) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Box Tin mới - Trendsense (bên trái) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
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

            {/* Tiến độ đề tài (bên phải) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
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
      />
    </div>
  );
}

