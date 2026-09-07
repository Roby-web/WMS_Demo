import React, { useState } from 'react';
import { 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Plus, 
  SlidersHorizontal,
  RotateCcw,
  Check
} from 'lucide-react';
import { UserRole } from '../types';

interface FilterBarProps {
  userRole?: UserRole | string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedUserNeed: string;
  setSelectedUserNeed: (need: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  onOpenCreateModal: () => void;
  selectedStatFilter: string | null;
  onClearStatFilter: () => void;
  // Advanced filter props
  selectedDeadlineRange?: string;
  setSelectedDeadlineRange?: (range: string) => void;
  selectedDeadlineStatus?: string;
  setSelectedDeadlineStatus?: (status: string) => void;
  selectedDepartment?: string;
  setSelectedDepartment?: (dept: string) => void;
  selectedAuthor?: string;
  setSelectedAuthor?: (author: string) => void;
  selectedArticleStatus?: string;
  setSelectedArticleStatus?: (status: string) => void;
  selectedPriority?: string;
  setSelectedPriority?: (priority: string) => void;
  onResetAllFilters?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  userRole = 'Ban biên tập',
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedUserNeed,
  setSelectedUserNeed,
  dateRange,
  setDateRange,
  onOpenCreateModal,
  selectedStatFilter,
  onClearStatFilter,
  selectedDeadlineRange = 'all',
  setSelectedDeadlineRange,
  selectedDeadlineStatus = 'all',
  setSelectedDeadlineStatus,
  selectedDepartment = 'all',
  setSelectedDepartment,
  selectedAuthor = 'all',
  setSelectedAuthor,
  selectedArticleStatus = 'all',
  setSelectedArticleStatus,
  selectedPriority = 'all',
  setSelectedPriority,
  onResetAllFilters,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const isBBT = userRole === 'Ban biên tập';
  const isTruongBan = userRole === 'Trưởng ban';

  // Tính số lượng bộ lọc nâng cao đang áp dụng
  const activeAdvancedFilterCount = [
    selectedUserNeed !== 'all',
    selectedDeadlineRange !== 'all',
    selectedDeadlineStatus !== 'all',
    !isTruongBan && selectedDepartment !== 'all',
    !isBBT && selectedAuthor !== 'all',
    selectedArticleStatus !== 'all',
    selectedPriority !== 'all'
  ].filter(Boolean).length;

  const handleResetAdvanced = () => {
    setSelectedUserNeed('all');
    if (setSelectedDeadlineRange) setSelectedDeadlineRange('all');
    if (setSelectedDeadlineStatus) setSelectedDeadlineStatus('all');
    if (setSelectedDepartment) setSelectedDepartment('all');
    if (setSelectedAuthor) setSelectedAuthor('all');
    if (setSelectedArticleStatus) setSelectedArticleStatus('all');
    if (setSelectedPriority) setSelectedPriority('all');
  };

  const handleResetEverything = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    handleResetAdvanced();
    if (onClearStatFilter) onClearStatFilter();
    if (onResetAllFilters) onResetAllFilters();
  };

  return (
    <div id="main-filter-bar-container" className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3 transition-all">
      {/* Hàng điều khiển bộ lọc chính */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Mặc định lọc theo Ngày tạo */}
        <div 
          title="Mặc định lọc theo Ngày tạo"
          className="relative flex items-center bg-white border border-gray-300 hover:border-gray-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer shadow-2xs select-none"
        >
          <span className="text-gray-500 font-normal mr-1.5 whitespace-nowrap">Ngày tạo:</span>
          <span className="whitespace-nowrap font-medium text-gray-800">{dateRange || '1/1/2026 - 7/1/2026'}</span>
          <CalendarIcon className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
        </div>

        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <input
            id="input-search-topics"
            type="text"
            placeholder="Tìm theo tên, ban, phóng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 hover:border-gray-400 rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Trạng thái Filter */}
        <div className="relative">
          <select
            id="select-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs sm:text-sm rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer shadow-2xs"
          >
            <option value="all">Trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đang triển khai">Đang triển khai</option>
            <option value="Lên kế hoạch">Lên kế hoạch</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Quá hạn">Quá hạn</option>
            <option value="Từ chối">Từ chối</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* NÚT BỘ LỌC NÂNG CAO */}
        <button
          id="btn-advanced-filter-toggle"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs ${
            isAdvancedOpen || activeAdvancedFilterCount > 0
              ? 'bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-200'
              : 'bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-current" />
          <span>Bộ lọc nâng cao</span>
          {activeAdvancedFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
              {activeAdvancedFilterCount}
            </span>
          )}
        </button>

