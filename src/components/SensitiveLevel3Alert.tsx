import React, { useState } from 'react';
import { ShieldAlert, Filter, X } from 'lucide-react';
import { Topic, UserRole } from '../types';

interface SensitiveLevel3AlertProps {
  topics: Topic[];
  userRole?: UserRole | string;
  onSelectTopic: (topic: Topic) => void;
  onFilterLevel3?: (active: boolean) => void;
  isFilteringLevel3?: boolean;
}

export const SensitiveLevel3Alert: React.FC<SensitiveLevel3AlertProps> = ({
  topics,
  userRole = 'Ban biên tập',
  onSelectTopic,
  onFilterLevel3,
  isFilteringLevel3 = false,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Lọc các đề tài nhạy cảm Mức 3
  const level3Topics = topics.filter(
    (t) => t.isSensitive && t.sensitivityLevel === 3
  );

  if (level3Topics.length === 0 || isDismissed) {
    return null;
  }

  return (
    <div 
      id="level3-sensitive-alert-compact"
      className="bg-rose-50 border border-rose-200/90 rounded-xl px-3.5 py-2 shadow-2xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs transition-all"
    >
      {/* Thông tin cảnh báo ngắn gọn trên 1 dòng */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0 text-gray-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-rose-700 px-2.5 py-0.5 rounded shadow-2xs shrink-0">
            Cảnh báo Đặc biệt
          </span>
          <span className="font-medium text-gray-800">
            Có <strong className="text-rose-700 font-bold">{level3Topics.length} đề tài nhạy cảm Mức 3</strong> cần Ban biên tập kiểm duyệt, chỉ đạo.
          </span>
          {level3Topics.length > 0 && (
            <span className="text-gray-500 hidden lg:inline text-[11px]">
              (Gần nhất: <span className="font-semibold text-gray-700 italic truncate max-w-xs inline-block align-bottom">{level3Topics[0].title}</span>)
            </span>
          )}
        </div>
      </div>

      {/* Các nút thao tác nhanh bên phải */}
      <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
        {level3Topics.length > 0 && (
          <button
            type="button"
            onClick={() => onSelectTopic(level3Topics[0])}
            className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 hover:underline px-1 py-0.5 cursor-pointer"
          >
            Xem chi tiết
          </button>
        )}

        {onFilterLevel3 && (
          <button
            type="button"
            id="btn-filter-level3-topics"
            onClick={() => onFilterLevel3(!isFilteringLevel3)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isFilteringLevel3
                ? 'bg-rose-700 text-white border-rose-800 shadow-2xs'
                : 'bg-white hover:bg-rose-100 text-rose-800 border-rose-300'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{isFilteringLevel3 ? 'Hủy lọc' : `Lọc xem (${level3Topics.length})`}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-rose-100/60 transition-colors cursor-pointer"
          title="Đóng cảnh báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
