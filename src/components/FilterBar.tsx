import React from 'react';
import { 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Plus, 
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import { ActiveFilterTab, TopicStatus } from '../types';

interface FilterBarProps {
  activeTab: ActiveFilterTab;
  setActiveTab: (tab: ActiveFilterTab) => void;
  tabCounts: {
    all: number;
    assigned: number;
    important: number;
    completed: number;
    in_progress: number;
    overdue: number;
  };
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedUserNeed: string;
  setSelectedUserNeed: (need: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  onOpenCreateModal: () => void;
  selectedStatFilter: string | null;
  onClearStatFilter: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeTab,
  setActiveTab,
  tabCounts,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedUserNeed,
  setSelectedUserNeed,
  dateRange,
  setDateRange,
  viewMode,
  setViewMode,
  onOpenCreateModal,
  selectedStatFilter,
  onClearStatFilter,
}) => {
  const getStatFilterLabel = (key: string) => {
    switch (key) {
      case 'overdue':
        return 'Đề tài Quan trọng - Đã quá hạn (Cần xử lý)';
      case 'due_today_completed':
        return 'Đến hạn hôm nay - Đã hoàn thành (4 đề tài)';
      case 'due_today_pending':
        return 'Đến hạn hôm nay - Chưa hoàn thành (4 đề tài)';
      case 'due_in_3_days':
        return 'Chưa tới hạn - Hạn trong 3 ngày tới (1 đề tài)';
      case 'due_over_3_days':
        return 'Chưa tới hạn - Hạn hơn 3 ngày (1 đề tài)';
      default:
        return key;
    }
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Search & Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Lọc theo: Thời gian tạo */}
        <div className="relative">
          <select
            id="select-filter-type"
            className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer shadow-2xs"
            defaultValue="created"
          >
            <option value="created">Lọc theo: Thời gian tạo</option>
            <option value="deadline">Lọc theo: Hạn xử lý</option>
            <option value="updated">Lọc theo: Cập nhật gần nhất</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Range Picker */}
        <div className="relative flex items-center bg-white border border-gray-300 hover:border-gray-400 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium cursor-pointer shadow-2xs">
          <span>{dateRange || '1/1/2025 - 7/1/2025'}</span>
          <CalendarIcon className="w-4 h-4 text-gray-400 ml-2.5" />
        </div>

        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <input
            id="input-search-topics"
            type="text"
            placeholder="Tìm theo tên, ban, phóng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 hover:border-gray-400 rounded-lg pl-3.5 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-2xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* User need Filter */}
        <div className="relative">
          <select
            id="select-user-need"
            value={selectedUserNeed}
            onChange={(e) => setSelectedUserNeed(e.target.value)}
            className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer shadow-2xs"
          >
            <option value="all">User need</option>
            <option value="Update">Update</option>
            <option value="Mới">Mới</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Trạng thái Filter */}
        <div className="relative">
          <select
            id="select-status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium cursor-pointer shadow-2xs"
          >
            <option value="all">Trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đang triển khai">Đang triển khai</option>
            <option value="Lên kế hoạch">Lên kế hoạch</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Từ chối">Từ chối</option>
            <option value="Quá hạn">Quá hạn</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Create Topic Button */}
        <button
          id="btn-create-topic-main"
          onClick={onOpenCreateModal}
          className="ml-auto bg-[#be185d] hover:bg-[#9d174d] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tạo đề tài</span>
        </button>
      </div>

      {/* Tabs Row matching screenshot */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {/* 113 Tất cả */}
        <button
          id="tab-all-topics"
          onClick={() => {
            setActiveTab('all');
            if (selectedStatFilter) onClearStatFilter();
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all' && !selectedStatFilter
              ? 'border-pink-500 text-pink-600 bg-pink-50/50 shadow-2xs'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
          }`}
        >
          <span className="font-extrabold mr-1.5 text-base">{tabCounts.all}</span>
          <span>Tất cả</span>
        </button>

        {/* 5 Gửi BBT và BBT giao */}
        <button
          id="tab-assigned-topics"
          onClick={() => {
            setActiveTab('assigned');
            if (selectedStatFilter) onClearStatFilter();
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assigned'
              ? 'border-pink-500 text-pink-600 bg-pink-50/50 shadow-2xs'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
          }`}
        >
          <span className="font-extrabold mr-1.5 text-base">{tabCounts.assigned}</span>
          <span>Gửi BBT và BBT giao</span>
        </button>

        {/* 10 Quan trọng */}
        <button
          id="tab-important-topics"
          onClick={() => {
            setActiveTab('important');
            if (selectedStatFilter) onClearStatFilter();
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'important' || selectedStatFilter
              ? 'border-amber-500 text-amber-800 bg-amber-50/70 ring-1 ring-amber-400 font-bold shadow-2xs'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
          }`}
        >
          <span className="font-extrabold mr-1.5 text-base text-amber-700">{tabCounts.important}</span>
          <span>Quan trọng</span>
        </button>

        {/* 5 Hoàn thành */}
        <button
          id="tab-completed-topics"
          onClick={() => {
            setActiveTab('completed');
            if (selectedStatFilter) onClearStatFilter();
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'completed'
              ? 'border-pink-500 text-pink-600 bg-pink-50/50 shadow-2xs'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
          }`}
        >
          <span className="font-extrabold mr-1.5 text-base">{tabCounts.completed}</span>
          <span>Hoàn thành</span>
        </button>

        {/* 10 Đang triển khai */}
        <button
          id="tab-in-progress-topics"
          onClick={() => {
            setActiveTab('in_progress');
            if (selectedStatFilter) onClearStatFilter();
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'in_progress'
              ? 'border-pink-500 text-pink-600 bg-pink-50/50 shadow-2xs'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
          }`}
        >
          <span className="font-extrabold mr-1.5 text-base">{tabCounts.in_progress}</span>
          <span>Đang triển khai</span>
        </button>

        {/* 10 Quá hạn */}
        <button
          id="tab-overdue-topics"
          onClick={() => {
            setActiveTab('overdue');
            if (selectedStatFilter) onClearStatFilter();
          }}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overdue'
              ? 'border-pink-500 text-pink-600 bg-pink-50/50 shadow-2xs'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white'
          }`}
        >
          <span className="font-extrabold mr-1.5 text-base text-rose-600">{tabCounts.overdue}</span>
          <span>Quá hạn</span>
        </button>
      </div>

      {/* Sub-view & Active Filter Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center space-x-2">
          {/* Xem theo: Mặc định */}
          <div className="relative">
            <select
              id="select-view-mode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="appearance-none bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-xs rounded-md px-3 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-gray-400 font-medium cursor-pointer shadow-2xs"
            >
              <option value="default">Xem theo: Mặc định</option>
              <option value="deadline">Xem theo: Nhóm hạn chót</option>
              <option value="status">Xem theo: Nhóm trạng thái</option>
              <option value="department">Xem theo: Ban chuyên môn</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Active Statistics Filter badge */}
          {selectedStatFilter && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
              <span>Đang lọc: {getStatFilterLabel(selectedStatFilter)}</span>
              <button
                onClick={onClearStatFilter}
                className="p-0.5 hover:bg-amber-200 rounded text-amber-800"
                title="Bỏ lọc thống kê"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {(searchTerm || selectedStatus !== 'all' || selectedUserNeed !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedUserNeed('all');
              }}
              className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xoá bộ lọc</span>
            </button>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Hiển thị danh sách đề tài tòa soạn
        </div>
      </div>
    </div>
  );
};
