import React from 'react';
import { 
  MessageSquare, 
  ExternalLink, 
  Copy,
  AlertTriangle,
  Star,
  Zap,
  ShieldAlert,
  Shield
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
}) => {
  const getStatusDisplay = (status: TopicStatus) => {
    switch (status) {
      case 'Đang triển khai':
        return <span className="text-xs font-semibold text-sky-600">Đang triển khai</span>;
      case 'Lên kế hoạch':
        return <span className="text-xs font-semibold text-sky-600">Lên kế hoạch</span>;
      case 'Hoàn thành':
        return <span className="text-xs font-semibold text-emerald-600">Hoàn thành</span>;
      case 'Chờ duyệt':
        return <span className="text-xs font-semibold text-amber-600">Chờ duyệt</span>;
      case 'Quá hạn':
        return <span className="text-xs font-semibold text-rose-600">Quá hạn</span>;
      case 'Từ chối':
        return <span className="text-xs font-medium text-gray-400">Từ chối</span>;
      default:
        return <span className="text-xs font-medium text-gray-600">{status}</span>;
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
            <tr className="bg-gray-50/90 border-b border-gray-200 text-xs font-bold text-gray-700 tracking-wider">
              <th className="py-3 px-3 w-12 text-center">STT</th>
              <th className="py-3 px-4 min-w-[280px]">Đề tài</th>
              <th className="py-3 px-4 w-32">Ban</th>
              <th className="py-3 px-4 w-36">Trạng thái</th>
              <th className="py-3 px-4 w-32">Bài viết</th>
              <th className="py-3 px-4 w-32">Hạn đăng bài</th>
              <th className="py-3 px-4 w-28">User need</th>
              <th className="py-3 px-4 w-24 text-center">Hành động</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-sm">
            {topics.map((topic, index) => {
              const articleStateText = topic.articleStatus 
                ? topic.articleStatus 
                : topic.status === 'Hoàn thành' 
                ? 'Đã tạo bài' 
                : 'Chưa tạo bài';

              return (
                <tr
                  key={topic.id}
                  id={`topic-row-${topic.id}`}
                  className={`hover:bg-slate-50/70 transition-colors group ${
                    topic.isSensitive && topic.sensitivityLevel === 3 ? 'bg-rose-50/25 border-l-2 border-l-rose-500' : ''
                  }`}
                >
                  {/* STT */}
                  <td className="py-3 px-3 text-center font-medium text-gray-600 text-xs">
                    {index + 1}
                  </td>

                  {/* Đề tài */}
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-1.5">
                      {topic.isImportant && (
                        <span 
                          title="Đề tài Quan trọng" 
                          className="inline-flex items-center text-amber-500 mt-0.5 shrink-0"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </span>
                      )}

                      {/* Icon cảnh báo mức độ nhạy cảm trước tiêu đề */}
                      {topic.isSensitive && (
                        <span 
                          title={`Đề tài nhạy cảm Mức ${topic.sensitivityLevel || 1}${topic.sensitivityCategory ? `: ${topic.sensitivityCategory}` : ''}`} 
                          className="inline-flex items-center mt-0.5 shrink-0"
                        >
                          {topic.sensitivityLevel === 3 ? (
                            <ShieldAlert className="w-4 h-4 text-rose-600 fill-rose-100 animate-pulse" />
                          ) : topic.sensitivityLevel === 2 ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-500 fill-orange-100" />
                          ) : (
                            <Shield className="w-3.5 h-3.5 text-amber-600 fill-amber-100" />
                          )}
                        </span>
                      )}

                      <div>
                        <button
                          onClick={() => onSelectTopic(topic)}
                          className="text-left font-medium text-gray-900 hover:text-red-700 hover:underline transition-colors leading-snug cursor-pointer line-clamp-2"
                        >
                          {topic.title}
                        </button>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {/* Nhận diện cấp độ nhạy cảm */}
                          {topic.isSensitive && (
                            <span 
                              title={`Lĩnh vực: ${topic.sensitivityCategory || 'Chung'}`}
                              className={`px-1.5 py-0.2 text-[10px] rounded-md inline-flex items-center gap-1 font-bold ${
                                topic.sensitivityLevel === 3
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs'
                                  : topic.sensitivityLevel === 2
                                  ? 'bg-orange-50 text-orange-900 border border-orange-300'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {topic.sensitivityLevel === 3 ? (
                                <ShieldAlert className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                              ) : topic.sensitivityLevel === 2 ? (
                                <AlertTriangle className="w-2.5 h-2.5 text-orange-600 shrink-0" />
                              ) : (
                                <Shield className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                              )}
                              <span>
                                {topic.sensitivityLevel === 3 
                                  ? 'Nhạy cảm Mức 3: Đặc biệt' 
                                  : topic.sensitivityLevel === 2 
                                  ? 'Nhạy cảm Mức 2: Tăng cường' 
                                  : 'Nhạy cảm Mức 1'}
                              </span>
                              {topic.sensitivityCategory && (
                                <span className="opacity-75 font-normal pl-1 border-l border-current/30 max-w-[220px] truncate">
                                  {topic.sensitivityCategory}
                                </span>
                              )}
                            </span>
                          )}

                          {typeof topic.commentsCount === 'number' && topic.commentsCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[11px] font-medium text-gray-600 rounded bg-gray-100 border border-gray-200">
                              <MessageSquare className="w-3 h-3 text-gray-400" />
                              <span>{topic.commentsCount}</span>
                            </span>
                          )}

                          {(topic.fromTrendsense || topic.tags?.includes('Trendsense')) && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 text-rose-600 fill-rose-100" />
                              Trendsense
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Ban */}
                  <td className="py-3 px-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {topic.department || 'Tin tức'}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusDisplay(topic.status)}
                  </td>

                  {/* Bài viết */}
                  <td className="py-3 px-4 text-xs font-normal text-gray-700 whitespace-nowrap">
                    {articleStateText}
                  </td>

                  {/* Hạn đăng bài */}
                  <td className="py-3 px-4 text-xs text-gray-700 whitespace-nowrap font-sans">
                    {topic.deadline}
                  </td>

                  {/* User need */}
                  <td className="py-3 px-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {topic.userNeed ? (
                      <span className="text-gray-700 font-medium">
                        {topic.userNeed}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Hành động */}
                  <td className="py-3 px-4 text-xs text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          if (topic.status === 'Hoàn thành' || articleStateText === 'Đã tạo bài') {
                            onOpenArticle(topic.id, topic.title);
                          } else {
                            onCreateArticle(topic.id, topic.title);
                          }
                        }}
                        title="Mở bài viết"
                        className="p-1.5 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(topic.title);
                        }}
                        title="Sao chép tiêu đề"
                        className="p-1.5 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
