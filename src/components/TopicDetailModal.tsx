import React from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  User, 
  Building, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  FileText,
  Send,
  AlertCircle,
  Zap,
  Tag
} from 'lucide-react';
import { Topic, TopicStatus } from '../types';

interface TopicDetailModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (topicId: string, status: TopicStatus) => void;
  onToggleImportant: (topicId: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  isOpen,
  onClose,
  onUpdateStatus,
  onToggleImportant,
}) => {
  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-topic-detail"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
              STT #{topic.stt}
            </span>
            <h3 className="font-bold text-base text-white line-clamp-1">
              Chi tiết đề tài
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title & Priority */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 leading-snug">
                {topic.title}
              </h2>
              <button
                onClick={() => onToggleImportant(topic.id)}
                className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-bold transition-all shrink-0 ${
                  topic.isImportant
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-900'
                }`}
                title="Bật/tắt trạng thái Quan trọng"
              >
                <Star className={`w-4 h-4 ${topic.isImportant ? 'fill-amber-400 text-amber-500' : ''}`} />
                <span>{topic.isImportant ? 'Quan trọng' : 'Thường'}</span>
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {(topic.fromTrendsense || topic.tags?.includes('Trendsense')) && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-100" />
                  Nguồn Trendsense
                </span>
              )}
              {topic.tags?.filter(t => t !== 'Trendsense').map((t) => (
                <span key={t} className="px-2.5 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">
                  {t}
                </span>
              ))}
              {topic.userNeed && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                  User need: {topic.userNeed}
                </span>
              )}
            </div>
          </div>

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 block mb-0.5">Phóng viên</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gray-400" />
                {topic.author}
              </span>
            </div>

            <div>
              <span className="text-gray-500 block mb-0.5">Ban chuyên môn</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                {topic.department}
              </span>
            </div>

            <div>
              <span className="text-gray-500 block mb-0.5">Hạn hoàn thành</span>
              <span className={`font-semibold font-mono flex items-center gap-1 ${
                topic.isDueToday ? 'text-rose-600' : 'text-gray-900'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {topic.deadline} {topic.isDueToday ? '(Hôm nay)' : ''}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Tóm tắt đề cương / Góc nhìn khai thác
            </h4>
            <div className="p-4 bg-white rounded-xl border border-gray-200 text-sm text-gray-800 leading-relaxed">
              {topic.description || 'Chưa có ghi chú chi tiết cho đề tài này.'}
            </div>
          </div>

          {/* Quick status update control */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Chuyển đổi trạng thái nhanh
            </h4>
            <div className="flex flex-wrap gap-2">
              {(['Chờ duyệt', 'Đang triển khai', 'Lên kế hoạch', 'Hoàn thành', 'Từ chối'] as TopicStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(topic.id, st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    topic.status === st
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-400/50'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500">
            Tạo lúc: {topic.createdAt}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
