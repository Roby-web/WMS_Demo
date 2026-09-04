import React, { useState } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationBannerProps {
  notifications: NotificationItem[];
  onHide: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
  onHide,
  onSelectNotification,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(notifications.length - itemsPerPage, prev + 1));
  };

  const visibleNotifications = notifications.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div 
      id="notification-banner-section" 
      className="mb-5 bg-orange-50/50 border border-orange-200/80 rounded-xl p-4 transition-all duration-300 relative"
    >
      {/* Header of notification row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-gray-800">
            {notifications.length} thông báo chưa đọc.
          </span>
          <button
            id="btn-hide-notification-text"
            onClick={onHide}
            className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 ml-1 transition-colors"
          >
            Ẩn thông báo
          </button>
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center space-x-1">
          <button
            id="btn-notif-prev"
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`p-1 rounded-md border ${
              startIndex === 0 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white/50' 
                : 'border-gray-300 text-gray-700 hover:bg-white bg-white'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-notif-next"
            onClick={handleNext}
            disabled={startIndex + itemsPerPage >= notifications.length}
            className={`p-1 rounded-md border ${
              startIndex + itemsPerPage >= notifications.length 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white/50' 
                : 'border-gray-300 text-gray-700 hover:bg-white bg-white'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-close-notification"
            onClick={onHide}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 ml-2"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards List matching Screenshot 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {visibleNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onSelectNotification?.(notif)}
            className="bg-white p-3.5 rounded-lg border border-orange-100/90 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer relative flex flex-col justify-between"
          >
            <div>
              <p className="text-xs text-gray-800 leading-snug">
                <strong className="font-bold text-gray-900">{notif.user}</strong>{' '}
                <span className={notif.type === 'rejected' ? 'text-rose-600 font-medium' : notif.type === 'approved' ? 'text-emerald-700 font-medium' : 'text-gray-700'}>
                  {notif.action}
                </span>{' '}
                <strong className="font-semibold text-gray-900 line-clamp-2">
                  {notif.topicTitle}
                </strong>
              </p>
            </div>
            <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between">
              <span>{notif.timeAgo}</span>
              {notif.type === 'rejected' && <span className="text-rose-500 text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">Từ chối</span>}
              {notif.type === 'approved' && <span className="text-emerald-600 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">Đã duyệt</span>}
              {notif.type === 'accepted' && <span className="text-blue-600 text-[10px] bg-blue-50 px-1.5 py-0.5 rounded">Gia hạn</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
