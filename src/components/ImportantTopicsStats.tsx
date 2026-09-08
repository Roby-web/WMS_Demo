import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  CalendarDays, 
  Bell, 
  X,
  FileEdit,
  ShieldCheck,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { Topic, UserRole, ArticleWorkflowStatus } from '../types';

interface ImportantTopicsStatsProps {
  topics: Topic[];
  selectedStatFilter: string | null;
  onSelectStatFilter: (filterKey: string | null) => void;
  showNotificationBanner?: boolean;
  onToggleNotificationBanner?: () => void;
  notificationCount?: number;
  userRole?: UserRole | string;
}

// Helper lấy workflow status chuẩn của bài viết
export const getTopicArticleWorkflow = (topic: Topic): ArticleWorkflowStatus => {
  if (topic.articleWorkflowStatus) return topic.articleWorkflowStatus;
  if (topic.status === 'Hoàn thành') return 'Published';
  if (topic.status === 'Chờ duyệt') return 'Verifying';
  if (topic.articleStatus === 'Đã tạo bài') return 'Publishing';
  return 'Created';
};

export const ImportantTopicsStats: React.FC<ImportantTopicsStatsProps> = ({
  topics,
  selectedStatFilter,
  onSelectStatFilter,
  showNotificationBanner,
  onToggleNotificationBanner,
  notificationCount = 4,
}) => {
  // Lọc tất cả các đề tài quan trọng
  const importantTopics = topics.filter(t => t.isImportant);

  // Mốc thời gian hệ thống hiển thị cụ thể
  const dateYesterdayStr = '06/01';
  const dateTodayStr = '07/01';
  const dateTomorrowStr = '08/01';

  // 1. Box 1: Quan trọng - Quá hạn (hạn đăng ngày hôm qua 06/01/2026, chưa hoàn thành/xuất bản)
  const overdueYesterdayTopics = importantTopics.filter(t => 
    (t.deadlineDate === '2026-01-06' || 
    t.daysUntilDeadline === -1 || 
    (t.daysUntilDeadline < 0 && t.deadlineDate <= '2026-01-06') ||
    (t.status === 'Quá hạn' && t.deadlineDate <= '2026-01-06')) &&
    getTopicArticleWorkflow(t) !== 'Published'
  );

  // 2. Box 2: Quan trọng - Đến hạn hôm nay (hạn đăng hôm nay 07/01/2026)
  const dueTodayTopics = importantTopics.filter(t => 
    t.isDueToday || 
    t.daysUntilDeadline === 0 || 
    t.deadlineDate === '2026-01-07'
  );

  // 3. Box 3: Quan trọng - Sắp đến hạn (ngày mai 08/01/2026)
  const dueTomorrowTopics = importantTopics.filter(t => 
    t.daysUntilDeadline === 1 || 
    t.deadlineDate === '2026-01-08'
  );

  // Hàm đếm 4 trạng thái bài viết cho mỗi nhóm
  const getWorkflowCounts = (topicList: Topic[]) => {
    return {
      total: topicList.length,
      created: topicList.filter(t => getTopicArticleWorkflow(t) === 'Created').length,
      verifying: topicList.filter(t => getTopicArticleWorkflow(t) === 'Verifying').length,
      publishing: topicList.filter(t => getTopicArticleWorkflow(t) === 'Publishing').length,
      published: topicList.filter(t => getTopicArticleWorkflow(t) === 'Published').length,
    };
  };

  const overdueStats = getWorkflowCounts(overdueYesterdayTopics);
  const dueTodayStats = getWorkflowCounts(dueTodayTopics);
  const dueTomorrowStats = getWorkflowCounts(dueTomorrowTopics);

  const handleToggleFilter = (filterKey: string) => {
    if (selectedStatFilter === filterKey) {
      onSelectStatFilter(null);
    } else {
      onSelectStatFilter(filterKey);
    }
  };

  // Cấu hình hiển thị 4 trạng thái bài viết
  const STATUS_CONFIGS: { 
    key: ArticleWorkflowStatus; 
    label: string; 
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    activeClass: string;
  }[] = [
    {
      key: 'Created',
      label: 'Created',
      shortLabel: 'Created',
      icon: FileEdit,
      colorClass: 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200',
      activeClass: 'bg-slate-700 text-white border-slate-800 ring-1 ring-slate-400 font-bold',
    },
    {
      key: 'Verifying',
      label: 'Verifying',
      shortLabel: 'Verifying',
      icon: ShieldCheck,
      colorClass: 'text-amber-800 bg-white hover:bg-amber-50 border-amber-200',
      activeClass: 'bg-amber-600 text-white border-amber-700 ring-1 ring-amber-400 font-bold',
    },
    {
      key: 'Publishing',
      label: 'Publishing',
      shortLabel: 'Publishing',
      icon: UploadCloud,
      colorClass: 'text-blue-800 bg-white hover:bg-blue-50 border-blue-200',
      activeClass: 'bg-blue-600 text-white border-blue-700 ring-1 ring-blue-400 font-bold',
    },
    {
      key: 'Published',
      label: 'Published',
      shortLabel: 'Published',
      icon: CheckCircle2,
      colorClass: 'text-emerald-800 bg-white hover:bg-emerald-50 border-emerald-200',
      activeClass: 'bg-emerald-600 text-white border-emerald-700 ring-1 ring-emerald-400 font-bold',
    },
  ];

  return (
    <section 
      id="important-topics-stats-section" 
      className="bg-white rounded-lg border border-gray-200/90 shadow-2xs px-3 py-2 sm:px-3.5 sm:py-2.5 h-full flex flex-col justify-between transition-all"
    >
      {/* Header Bar - Siêu tinh gọn 1 dòng */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 mb-2 border-b border-gray-100 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
            Tiến độ đề tài quan trọng
          </h2>
          
          {selectedStatFilter && (
            <span className="text-[11px] font-semibold px-2 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <span>Đang lọc</span>
              <button 
                type="button"
                onClick={() => onSelectStatFilter(null)}
                className="hover:text-rose-900 cursor-pointer"
                title="Hủy lọc"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          {selectedStatFilter && (
            <button
              type="button"
              onClick={() => onSelectStatFilter(null)}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-800 underline cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}

          {onToggleNotificationBanner && (
            <button
              type="button"
              onClick={onToggleNotificationBanner}
              className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bell className="w-3 h-3 text-gray-400" />
              <span>{showNotificationBanner ? 'Ẩn thông báo' : `Thông báo (${notificationCount})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= 3 BOX TIẾN ĐỘ COMPACT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        
        {/* ================= BOX 1: QUAN TRỌNG - QUÁ HẠN ================= */}
        <div 
          id="box-stat-overdue-yesterday"
          className={`rounded-lg border px-2.5 py-1.5 flex flex-col justify-between transition-all bg-gradient-to-r from-rose-50/40 to-white ${
            selectedStatFilter === 'imp_overdue_yesterday'
              ? 'border-rose-500 ring-1 ring-rose-400 bg-rose-50/70 shadow-2xs'
              : 'border-rose-200/80 hover:border-rose-300 shadow-2xs'
          }`}
        >
          {/* Header Box 1: Tiêu đề + Hạn (dưới title) + Số tổng */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-start gap-1.5 min-w-0">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-rose-950 block leading-tight">
                  Quá hạn
                </span>
                <span className="text-[10px] text-rose-600 font-medium block leading-tight mt-0.5">
                  Hôm qua ({dateYesterdayStr})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleFilter('imp_overdue_yesterday')}
              title="Lọc tất cả đề tài quá hạn hôm qua"
              className={`px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                selectedStatFilter === 'imp_overdue_yesterday'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                  : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-100/60'
              }`}
            >
              <span className="text-[10px] font-normal opacity-80">Tổng:</span>
              <span>{overdueStats.total}</span>
            </button>
          </div>

          {/* 3 Trạng thái dàn đều 3 cột: Created, Verifying, Publishing (Không có Published vì quá hạn chỉ tính bài chưa hoàn thành) */}
          <div className="grid grid-cols-3 gap-1">
            {STATUS_CONFIGS.filter(s => s.key !== 'Published').map(status => {
              const count = status.key === 'Created' 
                ? overdueStats.created
                : status.key === 'Verifying'
                ? overdueStats.verifying
                : overdueStats.publishing;
              const filterKey = `imp_overdue_yesterday_${status.key}`;
              const isSelected = selectedStatFilter === filterKey;
              const IconComponent = status.icon;

              return (
                <button
                  key={status.key}
                  type="button"
                  onClick={() => handleToggleFilter(filterKey)}
                  title={`${status.label}: ${count} đề tài`}
                  className={`flex items-center justify-between px-1 py-0.5 rounded text-[10px] sm:text-[10.5px] border transition-all cursor-pointer ${
                    isSelected ? status.activeClass : `${status.colorClass} shadow-2xs`
                  }`}
                >
                  <div className="flex items-center gap-1 truncate min-w-0">
                    <IconComponent className="w-2.5 h-2.5 shrink-0 opacity-75" />
                    <span className="truncate text-[10px]">{status.shortLabel}</span>
                  </div>
                  <span className="font-bold text-[10.5px] ml-0.5 shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= BOX 2: QUAN TRỌNG - ĐẾN HẠN HÔM NAY ================= */}
        <div 
          id="box-stat-due-today"
          className={`rounded-lg border px-2.5 py-1.5 flex flex-col justify-between transition-all bg-gradient-to-r from-amber-50/40 to-white ${
            selectedStatFilter === 'imp_due_today'
              ? 'border-amber-500 ring-1 ring-amber-400 bg-amber-50/70 shadow-2xs'
              : 'border-amber-200/80 hover:border-amber-300 shadow-2xs'
          }`}
        >
          {/* Header Box 2: Tiêu đề + Hạn (dưới title) + Số tổng */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-start gap-1.5 min-w-0">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-amber-950 block leading-tight">
                  Đến hạn hôm nay
                </span>
                <span className="text-[10px] text-amber-700 font-medium block leading-tight mt-0.5">
                  Hôm nay ({dateTodayStr})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleFilter('imp_due_today')}
              title="Lọc tất cả đề tài đến hạn hôm nay"
              className={`px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                selectedStatFilter === 'imp_due_today'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-100/60'
              }`}
            >
              <span className="text-[10px] font-normal opacity-80">Tổng:</span>
              <span>{dueTodayStats.total}</span>
            </button>
          </div>

          {/* 4 Trạng thái 2x2 siêu gọn gàng, không bị tràn chữ */}
          <div className="grid grid-cols-2 gap-1">
            {STATUS_CONFIGS.map(status => {
              const count = status.key === 'Created' 
                ? dueTodayStats.created
                : status.key === 'Verifying'
                ? dueTodayStats.verifying
                : status.key === 'Publishing'
                ? dueTodayStats.publishing
                : dueTodayStats.published;
              const filterKey = `imp_due_today_${status.key}`;
              const isSelected = selectedStatFilter === filterKey;
              const IconComponent = status.icon;

              return (
                <button
                  key={status.key}
                  type="button"
                  onClick={() => handleToggleFilter(filterKey)}
                  title={`${status.label}: ${count} đề tài`}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[10px] sm:text-[10.5px] border transition-all cursor-pointer ${
                    isSelected ? status.activeClass : `${status.colorClass} shadow-2xs`
                  }`}
                >
                  <div className="flex items-center gap-1 truncate min-w-0">
                    <IconComponent className="w-2.5 h-2.5 shrink-0 opacity-75" />
                    <span className="truncate text-[10px]">{status.shortLabel}</span>
                  </div>
                  <span className="font-bold text-[10.5px] ml-1 shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= BOX 3: QUAN TRỌNG - SẮP ĐẾN HẠN (NGÀY MAI) ================= */}
        <div 
          id="box-stat-due-tomorrow"
          className={`rounded-lg border px-2.5 py-1.5 flex flex-col justify-between transition-all bg-gradient-to-r from-sky-50/40 to-white ${
            selectedStatFilter === 'imp_due_tomorrow'
              ? 'border-sky-500 ring-1 ring-sky-400 bg-sky-50/70 shadow-2xs'
              : 'border-sky-200/80 hover:border-sky-300 shadow-2xs'
          }`}
        >
          {/* Header Box 3: Tiêu đề + Hạn (dưới title) + Số tổng */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-start gap-1.5 min-w-0">
              <CalendarDays className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-sky-950 block leading-tight">
                  Sắp đến hạn
                </span>
                <span className="text-[10px] text-sky-700 font-medium block leading-tight mt-0.5">
                  Ngày mai ({dateTomorrowStr})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggleFilter('imp_due_tomorrow')}
              title="Lọc tất cả đề tài sắp đến hạn ngày mai"
              className={`px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                selectedStatFilter === 'imp_due_tomorrow'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-2xs'
                  : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-100/60'
              }`}
            >
              <span className="text-[10px] font-normal opacity-80">Tổng:</span>
              <span>{dueTomorrowStats.total}</span>
            </button>
          </div>

          {/* 4 Trạng thái 2x2 siêu gọn gàng, không bị tràn chữ */}
          <div className="grid grid-cols-2 gap-1">
            {STATUS_CONFIGS.map(status => {
              const count = status.key === 'Created' 
                ? dueTomorrowStats.created
                : status.key === 'Verifying'
                ? dueTomorrowStats.verifying
                : status.key === 'Publishing'
                ? dueTomorrowStats.publishing
                : dueTomorrowStats.published;
              const filterKey = `imp_due_tomorrow_${status.key}`;
              const isSelected = selectedStatFilter === filterKey;
              const IconComponent = status.icon;

              return (
                <button
                  key={status.key}
                  type="button"
                  onClick={() => handleToggleFilter(filterKey)}
                  title={`${status.label}: ${count} đề tài`}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[10px] sm:text-[10.5px] border transition-all cursor-pointer ${
                    isSelected ? status.activeClass : `${status.colorClass} shadow-2xs`
                  }`}
                >
                  <div className="flex items-center gap-1 truncate min-w-0">
                    <IconComponent className="w-2.5 h-2.5 shrink-0 opacity-75" />
                    <span className="truncate text-[10px]">{status.shortLabel}</span>
                  </div>
                  <span className="font-bold text-[10.5px] ml-1 shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
