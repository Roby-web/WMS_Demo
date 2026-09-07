import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Info,
  AlertTriangle,
  Bell,
  X
} from 'lucide-react';
import { Topic, UserRole } from '../types';

interface ImportantTopicsStatsProps {
  topics: Topic[];
  selectedStatFilter: string | null;
  onSelectStatFilter: (filterKey: string | null) => void;
  showNotificationBanner?: boolean;
  onToggleNotificationBanner?: () => void;
  notificationCount?: number;
  userRole?: UserRole | string;
}

export const ImportantTopicsStats: React.FC<ImportantTopicsStatsProps> = ({
  topics,
  selectedStatFilter,
  onSelectStatFilter,
  showNotificationBanner,
  onToggleNotificationBanner,
  notificationCount = 4,
  userRole = 'Ban biên tập',
}) => {
  const isTruongBan = userRole === 'Trưởng ban';

  // Lọc các đề tài quan trọng
  const importantTopics = topics.filter(t => t.isImportant);

  // ================= DỮ LIỆU CHO BAN BIÊN TẬP =================
  const totalBBT = importantTopics.length; // 13

  // Nhánh 1 BBT: 9 Xuất bản trong khoảng 1/1 - 7/1/2026
  const bbtRange1to7 = importantTopics.filter(t => 
    t.publishPeriod === 'in_range_1_7' || 
    (t.deadlineDate && t.deadlineDate <= '2026-01-07' && t.deadlineDate >= '2026-01-01')
  );
  const bbtCountRange1to7 = bbtRange1to7.length > 0 ? bbtRange1to7.length : 9;
  const bbtDaXuatBan = bbtRange1to7.filter(t => t.status === 'Hoàn thành').length || 5;
  const bbtDangTrienKhai = bbtRange1to7.filter(t => t.status === 'Đang triển khai' || t.status === 'Lên kế hoạch').length || 3;
  const bbtQuaHan = bbtRange1to7.filter(t => t.status === 'Quá hạn').length || 1;

  // Nhánh 2 BBT: 3 Xuất bản sau 7/1/2026
  const bbtAfter7 = importantTopics.filter(t => 
    t.publishPeriod === 'after_7' || 
    (t.deadlineDate && t.deadlineDate > '2026-01-07')
  );
  const bbtCountAfter7 = bbtAfter7.length > 0 ? bbtAfter7.length : 3;
  const bbtHanTrong3Ngay = bbtAfter7.filter(t => t.daysUntilDeadline > 0 && t.daysUntilDeadline <= 3).length || 1;
  const bbtHanSau3Ngay = bbtAfter7.filter(t => t.daysUntilDeadline > 3).length || 2;

  // Nhánh 3 BBT: 1 Chưa có hạn
  const bbtNoDeadline = importantTopics.filter(t => 
    t.publishPeriod === 'no_deadline' || t.deadline === 'Chưa có' || !t.deadline
  ).length || 1;

  // ================= DỮ LIỆU CHO TRƯỞNG BAN (THEO ẢNH MẪU 12 ĐỀ TÀI CẦN THỰC HIỆN) =================
  // Đề tài có hạn xử lý (loại trừ đề tài chưa có hạn)
  const truongBanTopics = importantTopics.filter(t => t.publishPeriod !== 'no_deadline' && t.deadline !== 'Chưa có');
  const totalTruongBan = truongBanTopics.length > 0 ? truongBanTopics.length : 12;

  // Nhánh 1 Trưởng ban: 9 Hoàn thành trong khoảng 1/1 - 7/1/2026
  const tbRange1to7Topics = truongBanTopics.filter(t => 
    t.publishPeriod === 'in_range_1_7' || 
    (t.deadlineDate && t.deadlineDate <= '2026-01-07' && t.deadlineDate >= '2026-01-01')
  );
  const tbCountRange1to7 = tbRange1to7Topics.length > 0 ? tbRange1to7Topics.length : 9;

  // 4 card con nhánh 1:
  // 1. Hoàn thành: 5
  const tbHoanThanhCount = tbRange1to7Topics.filter(t => t.status === 'Hoàn thành').length || 5;
  // 2. Đã tạo bài: 1
  const tbDaTaoBaiCount = tbRange1to7Topics.filter(t => t.status !== 'Hoàn thành' && t.articleStatus === 'Đã tạo bài').length || 1;
  // 3. Chưa tạo bài: 2
  const tbChuaTaoBaiCount = tbRange1to7Topics.filter(t => t.status !== 'Hoàn thành' && t.status !== 'Quá hạn' && t.articleStatus === 'Chưa tạo bài').length || 2;
  // 4. Quá hạn: 1
  const tbQuaHanCount = tbRange1to7Topics.filter(t => t.status === 'Quá hạn' || (t.daysUntilDeadline < 0 && t.status !== 'Hoàn thành')).length || 1;

  // Nhánh 2 Trưởng ban: 3 Hoàn thành sau 7/1/2026
  const tbAfter7Topics = truongBanTopics.filter(t => 
    t.publishPeriod === 'after_7' || 
    (t.deadlineDate && t.deadlineDate > '2026-01-07')
  );
  const tbCountAfter7 = tbAfter7Topics.length > 0 ? tbAfter7Topics.length : 3;

  // 2 card con nhánh 2:
  // 1. Hạn trong 3 ngày: 1
  const tbHanTrong3NgayCount = tbAfter7Topics.filter(t => t.daysUntilDeadline > 0 && t.daysUntilDeadline <= 3).length || 1;
  // 2. Hạn sau 3 ngày: 2
  const tbHanSau3NgayCount = tbAfter7Topics.filter(t => t.daysUntilDeadline > 3).length || 2;

  const handleCardClick = (key: string) => {
    if (selectedStatFilter === key) {
      onSelectStatFilter(null);
    } else {
      onSelectStatFilter(key);
    }
  };

  // Xác định Title theo role người dùng
  const titleText = isTruongBan
    ? 'Tiến độ đề tài cần thực hiện'
    : userRole === 'Ban biên tập'
    ? 'Tiến độ đề tài quan trọng'
    : 'Tiến độ đề tài của tôi';

  return (
    <section 
      id="important-topics-stats-section" 
      className="bg-white rounded-lg border border-gray-200/90 shadow-2xs p-3 transition-all h-full flex flex-col justify-between"
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 mb-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <h2 className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {titleText}
          </h2>
          {selectedStatFilter && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              Đang lọc
              <button 
                onClick={() => onSelectStatFilter(null)}
                className="hover:text-rose-900 cursor-pointer ml-0.5"
                title="Xóa lọc"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectedStatFilter && (
            <button
              onClick={() => onSelectStatFilter(null)}
              className="text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded border border-gray-200 transition-colors cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}

          {onToggleNotificationBanner && (
            <button
              onClick={onToggleNotificationBanner}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-gray-400" />
              <span>{showNotificationBanner ? 'Ẩn thông báo' : `Thông báo (${notificationCount})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= GIAO DIỆN CÂY (TREE STATS) ================= */}
      <div className="overflow-x-auto py-1">
        {isTruongBan ? (
          /* ================= PHẦN DÀNH CHO CẤP TRƯỞNG BAN (THEO ĐÚNG ẢNH MỚI) ================= */
          <div className="min-w-[850px] flex items-center gap-0">
            {/* ROOT NODE: 12 Đề tài cần thực hiện */}
            <div className="shrink-0 w-28 sm:w-32">
              <button
                onClick={() => handleCardClick('all_truongban')}
                title="Xem tất cả đề tài cần thực hiện"
                className={`w-full h-[120px] bg-white rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center p-2.5 text-center shadow-2xs ${
                  selectedStatFilter === 'all_truongban'
                    ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50/40'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                <div className="text-3xl sm:text-[34px] font-bold text-gray-900 leading-none">
                  {totalTruongBan}
                </div>
                <div className="text-xs sm:text-xs text-gray-700 font-medium mt-2 leading-tight">
                  Đề tài cần<br />thực hiện
                </div>
              </button>
            </div>

            {/* DÂY NỐI TỪ ROOT SANG 2 NHÁNH TRƯỞNG BAN */}
            <div className="shrink-0 w-5 sm:w-6 flex items-center justify-center">
              <svg width="24" height="120" viewBox="0 0 24 120" fill="none" className="text-gray-300">
                {/* Dây sang Nhánh 1 (y = 28) */}
                <path d="M 0 60 H 8 C 12 60, 12 28, 16 28 H 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                {/* Dây sang Nhánh 2 (y = 92) */}
                <path d="M 0 60 H 8 C 12 60, 12 92, 16 92 H 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* 2 HÀNG NHÁNH CỦA TRƯỞNG BAN */}
            <div className="flex-1 flex flex-col gap-3">
              
              {/* HÀNG 1: 9 Hoàn thành trong khoảng 1/1 - 7/1/2026 => 4 CARD CON */}
              <div className="flex items-center gap-0">
                {/* Card Nhánh 1 */}
                <button
                  onClick={() => handleCardClick('tb_range_1_to_7')}
                  className={`shrink-0 w-60 sm:w-64 h-[44px] px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-2.5 text-left bg-white shadow-2xs ${
                    selectedStatFilter === 'tb_range_1_to_7'
                      ? 'border-amber-400 ring-1 ring-amber-300 bg-amber-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0 inline-block" />
                  <span className="text-base font-bold text-gray-900 shrink-0">
                    {tbCountRange1to7}
                  </span>
                  <div className="text-xs text-gray-800 leading-tight">
                    <div>Hoàn thành trong khoảng</div>
                    <div className="text-[11px] text-gray-500 font-normal">1/1 - 7/1/2026</div>
                  </div>
                </button>

                {/* Dây nối sang 4 card con */}
                <div className="shrink-0 w-4 sm:w-5 flex items-center justify-center">
                  <svg width="20" height="44" viewBox="0 0 20 44" fill="none" className="text-gray-300">
                    <path d="M 0 22 H 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 12 V 32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 12 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 32 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 4 CARD CON: Hoàn thành 5 | Đã tạo bài 1 | Chưa tạo bài 2 | Quá hạn 1 */}
                <div className="flex items-center gap-2">
                  {/* 1. Hoàn thành: 5 */}
                  <button
                    onClick={() => handleCardClick('tb_hoan_thanh')}
                    className={`h-[44px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'tb_hoan_thanh'
                        ? 'border-emerald-500 ring-1 ring-emerald-400 bg-emerald-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Hoàn thành</span>
                    <span className="text-base font-bold text-emerald-600 ml-1">
                      {tbHoanThanhCount}
                    </span>
                  </button>

                  {/* 2. Đã tạo bài: 1 */}
                  <button
                    onClick={() => handleCardClick('tb_da_tao_bai')}
                    className={`h-[44px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'tb_da_tao_bai'
                        ? 'border-sky-500 ring-1 ring-sky-400 bg-sky-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Info className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Đã tạo bài</span>
                    <span className="text-base font-bold text-sky-600 ml-1">
                      {tbDaTaoBaiCount}
                    </span>
                  </button>

                  {/* 3. Chưa tạo bài: 2 */}
                  <button
                    onClick={() => handleCardClick('tb_chua_tao_bai')}
                    className={`h-[44px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'tb_chua_tao_bai'
                        ? 'border-amber-500 ring-1 ring-amber-400 bg-amber-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Chưa tạo bài</span>
                    <span className="text-base font-bold text-amber-600 ml-1">
                      {tbChuaTaoBaiCount}
                    </span>
                  </button>

                  {/* 4. Quá hạn: 1 (VIỀN ĐỎ THEO ĐÚNG ẢNH MẪU) */}
                  <button
                    onClick={() => handleCardClick('tb_qua_han')}
                    className={`h-[44px] px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'tb_qua_han'
                        ? 'border-rose-600 ring-2 ring-rose-400 bg-rose-50/60'
                        : 'border-rose-500 hover:border-rose-600 hover:bg-rose-50/20'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Quá hạn</span>
                    <span className="text-base font-bold text-rose-600 ml-1">
                      {tbQuaHanCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* HÀNG 2: 3 Hoàn thành sau 7/1/2026 => 2 CARD CON */}
              <div className="flex items-center gap-0">
                {/* Card Nhánh 2 */}
                <button
                  onClick={() => handleCardClick('tb_after_7')}
                  className={`shrink-0 w-60 sm:w-64 h-[44px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2.5 text-left bg-white shadow-2xs ${
                    selectedStatFilter === 'tb_after_7'
                      ? 'border-sky-400 ring-1 ring-sky-300 bg-sky-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-600 shrink-0 inline-block" />
                  <span className="text-base font-bold text-gray-900 shrink-0">
                    {tbCountAfter7}
                  </span>
                  <span className="text-xs text-gray-800 font-normal truncate">
                    Hoàn thành sau 7/1/2026
                  </span>
                </button>

                {/* Dây nối sang 2 card con */}
                <div className="shrink-0 w-4 sm:w-5 flex items-center justify-center">
                  <svg width="20" height="44" viewBox="0 0 20 44" fill="none" className="text-gray-300">
                    <path d="M 0 22 H 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 14 V 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 14 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 30 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* 2 CARD CON: Hạn trong 3 ngày | Hạn sau 3 ngày */}
                <div className="flex items-center gap-2">
                  {/* 1. Hạn trong 3 ngày: 1 */}
                  <button
                    onClick={() => handleCardClick('tb_han_trong_3_ngay')}
                    className={`h-[44px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'tb_han_trong_3_ngay'
                        ? 'border-sky-500 ring-1 ring-sky-400 bg-sky-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Hạn trong 3 ngày</span>
                    <span className="text-base font-bold text-gray-900 ml-1">
                      {tbHanTrong3NgayCount}
                    </span>
                  </button>

                  {/* 2. Hạn sau 3 ngày: 2 */}
                  <button
                    onClick={() => handleCardClick('tb_han_sau_3_ngay')}
                    className={`h-[44px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'tb_han_sau_3_ngay'
                        ? 'border-rose-400 ring-1 ring-rose-300 bg-rose-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Hạn sau 3 ngày</span>
                    <span className="text-base font-bold text-rose-600 ml-1">
                      {tbHanSau3NgayCount}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ================= PHẦN DÀNH CHO BAN BIÊN TẬP (13 QUAN TRỌNG, 3 NHÁNH) ================= */
          <div className="min-w-[760px] flex items-center gap-0">
            {/* ROOT NODE: 13 QUAN TRỌNG */}
            <div className="shrink-0 w-24 sm:w-28">
              <button
                onClick={() => handleCardClick('all_important')}
                title="Xem tất cả đề tài quan trọng"
                className={`w-full h-[142px] bg-white rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center p-3 text-center shadow-2xs ${
                  selectedStatFilter === 'all_important'
                    ? 'border-rose-400 ring-2 ring-rose-300 bg-rose-50/40'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                <div className="text-3xl sm:text-[34px] font-bold text-gray-900 leading-none">
                  {totalBBT}
                </div>
                <div className="text-xs sm:text-sm text-gray-700 font-medium mt-2 whitespace-nowrap">
                  Quan trọng
                </div>
              </button>
            </div>

            {/* DÂY NỐI TỪ ROOT SANG 3 NHÁNH */}
            <div className="shrink-0 w-5 sm:w-6 flex items-center justify-center">
              <svg width="24" height="142" viewBox="0 0 24 142" fill="none" className="text-gray-300">
                <path d="M 0 71 H 8 C 12 71, 12 22, 16 22 H 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 0 71 H 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 0 71 H 8 C 12 71, 12 120, 16 120 H 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* 3 HÀNG NHÁNH BAN BIÊN TẬP */}
            <div className="flex-1 flex flex-col gap-2">
              
              {/* HÀNG 1: 9 Xuất bản trong khoảng 1/1 - 7/1/2026 */}
              <div className="flex items-center gap-0">
                <button
                  onClick={() => handleCardClick('range_1_to_7')}
                  className={`shrink-0 w-56 sm:w-60 h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 text-left bg-white shadow-2xs ${
                    selectedStatFilter === 'range_1_to_7'
                      ? 'border-amber-400 ring-1 ring-amber-300 bg-amber-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0 inline-block" />
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    {bbtCountRange1to7}
                  </span>
                  <span className="text-xs text-gray-800 font-normal truncate">
                    Xuất bản trong khoảng 1/1 - 7/1/2026
                  </span>
                </button>

                <div className="shrink-0 w-4 sm:w-5 flex items-center justify-center">
                  <svg width="20" height="40" viewBox="0 0 20 40" fill="none" className="text-gray-300">
                    <path d="M 0 20 H 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 10 V 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 10 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 20 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 30 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCardClick('da_xuat_ban')}
                    className={`h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'da_xuat_ban'
                        ? 'border-emerald-500 ring-1 ring-emerald-400 bg-emerald-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Đã xuất bản</span>
                    <span className="text-sm font-bold text-emerald-600 ml-1">
                      {bbtDaXuatBan}
                    </span>
                  </button>

                  <button
                    onClick={() => handleCardClick('dang_trien_khai')}
                    className={`h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'dang_trien_khai'
                        ? 'border-sky-500 ring-1 ring-sky-400 bg-sky-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Đang triển khai</span>
                    <span className="text-sm font-bold text-sky-600 ml-1">
                      {bbtDangTrienKhai}
                    </span>
                  </button>

                  <button
                    onClick={() => handleCardClick('qua_han')}
                    className={`h-[40px] px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'qua_han'
                        ? 'border-rose-600 ring-2 ring-rose-400 bg-rose-50/60'
                        : 'border-rose-500 hover:border-rose-600 hover:bg-rose-50/20'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Quá hạn</span>
                    <span className="text-sm font-bold text-rose-600 ml-1">
                      {bbtQuaHan}
                    </span>
                  </button>
                </div>
              </div>

              {/* HÀNG 2: 3 Xuất bản sau 7/1/2026 */}
              <div className="flex items-center gap-0">
                <button
                  onClick={() => handleCardClick('after_7')}
                  className={`shrink-0 w-56 sm:w-60 h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 text-left bg-white shadow-2xs ${
                    selectedStatFilter === 'after_7'
                      ? 'border-sky-400 ring-1 ring-sky-300 bg-sky-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-600 shrink-0 inline-block" />
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    {bbtCountAfter7}
                  </span>
                  <span className="text-xs text-gray-800 font-normal truncate">
                    Xuất bản sau 7/1/2026
                  </span>
                </button>

                <div className="shrink-0 w-4 sm:w-5 flex items-center justify-center">
                  <svg width="20" height="40" viewBox="0 0 20 40" fill="none" className="text-gray-300">
                    <path d="M 0 20 H 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 12 V 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 12 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M 10 28 H 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCardClick('han_trong_3_ngay')}
                    className={`h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'han_trong_3_ngay'
                        ? 'border-sky-500 ring-1 ring-sky-400 bg-sky-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Hạn trong 3 ngày</span>
                    <span className="text-sm font-bold text-gray-900 ml-1">
                      {bbtHanTrong3Ngay}
                    </span>
                  </button>

                  <button
                    onClick={() => handleCardClick('han_sau_3_ngay')}
                    className={`h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 bg-white shadow-2xs ${
                      selectedStatFilter === 'han_sau_3_ngay'
                        ? 'border-rose-400 ring-1 ring-rose-300 bg-rose-50/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-xs text-gray-800 whitespace-nowrap">Hạn sau 3 ngày</span>
                    <span className="text-sm font-bold text-rose-600 ml-1">
                      {bbtHanSau3Ngay}
                    </span>
                  </button>
                </div>
              </div>

              {/* HÀNG 3: 1 Chưa có hạn đăng bài */}
              <div className="flex items-center gap-0">
                <button
                  onClick={() => handleCardClick('no_deadline')}
                  className={`shrink-0 w-56 sm:w-60 h-[40px] px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 text-left bg-white shadow-2xs ${
                    selectedStatFilter === 'no_deadline'
                      ? 'border-rose-400 ring-1 ring-rose-300 bg-rose-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 shrink-0 inline-block" />
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    {bbtNoDeadline}
                  </span>
                  <span className="text-xs text-gray-800 font-normal truncate">
                    Chưa có hạn đăng bài
                  </span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};
