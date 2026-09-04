import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ChevronRight,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { Topic } from '../types';

interface ImportantTopicsStatsProps {
  topics: Topic[];
  selectedStatFilter: string | null;
  onSelectStatFilter: (filterKey: string | null) => void;
  showNotificationBanner: boolean;
  onToggleNotificationBanner: () => void;
  notificationCount?: number;
}

export const ImportantTopicsStats: React.FC<ImportantTopicsStatsProps> = ({
  topics,
  selectedStatFilter,
  onSelectStatFilter,
  showNotificationBanner,
  onToggleNotificationBanner,
  notificationCount = 5,
}) => {
  // Filter for important topics only
  const importantTopics = topics.filter(t => t.isImportant);
  const totalImportant = importantTopics.length;

  // 1. Overdue (Đã quá hạn)
  const overdueTopics = importantTopics.filter(t => 
    (t.daysUntilDeadline < 0 && t.status !== 'Hoàn thành') || t.status === 'Quá hạn'
  );
  const overdueCount = overdueTopics.length;

  // 2. Due today (Hạn hôm nay)
  const dueTodayTopics = importantTopics.filter(t => 
    (t.isDueToday || t.daysUntilDeadline === 0) && t.status !== 'Quá hạn' && t.daysUntilDeadline >= 0
  );
  const dueTodayCount = dueTodayTopics.length;

  // Due today & completed
  const dueTodayCompleted = dueTodayTopics.filter(t => t.status === 'Hoàn thành');
  const dueTodayCompletedCount = dueTodayCompleted.length;

  // Due today & not completed
  const dueTodayPending = dueTodayTopics.filter(t => t.status !== 'Hoàn thành');
  const dueTodayPendingCount = dueTodayPending.length;

  // 3. Not due yet (Chưa tới hạn)
  const notDueTopics = importantTopics.filter(t => 
    !t.isDueToday && t.daysUntilDeadline > 0 && t.status !== 'Quá hạn'
  );
  const notDueCount = notDueTopics.length;

  // Due within 3 days
  const dueIn3DaysTopics = notDueTopics.filter(t => t.daysUntilDeadline > 0 && t.daysUntilDeadline <= 3);
  const dueIn3DaysCount = dueIn3DaysTopics.length;

  // Due in > 3 days
  const dueOver3DaysTopics = notDueTopics.filter(t => t.daysUntilDeadline > 3);
  const dueOver3DaysCount = dueOver3DaysTopics.length;

  const handleCardClick = (key: string) => {
    if (selectedStatFilter === key) {
      onSelectStatFilter(null);
    } else {
      onSelectStatFilter(key);
    }
  };

  return (
    <section id="important-topics-stats-section" className="bg-white rounded-lg border border-gray-200/90 shadow-2xs p-3 transition-all h-full flex flex-col justify-between">
      {/* Header bar gọn gàng, trang nhã */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <h2 className="text-sm font-semibold text-gray-900">
            Tiến độ đề tài Quan trọng
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
            {totalImportant} đề tài
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {selectedStatFilter && (
            <button
              onClick={() => onSelectStatFilter(null)}
              className="text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded border border-gray-200 transition-colors cursor-pointer"
            >
              Đang lọc · <span className="font-semibold text-rose-700">Xoá lọc ✕</span>
            </button>
          )}

          <button
            onClick={onToggleNotificationBanner}
            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-gray-400" />
            <span>{showNotificationBanner ? 'Ẩn thông báo' : `Thông báo (${notificationCount})`}</span>
          </button>
        </div>
      </div>

      {/* SƠ ĐỒ PHÂN NHÁNH NGANG TINH GỌN, ÍT MÀU MÈ, TẬP TRUNG CHỈ SỐ */}
      <div className="bg-gray-50/70 rounded-lg p-2.5 border border-gray-100 overflow-x-auto">
        <div className="min-w-[800px] flex items-center gap-2">
          
          {/* CẤP 0: GỐC (ROOT NODE) */}
          <div className="shrink-0 w-36">
            <div className="bg-white border border-gray-300 rounded-lg p-2.5 shadow-2xs">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Mục tiêu</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">Đề tài Quan trọng</div>
              <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-baseline justify-between">
                <span className="text-xl font-bold text-gray-900">{totalImportant}</span>
                <span className="text-[11px] font-medium text-gray-500">100%</span>
              </div>
            </div>
          </div>

          {/* DÂY KẾT NỐI TRUNG TÍNH CẤP 0 -> 3 NHÁNH CẤP 1 */}
          <div className="shrink-0 w-6 flex items-center justify-center">
            <svg width="24" height="150" viewBox="0 0 24 150" fill="none" className="text-gray-300">
              {/* Nhánh Quá hạn */}
              <path d="M 0 75 C 12 75, 12 24, 20 24 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              {/* Nhánh Hôm nay */}
              <path d="M 0 75 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              {/* Nhánh Chưa tới hạn */}
              <path d="M 0 75 C 12 75, 12 126, 20 126 H 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="2" cy="75" r="2.5" fill="#9ca3af" />
            </svg>
          </div>

          {/* KHỐI 3 NHÁNH CHÍNH */}
          <div className="flex-1 flex flex-col gap-2">
            
            {/* 1. NHÁNH QUÁ HẠN */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCardClick('overdue')}
                className={`shrink-0 w-52 text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  selectedStatFilter === 'overdue'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400'
                    : overdueCount > 0
                    ? 'bg-white border-rose-200 hover:border-rose-300 text-gray-800'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${overdueCount > 0 ? 'bg-rose-500' : 'bg-gray-300'}`} />
                  <span className="text-xs font-semibold">1. Quá hạn</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  overdueCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {overdueCount}
                </span>
              </button>

              {/* Dây nối */}
              <div className="shrink-0 w-5 flex items-center justify-center">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="text-gray-300">
                  <path d="M 0 8 H 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Thẻ hành động */}
              <div className="flex-1">
                <button
                  onClick={() => handleCardClick('overdue')}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStatFilter === 'overdue'
                      ? 'bg-rose-50/80 border-rose-300 text-rose-900 ring-1 ring-rose-300'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-xs font-medium text-gray-800">
                      Cần đôn đốc xử lý gấp <span className="text-gray-500 font-normal">(Trễ deadline 15/1)</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 flex items-center">
                    Xem chi tiết <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </button>
              </div>
            </div>

            {/* 2. NHÁNH HẠN HÔM NAY */}
            <div className="flex items-center gap-2">
              <div className="shrink-0 w-52 bg-white border border-gray-200 px-3 py-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-gray-800">2. Đến hạn hôm nay</span>
                </div>
                <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                  {dueTodayCount}
                </span>
              </div>

              {/* Dây nối rẽ 2 */}
              <div className="shrink-0 w-5 flex items-center justify-center">
                <svg width="20" height="48" viewBox="0 0 20 48" fill="none" className="text-gray-300">
                  <path d="M 0 24 H 8 C 13 24, 13 12, 16 12 H 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 0 24 H 8 C 13 24, 13 36, 16 36 H 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="2" cy="24" r="2" fill="#9ca3af" />
                </svg>
              </div>

              {/* 2 ô con */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCardClick('due_today_completed')}
                  className={`text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStatFilter === 'due_today_completed'
                      ? 'bg-emerald-50/80 border-emerald-400 text-emerald-900 ring-1 ring-emerald-400'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium text-gray-800">Đã hoàn thành</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-bold text-emerald-700">{dueTodayCompletedCount}</span>
                    <span className="text-[11px] text-gray-500">bài</span>
                  </div>
                </button>

                <button
                  onClick={() => handleCardClick('due_today_pending')}
                  className={`text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStatFilter === 'due_today_pending'
                      ? 'bg-amber-50/80 border-amber-400 text-amber-900 ring-1 ring-amber-400'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-xs font-medium text-gray-800">Chưa hoàn thành</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-bold text-amber-700">{dueTodayPendingCount}</span>
                    <span className="text-[11px] text-gray-500">bài</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. NHÁNH CHƯA TỚI HẠN */}
            <div className="flex items-center gap-2">
              <div className="shrink-0 w-52 bg-white border border-gray-200 px-3 py-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-gray-800">3. Chưa tới hạn</span>
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                  {notDueCount}
                </span>
              </div>

              {/* Dây nối rẽ 2 */}
              <div className="shrink-0 w-5 flex items-center justify-center">
                <svg width="20" height="48" viewBox="0 0 20 48" fill="none" className="text-gray-300">
                  <path d="M 0 24 H 8 C 13 24, 13 12, 16 12 H 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 0 24 H 8 C 13 24, 13 36, 16 36 H 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="2" cy="24" r="2" fill="#9ca3af" />
                </svg>
              </div>

              {/* 2 ô con */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCardClick('due_in_3_days')}
                  className={`text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStatFilter === 'due_in_3_days'
                      ? 'bg-sky-50/80 border-sky-400 text-sky-900 ring-1 ring-sky-400'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="text-xs font-medium text-gray-800">Trong 3 ngày tới</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-bold text-sky-700">{dueIn3DaysCount}</span>
                    <span className="text-[11px] text-gray-500">(19/1)</span>
                  </div>
                </button>

                <button
                  onClick={() => handleCardClick('due_over_3_days')}
                  className={`text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStatFilter === 'due_over_3_days'
                      ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 ring-1 ring-indigo-400'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-xs font-medium text-gray-800">Hơn 3 ngày</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-bold text-indigo-700">{dueOver3DaysCount}</span>
                    <span className="text-[11px] text-gray-500">(24/1)</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
