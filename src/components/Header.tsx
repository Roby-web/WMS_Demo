import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  ArrowLeft,
  FileText,
  Layers,
  Calendar,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Check,
  ShieldAlert,
  Shield,
  UserCheck,
  User
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  unreadCount?: number;
  showNotificationBanner: boolean;
  setShowNotificationBanner: (show: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const ROLE_CONFIG: Record<UserRole, { code: string; label: string; badgeColor: string; desc: string; icon: React.FC<{ className?: string }> }> = {
  'Ban biên tập': {
    code: 'BBT',
    label: 'Ban biên tập',
    badgeColor: 'bg-indigo-600 text-white border-indigo-700',
    desc: 'Hội đồng biên tập, toàn quyền chỉ đạo & duyệt',
    icon: Shield,
  },
  'Trưởng ban': {
    code: 'TB',
    label: 'Trưởng ban',
    badgeColor: 'bg-amber-600 text-white border-amber-700',
    desc: 'Quản lý đề tài & điều phối phóng viên thuộc ban',
    icon: UserCheck,
  },
  'Phóng viên': {
    code: 'PV',
    label: 'Phóng viên',
    badgeColor: 'bg-slate-700 text-white border-slate-800',
    desc: 'Đề xuất ý tưởng, nhận việc & thực hiện bài viết',
    icon: User,
  },
};

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  unreadCount = 5,
  showNotificationBanner,
  setShowNotificationBanner,
  userRole,
  setUserRole,
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleInfo = ROLE_CONFIG[userRole] || ROLE_CONFIG['Ban biên tập'];

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

        {/* Right Side: Notification & User Profile (3 cấp) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Notification bell button */}
          <button
            id="btn-toggle-notification-bell"
            onClick={() => setShowNotificationBanner(!showNotificationBanner)}
            className="relative p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
            title={showNotificationBanner ? 'Ẩn thông báo' : 'Hiện thông báo'}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile with 3-level selector: Ban biên tập, Trưởng ban, Phóng viên */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="user-role-dropdown-btn"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-gray-200 py-1 rounded-md hover:bg-gray-50 transition-colors text-left cursor-pointer focus:outline-none"
              title="Nhấn để đổi cấp người dùng (Ban biên tập / Trưởng ban / Phóng viên)"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shadow-2xs ${currentRoleInfo.badgeColor}`}>
                {currentRoleInfo.code}
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center text-sm font-semibold text-gray-900 leading-tight">
                  <span>{currentRoleInfo.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-1 text-gray-500 transition-transform duration-150 ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
                </div>
                <span className="text-[11px] text-gray-400 font-normal">Chuyển cấp</span>
              </div>
              <ChevronDown className="sm:hidden w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isRoleMenuOpen && (
              <div 
                id="user-role-menu"
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Phân cấp người dùng (3 cấp)
                  </span>
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                    Demo
                  </span>
                </div>

                <div className="p-1.5 space-y-1">
                  {(['Ban biên tập', 'Trưởng ban', 'Phóng viên'] as UserRole[]).map((role) => {
                    const info = ROLE_CONFIG[role];
                    const isSelected = userRole === role;
                    const IconComp = info.icon;

                    return (
                      <button
                        key={role}
                        id={`role-option-${info.code.toLowerCase()}`}
                        onClick={() => {
                          setUserRole(role);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-start space-x-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50/80 border border-rose-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 mt-0.5 ${info.badgeColor}`}>
                          {info.code}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-rose-900' : 'text-gray-900'}`}>
                              {info.label}
                            </span>
                            {isSelected && (
                              <span className="flex items-center text-[11px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                                <Check className="w-3 h-3 mr-0.5" />
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                            {info.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-1 pt-2 border-t border-gray-100 px-3.5 py-1 text-[11px] text-gray-400 bg-gray-50/70 rounded-b-lg">
                  * Thay đổi cấp sẽ cập nhật quyền và dữ liệu hiển thị tương ứng ở Box Trendsense.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
