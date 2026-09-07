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
  ArrowUpRight, 
  X, 
  Rss, 
  Check 
} from 'lucide-react';
import { TrendsenseNewsItem, Topic, UserRole } from '../types';
import { fetchTrendsenseNews, findMatchingTopics, formatTimeAgoVi } from '../data/trendsenseService';

interface TrendsenseNewsBoxProps {
  topics: Topic[];
  onOpenCreateModalWithTrendsense: (newsItem: TrendsenseNewsItem) => void;
  onFilterMatchedTopics: (newsTitle: string, matchedTopics: Topic[]) => void;
  activeTrendsenseFilterTitle: string | null;
  onClearTrendsenseFilter: () => void;
  userRole?: UserRole;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const TrendsenseNewsBox: React.FC<TrendsenseNewsBoxProps> = ({
  topics,
  onOpenCreateModalWithTrendsense,
  onFilterMatchedTopics,
  activeTrendsenseFilterTitle,
  onClearTrendsenseFilter,
  userRole = 'Ban biên tập',
  onShowToast,
}) => {
  const [news, setNews] = useState<TrendsenseNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date(Date.now() - 3 * 60 * 1000));
  const [timeAgoText, setTimeAgoText] = useState<string>("Cập nhật 3' trước");
  // Store checking state per news item: key is news.id or title -> { checked: boolean, matchedTopics: Topic[] }
  const [checkedResults, setCheckedResults] = useState<Record<string, { checked: boolean; matched: Topic[] }>>({});
  
  // My Feed modal & simulation state for Trưởng ban demo
  const [isMyFeedModalOpen, setIsMyFeedModalOpen] = useState<boolean>(false);
  const [isTruongBanSimulatedFeed, setIsTruongBanSimulatedFeed] = useState<boolean>(false);