        {/* Create Topic Button */}
        <button
          id="btn-create-topic-main"
          onClick={onOpenCreateModal}
          className="ml-auto bg-[#be185d] hover:bg-[#9d174d] text-white px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo đề tài</span>
        </button>
      </div>

      {/* ================= PANEL BỘ LỌC NÂNG CAO ================= */}
      {isAdvancedOpen && (
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-150">
          
          {/* 1. Hạn hoàn thành & Hạn đăng bài (Đưa vào bộ lọc nâng cao) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Hạn hoàn thành / đăng bài
            </label>
            <select
              value={selectedDeadlineRange}
              onChange={(e) => setSelectedDeadlineRange && setSelectedDeadlineRange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">Tất cả hạn hoàn thành</option>
              <option value="in_range_1_7">Trong khoảng 1/1 - 7/1/2026</option>
              <option value="after_7">Sau 7/1/2026</option>
              <option value="today">Hôm nay</option>
              <option value="no_deadline">Chưa có hạn đăng bài</option>
            </select>
          </div>

          {/* 2. Bổ sung: Lọc theo "Tình trạng hạn" */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Tình trạng hạn
            </label>
            <select
              value={selectedDeadlineStatus}
              onChange={(e) => setSelectedDeadlineStatus && setSelectedDeadlineStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">Tất cả tình trạng hạn</option>
              <option value="due_today">Đến hạn hôm nay</option>
              <option value="within_3_days">Hạn trong 3 ngày</option>
              <option value="after_3_days">Hạn sau 3 ngày</option>
              <option value="overdue">Quá hạn</option>
              <option value="on_time">Đúng hạn / Chưa đến hạn</option>
              <option value="no_deadline">Chưa có hạn</option>
            </select>
          </div>

          {/* 3. User Need (Đưa User Need vào trong Lọc nâng cao) */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              User need
            </label>
            <select
              id="select-user-need-advanced"
              value={selectedUserNeed}
              onChange={(e) => setSelectedUserNeed(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">Tất cả User need</option>
              <option value="Update">Update</option>
              <option value="Mới">Mới</option>
            </select>
          </div>

          {/* 4. Ban chuyên môn (ẨN đối với cấp Trưởng ban) */}
          {!isTruongBan && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Ban chuyên môn
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment && setSelectedDepartment(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="all">Tất cả các ban</option>
                <option value="Kinh doanh">Kinh doanh</option>
                <option value="Thế giới">Thế giới</option>
                <option value="Y tế - Sức khỏe">Y tế - Sức khỏe</option>
                <option value="Giáo dục">Giáo dục</option>
                <option value="Pháp luật">Pháp luật</option>
                <option value="Tài chính">Tài chính</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Thời sự - Chính trị">Thời sự - Chính trị</option>
              </select>
            </div>
          )}

          {/* 5. Phóng viên / Tác giả (ẨN đối với cấp Ban biên tập) */}
          {!isBBT && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Phóng viên / Tác giả
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor && setSelectedAuthor(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="all">Tất cả phóng viên</option>
                <option value="Trần Thu Hà">Trần Thu Hà</option>
                <option value="Lê Hoàng Nam">Lê Hoàng Nam</option>
                <option value="Trần Duy Tùng (PV)">Trần Duy Tùng (PV)</option>
                <option value="Hoàng Mỹ Linh">Hoàng Mỹ Linh</option>
                <option value="Đặng Tuấn Kiệt">Đặng Tuấn Kiệt</option>
                <option value="Vũ Thanh Mai">Vũ Thanh Mai</option>
                <option value="Đỗ Tiến Đạt">Đỗ Tiến Đạt</option>
                <option value="Lê Hồng Quang">Lê Hồng Quang</option>
              </select>
            </div>
          )}

          {/* 6. Lọc theo Tiến độ bài viết */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Tiến độ bài viết
            </label>
            <select
              value={selectedArticleStatus}
              onChange={(e) => setSelectedArticleStatus && setSelectedArticleStatus(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái bài</option>
              <option value="Đã tạo bài">Đã tạo bài</option>
              <option value="Chưa tạo bài">Chưa tạo bài</option>
            </select>
          </div>

          {/* 7. Lọc theo Tính chất đề tài */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Tính chất đề tài
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority && setSelectedPriority(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="all">Tất cả tính chất</option>
              <option value="important">Đề tài Quan trọng</option>
              <option value="trendsense">Tin từ Trendsense</option>
              <option value="editor">Gửi BBT</option>
            </select>
          </div>

          {/* Actions row for advanced filter */}
          <div className="sm:col-span-2 md:col-span-4 flex items-center justify-between pt-1">
            <button
              onClick={handleResetAdvanced}
              className="text-xs text-gray-500 hover:text-gray-800 underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại bộ lọc nâng cao</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdvancedOpen(false)}
                className="px-3 py-1 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => setIsAdvancedOpen(false)}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dòng trạng thái nếu có bất kỳ bộ lọc nào đang hoạt động */}
      {(searchTerm || selectedStatus !== 'all' || activeAdvancedFilterCount > 0 || selectedStatFilter) && (
        <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-gray-600">
            <span className="font-semibold text-gray-700">Đang lọc theo:</span>
            {searchTerm && (
              <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800">
                Từ khoá: "{searchTerm}"
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800">
                Trạng thái: {selectedStatus}
              </span>
            )}
            {selectedUserNeed !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800">
                User need: {selectedUserNeed}
              </span>
            )}
            {selectedDeadlineRange !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800">
                Hạn đăng: {
                  selectedDeadlineRange === 'in_range_1_7' ? '1/1 - 7/1/2026' : 
                  selectedDeadlineRange === 'after_7' ? 'Sau 7/1/2026' : 
                  selectedDeadlineRange === 'today' ? 'Hôm nay' : 'Chưa có hạn'
                }
              </span>
            )}
            {selectedDeadlineStatus !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-800">
                Tình trạng hạn: {
                  selectedDeadlineStatus === 'due_today' ? 'Đến hạn hôm nay' :
                  selectedDeadlineStatus === 'within_3_days' ? 'Hạn trong 3 ngày' :
                  selectedDeadlineStatus === 'after_3_days' ? 'Hạn sau 3 ngày' :
                  selectedDeadlineStatus === 'overdue' ? 'Quá hạn' :
                  selectedDeadlineStatus === 'no_deadline' ? 'Chưa có hạn' : 'Đúng hạn'
                }
              </span>
            )}
            {!isTruongBan && selectedDepartment !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800">
                Ban: {selectedDepartment}
              </span>
            )}
            {!isBBT && selectedAuthor !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-800">
                PV: {selectedAuthor}
              </span>
            )}
            {selectedArticleStatus !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800">
                Bài viết: {selectedArticleStatus}
              </span>
            )}
            {selectedPriority !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                {selectedPriority === 'important' ? 'Quan trọng' : selectedPriority === 'trendsense' ? 'Trendsense' : 'Gửi BBT'}
              </span>
            )}
            {selectedStatFilter && (
              <span className="px-2 py-0.5 rounded bg-rose-100 border border-rose-300 text-rose-900 font-medium">
                Thống kê: {selectedStatFilter}
              </span>
            )}
          </div>

          <button
            onClick={handleResetEverything}
            className="text-xs text-rose-600 hover:text-rose-800 underline font-medium cursor-pointer shrink-0 ml-auto"
          >
            Xóa tất cả lọc
          </button>
        </div>
      )}
    </div>
  );
};
