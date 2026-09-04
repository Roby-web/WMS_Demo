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
import { Topic, TopicStatus, ActiveFilterTab, NotificationItem, TrendsenseNewsItem } from './types';
import { CheckCircle, AlertCircle, Info, Zap, X } from 'lucide-react';

export default function App() {
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
  const [activeTab, setActiveTab] = useState<ActiveFilterTab>('all');
  const [selectedStatFilter, setSelectedStatFilter] = useState<string | null>(null);
  const [activeTrendsenseFilterTitle, setActiveTrendsenseFilterTitle] = useState<string | null>(null);
  const [trendsenseMatchedTopicIds, setTrendsenseMatchedTopicIds] = useState<string[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUserNeed, setSelectedUserNeed] = useState('all');
  const [dateRange, setDateRange] = useState('1/1/2025 - 7/1/2025');
  const [viewMode, setViewMode] = useState('default');

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
        if (!topic.isImportant) return false;

        if (selectedStatFilter === 'all_important') {
          return true;
        }
        if (selectedStatFilter === 'overdue') {
          return (topic.daysUntilDeadline < 0 && topic.status !== 'Hoàn thành') || topic.status === 'Quá hạn';
        }
        if (selectedStatFilter === 'due_today_completed') {
          return (topic.isDueToday || topic.daysUntilDeadline === 0) && topic.status === 'Hoàn thành';
        }
        if (selectedStatFilter === 'due_today_pending') {
          return (topic.isDueToday || topic.daysUntilDeadline === 0) && topic.status !== 'Hoàn thành' && topic.status !== 'Quá hạn';
        }
        if (selectedStatFilter === 'due_in_3_days') {
          return !topic.isDueToday && topic.daysUntilDeadline > 0 && topic.daysUntilDeadline <= 3;
        }
        if (selectedStatFilter === 'due_over_3_days') {
          return !topic.isDueToday && topic.daysUntilDeadline > 3 && topic.daysUntilDeadline < 900;
        }
      }

      // 2. Tab filtering (only when not drilling into trendsense matched list)
      if (!selectedStatFilter && !trendsenseMatchedTopicIds) {
        if (activeTab === 'assigned' && !topic.isEditorAssigned) return false;
        if (activeTab === 'important' && !topic.isImportant) return false;
        if (activeTab === 'completed' && topic.status !== 'Hoàn thành') return false;
        if (activeTab === 'in_progress' && topic.status !== 'Đang triển khai') return false;
        if (activeTab === 'overdue' && topic.status !== 'Quá hạn') return false;
      }

      // 3. Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = topic.title.toLowerCase().includes(query);
        const matchAuthor = topic.author.toLowerCase().includes(query);
        const matchDept = topic.department?.toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchDept) return false;
      }

      // 4. Status dropdown filter
      if (selectedStatus !== 'all' && topic.status !== selectedStatus) {
        return false;
      }

      // 5. User Need dropdown filter
      if (selectedUserNeed !== 'all' && topic.userNeed !== selectedUserNeed) {
        return false;
      }

      return true;
    });
  }, [topics, trendsenseMatchedTopicIds, selectedStatFilter, activeTab, searchTerm, selectedStatus, selectedUserNeed]);

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
    
    // Smooth scroll down to table
    const tableEl = document.getElementById('topics-table-container') || document.getElementById('main-content-dashboard');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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

      {/* Main Header */}
      <Header
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        unreadCount={notifications.length}
        showNotificationBanner={showNotificationBanner}
        setShowNotificationBanner={setShowNotificationBanner}
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
        <main id="main-content-dashboard" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-[1600px] mx-auto w-full">
          
          {/* ================= TOP SECTION: TIN MỚI TRENDSENSE (TRÁI) & TIẾN ĐỘ ĐỀ TÀI QUAN TRỌNG (PHẢI) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4 items-stretch">
            {/* Box Tin mới - Trendsense (bên trái) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
              <TrendsenseNewsBox
                topics={topics}
                onOpenCreateModalWithTrendsense={handleOpenCreateModalFromTrendsense}
                onFilterMatchedTopics={handleFilterMatchedTopics}
                activeTrendsenseFilterTitle={activeTrendsenseFilterTitle}
                onClearTrendsenseFilter={handleClearTrendsenseFilter}
              />
            </div>

            {/* Tiến độ đề tài Quan trọng (bên phải) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <ImportantTopicsStats
                topics={topics}
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

          {/* ================= OPTIONAL COLLAPSIBLE NOTIFICATION BANNER ================= */}
          {showNotificationBanner && (
            <NotificationBanner
              notifications={notifications}
              onHide={() => setShowNotificationBanner(false)}
              onSelectNotification={(notif) => {
                showToast(`Thông báo: ${notif.user} ${notif.action} "${notif.topicTitle.substring(0, 30)}..."`, 'info');
              }}
            />
          )}

          {/* ================= ACTIVE TRENDSENSE FILTER BAR (IF TRIGGERED BY CHECK ĐỀ TÀI) ================= */}
          {activeTrendsenseFilterTitle && (
            <div className="mb-4 bg-rose-50/90 border border-rose-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
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

          {/* ================= FILTER BAR & QUICK TABS ================= */}
          <FilterBar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (trendsenseMatchedTopicIds) handleClearTrendsenseFilter();
            }}
            tabCounts={tabCounts}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedUserNeed={selectedUserNeed}
            setSelectedUserNeed={setSelectedUserNeed}
            dateRange={dateRange}
            setDateRange={setDateRange}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onOpenCreateModal={() => {
              setTrendsenseInitialData(null);
              setIsCreateModalOpen(true);
            }}
            selectedStatFilter={selectedStatFilter}
            onClearStatFilter={() => setSelectedStatFilter(null)}
          />

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

