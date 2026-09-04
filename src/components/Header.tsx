import React from 'react';
import { 
  Bell, 
  ChevronDown, 
  ArrowLeft,
  FileText,
  Layers,
  Calendar,
  BarChart3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  unreadCount?: number;
  showNotificationBanner: boolean;
  setShowNotificationBanner: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  unreadCount = 5,
  showNotificationBanner,
  setShowNotificationBanner,
}) => {
  return (
    <header id="newsroom-header" className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Left Side: Back button & Brand / Tabs */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button 
            id="btn-back-editor"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pr-4 border-r border-gray-200"
            onClick={() => alert('Quay lại giao diện Soạn thảo Editor')}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 text-gray-500" />
            <span className="underline underline-offset-2">Trở về Editor</span>
          </button>

          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              E
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">
              Newsroom
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 pl-2">
            <button
              id="nav-wms"
              onClick={() => setActiveNav('WMS')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                activeNav === 'WMS'
                  ? 'bg-gray-100 text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              WMS
            </button>
            <button
              id="nav-special-subject"
              onClick={() => setActiveNav('Special Subject')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeNav === 'Special Subject'
                  ? 'bg-gray-100 text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Special Subject
            </button>
            <button
              id="nav-topic-daily"
              onClick={() => setActiveNav('Topic Daily')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeNav === 'Topic Daily'
                  ? 'bg-gray-100 text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Topic Daily
            </button>
            <button
              id="nav-kpi"
              onClick={() => setActiveNav('KPI')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeNav === 'KPI'
                  ? 'bg-gray-100 text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              KPI
            </button>
          </nav>
        </div>

        {/* Right Side: Notification & User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification bell button */}
          <button
            id="btn-toggle-notification-bell"
            onClick={() => setShowNotificationBanner(!showNotificationBanner)}
            className="relative p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none"
            title={showNotificationBanner ? 'Ẩn thông báo' : 'Hiện thông báo'}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-xs border border-gray-300">
              PV
            </div>
            <div className="flex items-center text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
              <span>Phóng viên</span>
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