  // Helper to format time ago for last updated
  const getFormattedUpdatedTime = (date: Date): string => {
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 45) return 'Cập nhật vừa xong';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Cập nhật ${diffMin}' trước`;
    const diffHours = Math.floor(diffMin / 60);
    return `Cập nhật ${diffHours}h trước`;
  };

  // Keep timeAgoText updated
  useEffect(() => {
    const updateText = () => {
      setTimeAgoText(getFormattedUpdatedTime(lastUpdated));
    };
    updateText();
    const interval = setInterval(updateText, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

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

  // Reset Trưởng ban feed simulation when switching away from Trưởng ban
  useEffect(() => {
    if (userRole !== 'Trưởng ban') {
      setIsTruongBanSimulatedFeed(false);
    }
  }, [userRole]);

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

  // 15 latest news items for scrollable box
  const displayNews = useMemo(() => {
    return news.slice(0, 15);
  }, [news]);

  const handleRefresh = async () => {
    setIsLoading(true);
    const data = await fetchTrendsenseNews();
    setNews(data);
    setLastUpdated(new Date());
    setIsLoading(false);
    onShowToast?.('Đã cập nhật dữ liệu tin mới từ Trendsense', 'info');
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

  const handleOpenMyFeed = () => {
    setIsMyFeedModalOpen(true);
    onShowToast?.('Chuyển hướng sang trang chủ Trendsense để cấu hình My Feed...', 'info');
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

  // Check empty state condition for Trưởng ban demo
  const showEmptyFeedForTruongBan = userRole === 'Trưởng ban' && !isTruongBanSimulatedFeed;

  return (
    <>
      <section 
        id="trendsense-news-box" 
        className="bg-white rounded-lg border border-gray-200/90 shadow-2xs p-3 h-full flex flex-col justify-between"
      >
        {/* Box Header */}
        <div className="flex items-start justify-between gap-2 pb-1.5 mb-2 border-b border-gray-100">
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 whitespace-nowrap">
                Tin mới - Trendsense
              </h2>
              {!showEmptyFeedForTruongBan && displayNews.length > 0 && (
                <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                  {displayNews.length} tin
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-500 font-normal mt-0.5 flex items-center gap-1 pl-4 whitespace-nowrap">
              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{timeAgoText}</span>
            </div>
          </div>

          {/* Header Actions: Text link "Tạo my Feed" + Refresh icon button */}
          <div className="flex items-center space-x-2 pt-0.5 shrink-0">
            <button
              id="btn-create-my-feed"
              onClick={handleOpenMyFeed}
              className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap py-0.5"
              title="Bấm để sang trang Trendsense tạo luồng tin My Feed cá nhân hoá"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="whitespace-nowrap">Tạo my Feed</span>
            </button>

            <button
              onClick={handleRefresh}
              title="Làm mới dữ liệu từ Trendsense"
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* DEMO CASE 1: TRƯỞNG BAN - CHƯA CÓ TIN PHÙ HỢP */}
        {showEmptyFeedForTruongBan ? (
          <div 
            id="trendsense-truongban-empty-state"
            className="flex-1 flex flex-col items-center justify-center text-center p-3 my-auto bg-gray-50/70 border border-dashed border-gray-200 rounded-xl min-h-[158px]"
          >
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-1.5 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <p className="text-xs text-gray-800 font-medium max-w-xs leading-relaxed mb-2.5 text-center">
              Chưa có tin từ Trendsense phù hợp với bạn. Hãy tạo My Feed của mình để được gợi ý các tin phù hợp
            </p>

            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
              <button
                id="btn-create-my-feed-truong-ban"
                onClick={handleOpenMyFeed}
                className="px-5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Tạo my Feed</span>
              </button>

              <button
                onClick={() => setIsTruongBanSimulatedFeed(true)}
                className="text-[10.5px] text-gray-500 hover:text-gray-800 underline underline-offset-2 py-0.5 px-2 cursor-pointer whitespace-nowrap text-center"
                title="Bấm để xem demo luồng tin sau khi Trưởng ban đã tạo My Feed"
              >
                (Demo: xem tin sau khi tạo My Feed)
              </button>
            </div>
          </div>
        ) : (
          /* DEMO CASE 2 & 3: BAN BIÊN TẬP / PHÓNG VIÊN / TRƯỞNG BAN ĐÃ CÓ FEED (15 TIN CÓ SCROLL TRONG BOX, SHOW MẶC ĐỊNH 2 TIN) */
          <div className="flex-1 flex flex-col justify-between">
            {/* Scrollable News Items (Show default 2 items, scroll up to 15 items) */}
            <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[160px] pr-1.5 scrollbar-thin">
              {isLoading && displayNews.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-rose-500" />
                  <p>Đang tải 15 tin mới nhất từ Trendsense...</p>
                </div>
              ) : (
                displayNews.map((item, index) => {
                  const checkState = checkedResults[item.id] || checkedResults[item.title];
                  const isChecked = Boolean(checkState?.checked);
                  const matchedList = checkState?.matched || [];
                  const hasMatch = isChecked && matchedList.length > 0;
                  const isFilterActiveForThis = activeTrendsenseFilterTitle === item.title;

                  return (
                    <div 
                      key={item.id || index}
                      id={`trendsense-news-item-${index}`}
                      className={`p-2 rounded-lg border transition-all text-xs flex flex-col justify-between shrink-0 ${
                        isFilterActiveForThis
                          ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
                          : 'bg-gray-50/70 hover:bg-gray-50 border-gray-100/90 hover:border-gray-200'
                      }`}
                    >
                      {/* Meta info: Ban + Thời gian xuất bản */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`px-1.5 py-0.2 text-[10.5px] font-semibold rounded border ${getDepartmentColor(item.department)}`}>
                          {item.department}
                        </span>
                        <span className="text-[10.5px] text-gray-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {item.timeAgoText || formatTimeAgoVi(item.publishedAt)}
                        </span>
                      </div>

                      {/* Tiêu đề tin */}
                      <h3 
                        className="font-semibold text-gray-900 leading-snug line-clamp-1 mb-1 text-[12px]"
                        title={item.title}
                      >
                        {item.title}
                      </h3>

                      {/* Action / Check Result row */}
                      <div className="pt-1 border-t border-gray-200/60 flex items-center justify-between gap-2 mt-auto">
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
                            <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              Trùng {matchedList.length} đề tài ở list
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isFilterActiveForThis ? (
                                <button
                                  onClick={onClearTrendsenseFilter}
                                  className="text-[10.5px] font-medium text-gray-600 hover:text-gray-900 underline cursor-pointer"
                                >
                                  Bỏ lọc
                                </button>
                              ) : (
                                <button
                                  onClick={() => onFilterMatchedTopics(item.title, matchedList)}
                                  className="text-[10.5px] font-semibold text-blue-700 hover:text-blue-900 underline cursor-pointer"
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
                            <span className="text-[10.5px] font-medium text-amber-800 bg-amber-50/80 border border-amber-200/80 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                              Đề tài chưa được triển khai
                            </span>

                            <button
                              onClick={() => onOpenCreateModalWithTrendsense(item)}
                              className="text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
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

              {/* Text link "Xem thêm" at bottom of the news list after scrolling */}
              {!isLoading && displayNews.length > 0 && (
                <div className="pt-1.5 pb-1 text-center border-t border-gray-100/80 mt-1">
                  <a
                    href="#trendsense-home"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenMyFeed();
                    }}
                    className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline py-0.5 px-3 transition-colors cursor-pointer"
                  >
                    <span>Xem thêm trên Trendsense</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* If Trưởng ban is previewing simulated feed, provide button to return to empty state */}
            {userRole === 'Trưởng ban' && isTruongBanSimulatedFeed && (
              <div className="mt-1 pt-1 text-center border-t border-gray-100">
                <button
                  onClick={() => setIsTruongBanSimulatedFeed(false)}
                  className="text-[10.5px] text-gray-500 hover:text-rose-700 underline cursor-pointer"
                >
                  (Quay lại trạng thái Chưa có My Feed)
                </button>
              </div>
            )}
          </div>
        )}

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

      {/* ================= TRENDSENSE MY FEED MODAL ================= */}
      {isMyFeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Tạo My Feed trên Trendsense</h3>
                  <p className="text-[11px] text-gray-500">Liên kết cấu hình nguồn tin cá nhân hoá</p>
                </div>
              </div>
              <button
                onClick={() => setIsMyFeedModalOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3.5 text-xs text-gray-600 leading-relaxed">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
                <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <Rss className="w-3.5 h-3.5 text-rose-600" />
                  <span>My Feed là gì?</span>
                </div>
                <p>
                  Tính năng <strong>My Feed</strong> giúp bạn thiết lập luồng tin tức nóng, cảnh báo xu hướng mạng xã hội và báo chí phù hợp theo lĩnh vực phụ trách của ban hoặc cá nhân.
                </p>
              </div>

              <div className="space-y-1.5 text-[11.5px]">
                <p className="font-semibold text-gray-800">Các bước thiết lập trên Trendsense:</p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>Chọn chuyên mục phụ trách (Thời sự, Kinh tế, Pháp luật, Thể thao...).</li>
                  <li>Nhập các từ khoá trọng điểm cần theo dõi sát sao.</li>
                  <li>Lưu cấu hình để nhận thông báo và đề xuất tự động về hệ thống Newsroom.</li>
                </ul>
              </div>

              {userRole === 'Trưởng ban' && !isTruongBanSimulatedFeed && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <span className="font-bold shrink-0">Demo:</span>
                  <span>Bạn đang ở cấp <strong>Trưởng ban</strong>. Sau khi hoàn tất tạo My Feed trên Trendsense, box này sẽ tự động nạp các tin phù hợp.</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsMyFeedModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              
              {userRole === 'Trưởng ban' && !isTruongBanSimulatedFeed && (
                <button
                  onClick={() => {
                    setIsTruongBanSimulatedFeed(true);
                    setIsMyFeedModalOpen(false);
                    onShowToast?.('Đã mô phỏng tạo My Feed thành công cho Trưởng ban', 'success');
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mô phỏng đã tạo xong</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMyFeedModalOpen(false);
                  onShowToast?.('Đã mở trang Trendsense để cấu hình My Feed', 'info');
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Sang Trendsense tạo My Feed</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
