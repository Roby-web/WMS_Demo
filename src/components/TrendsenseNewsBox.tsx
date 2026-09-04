import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  RefreshCw, 
  Search,
  Building2,
  ArrowUpRight
} from 'lucide-react';
import { TrendsenseNewsItem, Topic } from '../types';
import { fetchTrendsenseNews, findMatchingTopics, formatTimeAgoVi } from '../data/trendsenseService';

interface TrendsenseNewsBoxProps {
  topics: Topic[];
  onOpenCreateModalWithTrendsense: (newsItem: TrendsenseNewsItem) => void;
  onFilterMatchedTopics: (newsTitle: string, matchedTopics: Topic[]) => void;
  activeTrendsenseFilterTitle: string | null;
  onClearTrendsenseFilter: () => void;
}

export const TrendsenseNewsBox: React.FC<TrendsenseNewsBoxProps> = ({
  topics,
  onOpenCreateModalWithTrendsense,
  onFilterMatchedTopics,
  activeTrendsenseFilterTitle,
  onClearTrendsenseFilter,
}) => {
  const [news, setNews] = useState<TrendsenseNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Store checking state per news item: key is news.id or title -> { checked: boolean, matchedTopics: Topic[] }
  const [checkedResults, setCheckedResults] = useState<Record<string, { checked: boolean; matched: Topic[] }>>({});

  // Fetch initial news from Google Sheets
  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      setIsLoading(true);
      const data = await fetchTrendsenseNews();
      if (isMounted) {
        setNews(data);
        setIsLoading(false);
      }
    };

    loadNews();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update check results whenever topics change (e.g. after a topic is created from Trendsense)
  useEffect(() => {
    setCheckedResults(prev => {
      const updated: Record<string, { checked: boolean; matched: Topic[] }> = {};
      Object.keys(prev).forEach(key => {
        if (prev[key].checked) {
          const item = news.find(n => n.id === key || n.title === key);
          if (item) {
            const matches = findMatchingTopics(item.title, topics);
            updated[key] = { checked: true, matched: matches };
          }
        }
      });
      return { ...prev, ...updated };
    });
  }, [topics, news]);

  // Top 3 latest news
  const top3News = useMemo(() => {
    return news.slice(0, 3);
  }, [news]);

  const handleRefresh = async () => {
    setIsLoading(true);
    const data = await fetchTrendsenseNews();
    setNews(data);
    setIsLoading(false);
  };

  const handleCheckTopic = (item: TrendsenseNewsItem) => {
    const matched = findMatchingTopics(item.title, topics);
    setCheckedResults(prev => ({
      ...prev,
      [item.id]: { checked: true, matched },
      [item.title]: { checked: true, matched },
    }));

    if (matched.length > 0) {
      onFilterMatchedTopics(item.title, matched);
    }
  };

  const getDepartmentColor = (dept: string) => {
    const lower = dept.toLowerCase();
    if (lower.includes('sức khỏe') || lower.includes('y tế')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (lower.includes('giải trí') || lower.includes('văn hóa')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (lower.includes('pháp luật') || lower.includes('điều tra')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (lower.includes('thế giới') || lower.includes('quốc tế')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (lower.includes('thể thao')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    if (lower.includes('công nghệ') || lower.includes('khoa học')) {
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <section 
      id="trendsense-news-box" 
      className="bg-white rounded-lg border border-gray-200/90 shadow-2xs p-3.5 h-full flex flex-col justify-between"
    >
      {/* Box Header */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            Tin mới - Trendsense
          </h2>
          <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
            Trực tiếp
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            title="Làm mới dữ liệu từ Trendsense"
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
          </button>

          <a
            href="#trendsense-home"
            onClick={(e) => {
              e.preventDefault();
              alert('Chuyển hướng đến trang chủ Trendsense');
            }}
            className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Xem thêm</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3 Latest News Items */}
      <div className="flex-1 flex flex-col justify-between gap-2.5">
        {isLoading && top3News.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400 space-y-2">
            <RefreshCw className="w-4 h-4 animate-spin mx-auto text-rose-500" />
            <p>Đang tải dữ liệu tin mới từ Trendsense...</p>
          </div>
        ) : (
          top3News.map((item, index) => {
            const checkState = checkedResults[item.id] || checkedResults[item.title];
            const isChecked = Boolean(checkState?.checked);
            const matchedList = checkState?.matched || [];
            const hasMatch = isChecked && matchedList.length > 0;
            const isFilterActiveForThis = activeTrendsenseFilterTitle === item.title;

            return (
              <div 
                key={item.id || index}
                id={`trendsense-news-item-${index}`}
                className={`p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                  isFilterActiveForThis
                    ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
                    : 'bg-gray-50/70 hover:bg-gray-50 border-gray-100/90 hover:border-gray-200'
                }`}
              >
                {/* Meta info: Ban + Thời gian xuất bản */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${getDepartmentColor(item.department)}`}>
                    {item.department}
                  </span>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {item.timeAgoText || formatTimeAgoVi(item.publishedAt)}
                  </span>
                </div>

                {/* Tiêu đề tin */}
                <h3 
                  className="font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 text-[12.5px]"
                  title={item.title}
                >
                  {item.title}
                </h3>

                {/* Action / Check Result row */}
                <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between gap-2 mt-auto">
                  {!isChecked ? (
                    /* Initial state: Text link "Check đề tài" */
                    <button
                      onClick={() => handleCheckTopic(item)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-blue-600" />
                      <span>Check đề tài</span>
                    </button>
                  ) : hasMatch ? (
                    /* Matched case: Show matched count and view in table */
                    <div className="flex items-center justify-between w-full gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        Trùng {matchedList.length} đề tài ở list
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isFilterActiveForThis ? (
                          <button
                            onClick={onClearTrendsenseFilter}
                            className="text-[11px] font-medium text-gray-600 hover:text-gray-900 underline cursor-pointer"
                          >
                            Bỏ lọc
                          </button>
                        ) : (
                          <button
                            onClick={() => onFilterMatchedTopics(item.title, matchedList)}
                            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                          >
                            Xem đề tài
                          </button>
                        )}
                        <button
                          onClick={() => handleCheckTopic(item)}
                          title="Kiểm tra lại"
                          className="text-[10px] text-gray-400 hover:text-gray-600"
                        >
                          (check lại)
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Not matched case: "Đề tài chưa được triển khai" & Button "Giao đề tài" */
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="text-[11px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        Đề tài chưa được triển khai
                      </span>

                      <button
                        onClick={() => onOpenCreateModalWithTrendsense(item)}
                        className="text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Giao đề tài</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Active filter notification if user is filtering by Trendsense match */}
      {activeTrendsenseFilterTitle && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
          <span className="truncate max-w-[220px]">
            Đang lọc: <strong className="text-gray-900">{activeTrendsenseFilterTitle}</strong>
          </span>
          <button
            onClick={onClearTrendsenseFilter}
            className="text-rose-600 hover:underline font-bold shrink-0 ml-2 cursor-pointer"
          >
            Xoá lọc
          </button>
        </div>
      )}
    </section>
  );
};
