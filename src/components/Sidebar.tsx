import React from 'react';
import { 
  PlusCircle, 
  ListOrdered, 
  ChevronLeft, 
  ChevronRight,
  FileCheck,
  FolderKanban
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;
  onOpenCreateModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activeSidebarItem,
  setActiveSidebarItem,
  onOpenCreateModal,
}) => {
  return (
    <aside
      id="newsroom-sidebar"
      className={`bg-white border-r border-gray-200 transition-all duration-200 shrink-0 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="p-3 space-y-3">
        {/* Collapse button header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          {!isCollapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1">
              Menu quản lý
            </span>
          )}
          <button
            id="btn-toggle-sidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-auto"
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Sidebar Actions & Menu Items */}
        <div className="space-y-1">
          {/* Tạo đề xuất */}
          <button
            id="btn-sidebar-create-proposal"
            onClick={onOpenCreateModal}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
              activeSidebarItem === 'create'
                ? 'bg-red-50 text-red-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <PlusCircle className={`w-4 h-4 shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} text-gray-500`} />
            {!isCollapsed && <span>Tạo đề xuất</span>}
          </button>

          {/* Danh sách đề tài */}
          <button
            id="btn-sidebar-topics-list"
            onClick={() => setActiveSidebarItem('list')}
            className={`w-full flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors text-left ${
              activeSidebarItem === 'list'
                ? 'bg-gray-100 text-gray-900 shadow-2xs font-bold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ListOrdered className={`w-4 h-4 shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} text-gray-700`} />
            {!isCollapsed && <span>Danh sách đề tài</span>}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center text-xs text-gray-500 justify-between">
            <span>Phiên bản WMS</span>
            <span className="font-mono font-medium text-gray-600">v3.4.2</span>
          </div>
        </div>
      )}
    </aside>
  );
};
