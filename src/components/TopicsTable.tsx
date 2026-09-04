import React from 'react';
import { 
  MessageSquare, 
  Tag, 
  Star, 
  ExternalLink, 
  FileEdit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Send,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { Topic, TopicStatus } from '../types';

interface TopicsTableProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onRequestCancel: (topicId: string, topicTitle: string) => void;
  onCreateArticle: (topicId: string, topicTitle: string) => void;
  onOpenArticle: (topicId: string, topicTitle: string) => void;
  onStatusChange: (topicId: string, newStatus: TopicStatus) => void;
}

export const TopicsTable: React.FC<TopicsTableProps> = ({
  topics,
  onSelectTopic,
  onRequestCancel,
  onCreateArticle,
  onOpenArticle,
  onStatusChange,
}) => {
  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'Chờ duyệt':
        return (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md border border-amber-500 text-amber-700 bg-white shadow-2xs">
            Chờ duyệt
          </span>
        );
      case 'Đang triển khai':
        return (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md border border-sky-500 text-sky-600 bg-white shadow-2xs">
            Đang triển khai
          </span>
        );
      case 'Lên kế hoạch':
        return (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md border border-blue-500 text-blue-600 bg-white shadow-2xs">
            Lên kế hoạch
          </span>
        );
      case 'Hoàn thành':
        return (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md border border-emerald-500 text-emerald-600 bg-white shadow-2xs">
            Hoàn thành
          </span>
        );
      case 'Từ chối':
        return (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md border border-gray-400 text-gray-600 bg-white shadow-2xs">
            Từ chối
          </span>
        );
      case 'Quá hạn':
        return (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md border border-rose-500 text-rose-600 bg-white shadow-2xs">
            Quá hạn
          </span>
        );
      default:
        return (
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-md border border-gray-300 text-gray-700 bg-white">
            {status}
          </span>
        );
    }
  };

  if (topics.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-gray-800">Không tìm thấy đề tài phù hợp</h4>
        <p className="text-xs text-gray-500 mt-1">Vui lòng điều chỉnh lại bộ lọc hoặc tìm kiếm từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div id="topics-table-container" className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header matching screenshot */}
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-700 tracking-wider">
              <th className="py-3 px-4 w-14 text-center">STT</th>
              <th className="py-3 px-4 min-w-[320px]">Đề tài</th>
              <th className="py-3 px-4 w-36 text-center">Trạng thái</th>
              <th className="py-3 px-4 w-32">Hạn</th>
              <th className="py-3 px-4 w-28">User need</th>
              <th className="py-3 px-4 min-w-[180px]">Hành động</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-sm">
            {topics.map((topic, index) => (
              <tr
                key={topic.id}
                id={`topic-row-${topic.id}`}
                className="hover:bg-amber-50/30 transition-colors group"
              >
                {/* STT */}
                <td className="py-3.5 px-4 text-center font-medium text-gray-600 text-xs">
                  {index + 1}
                </td>

                {/* Đề tài (Title + Tags + Comments) */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1.5">
                    {/* Title and Important star */}
                    <div className="flex items-start gap-1.5">
                      {topic.isImportant && (
                        <span 
                          title="Đề tài Quan trọng" 
                          className="inline-flex items-center text-amber-500 mt-0.5 shrink-0"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </span>
                      )}
                      <button
                        onClick={() => onSelectTopic(topic)}
                        className="text-left font-medium text-gray-900 hover:text-red-700 hover:underline transition-colors leading-snug cursor-pointer"
                      >
                        {topic.title}
                      </button>
                    </div>

                    {/* Tags row: Trendsense, Gửi BBT, Ưu tiên, Comment count */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {(topic.fromTrendsense || topic.tags?.includes('Trendsense')) && (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-0.5">
                          <Zap className="w-3 h-3 text-rose-600 fill-rose-100" />
                          Trendsense
                        </span>
                      )}

                      {topic.tags?.includes('Gửi BBT') && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Gửi BBT
                        </span>
                      )}

                      {topic.tags?.includes('Ưu tiên') && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-red-50 text-red-700 border border-red-200">
                          Ưu tiên
                        </span>
                      )}

                      {typeof topic.commentsCount === 'number' && topic.commentsCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 rounded bg-gray-100 border border-gray-200">
                          <MessageSquare className="w-3 h-3 text-gray-500" />
                          <span>{topic.commentsCount}</span>
                        </span>
                      )}

                      {topic.department && (
                        <span className="text-[11px] text-gray-400 hidden sm:inline-block">
                          · {topic.department} ({topic.author})
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="py-3.5 px-4 text-center">
                  {getStatusBadge(topic.status)}
                </td>

                {/* Hạn */}
                <td className="py-3.5 px-4 font-mono text-xs text-gray-700 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <span>{topic.deadline}</span>
                  </div>
                  {topic.isDueToday ? (
                    <span className="text-[10px] text-rose-600 font-semibold block">Hôm nay</span>
                  ) : topic.daysUntilDeadline > 0 && topic.daysUntilDeadline <= 3 ? (
                    <span className="text-[10px] text-sky-600 font-semibold block">Còn {topic.daysUntilDeadline} ngày</span>
                  ) : null}
                </td>

                {/* User need */}
                <td className="py-3.5 px-4 text-xs font-medium text-gray-700">
                  {topic.userNeed ? (
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 border border-gray-200">
                      {topic.userNeed}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>

                {/* Hành động matching screenshot */}
                <td className="py-3.5 px-4 text-xs">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {/* Action buttons depending on state */}
                    {topic.status === 'Chờ duyệt' && (
                      <button
                        onClick={() => onRequestCancel(topic.id, topic.title)}
                        className="text-gray-600 hover:text-rose-600 underline underline-offset-2 transition-colors cursor-pointer"
                      >
                        Yêu cầu huỷ
                      </button>
                    )}

                    {topic.status === 'Đang triển khai' && (
                      <>
                        <button
                          onClick={() => onCreateArticle(topic.id, topic.title)}
                          className="text-gray-700 hover:text-blue-700 underline underline-offset-2 transition-colors cursor-pointer font-medium"
                        >
                          Tạo bài viết
                        </button>
                        <button
                          onClick={() => onRequestCancel(topic.id, topic.title)}
                          className="text-gray-500 hover:text-rose-600 underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Yêu cầu huỷ
                        </button>
                      </>
                    )}

                    {topic.status === 'Lên kế hoạch' && (
                      <>
                        <button
                          onClick={() => onOpenArticle(topic.id, topic.title)}
                          className="text-gray-700 hover:text-blue-700 underline underline-offset-2 transition-colors cursor-pointer font-medium"
                        >
                          Mở bài viết
                        </button>
                        <button
                          onClick={() => onRequestCancel(topic.id, topic.title)}
                          className="text-gray-500 hover:text-rose-600 underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Yêu cầu huỷ
                        </button>
                      </>
                    )}

                    {topic.status === 'Hoàn thành' && (
                      <button
                        onClick={() => onOpenArticle(topic.id, topic.title)}
                        className="text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors cursor-pointer font-medium"
                      >
                        Xem bài đã xuất bản
                      </button>
                    )}

                    {topic.status === 'Từ chối' && (
                      <span className="text-gray-400 italic">Đã đóng</span>
                    )}

                    {topic.status === 'Quá hạn' && (
                      <button
                        onClick={() => onCreateArticle(topic.id, topic.title)}
                        className="text-rose-700 hover:text-rose-900 underline underline-offset-2 transition-colors cursor-pointer font-medium"
                      >
                        Xử lý gấp
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
