import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  ExternalLink, 
  PlusCircle, 
  RefreshCw, 
  Rss, 
  Flame,
  X,
  Check
} from 'lucide-react';
import { TrendsenseNewsItem, Topic, UserRole } from '../types';
import { fetchTrendsenseNews, formatTimeAgoVi } from '../data/trendsenseService';

interface TrendsenseNewsBoxProps {
  topics?: Topic[];
  onOpenCreateModalWithTrendsense: (newsItem: TrendsenseNewsItem) => void;
  onFilterMatchedTopics?: (newsTitle: string, matchedTopics: Topic[]) => void;
  activeTrendsenseFilterTitle?: string | null;
  onClearTrendsenseFilter?: () => void;
  userRole?: UserRole | string;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const TrendsenseNewsBox: React.FC<TrendsenseNewsBoxProps> = ({
  onOpenCreateModalWithTrendsense,
  userRole = 'Ban biên tập',
  onShowToast,
}) => {
  const [news, setNews] = useState<TrendsenseNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date(Date.now() - 3 * 60 * 1000));
  const [timeAgoText, setTimeAgoText] = useState<string>("3' trước");

  // 2 Tabs: 'important' (Important News) & 'my_feed' (My Feed)
  const [activeTab, setActiveTab] = useState<'important' | 'my_feed'>('important');

  // My Feed modal & simulation state
  const [isMyFeedModalOpen, setIsMyFeedModalOpen] = useState<boolean>(false);
  const [isTruongBanSimulatedFeed, setIsTruongBanSimulatedFeed] = useState<boolean>(false);

  // Helper to format time ago for last updated
  const getFormattedUpdatedTime = (date: Date): string => {
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 45) return 'Vừa xong';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}' trước`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours}h trước`;
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

  // Fetch news from Google Sheets / Fallback
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

  const handleRefresh = async () => {
    setIsLoading(true);
    const data = await fetchTrendsenseNews();
    setNews(data);
    setLastUpdated(new Date());
    setIsLoading(false);
    onShowToast?.('Đã cập nhật dữ liệu tin mới từ Trendsense', 'info');
  };

  const handleOpenMyFeed = () => {
    setIsMyFeedModalOpen(true);
    onShowToast?.('Mở cấu hình My Feed Trendsense...', 'info');
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

  // Tách tin thành 2 danh sách theo 2 tab
  // Trường hợp cấp Trưởng ban: không có dữ liệu tab Important News
  const isTruongBan = userRole === 'Trưởng ban';

  const importantNewsList = useMemo(() => {
    if (isTruongBan) {
      return []; // Cấp Trưởng ban: không có dữ liệu Important News
    }
    return news.filter(item => item.feedType === 'important');
  }, [news, isTruongBan]);

  const myFeedNewsList = useMemo(() => {
    return news.filter(item => item.feedType === 'my_feed');
  }, [news]);

  // Chỉ hiển thị tab Important News nếu có dữ liệu
  const showImportantTab = importantNewsList.length > 0;

  // Nếu không có tab Important News -> tự động chọn tab My Feed
  useEffect(() => {
    if (!showImportantTab && activeTab === 'important') {
      setActiveTab('my_feed');
    }
  }, [showImportantTab, activeTab]);

  // Danh sách tin hiển thị (cho phép scroll toàn bộ danh sách trong box)
  const displayNews = useMemo(() => {
    const list = (showImportantTab && activeTab === 'important') ? importantNewsList : myFeedNewsList;
    return list;
  }, [activeTab, showImportantTab, importantNewsList, myFeedNewsList]);

  // Trường hợp Trưởng ban chưa có cấu hình My Feed khi ở tab My Feed
  const showEmptyFeedForTruongBan = 
    isTruongBan && 
    activeTab === 'my_feed' && 
    !isTruongBanSimulatedFeed;

  return (
    <>
      <section 
        id="trendsense-news-box" 
        className="bg-white rounded-lg border border-gray-200/90 shadow-2xs px-3 py-2 sm:px-3 sm:py-2.5 h-full flex flex-col justify-between transition-all"
      >
        {/* Box Header: Title + Tools ở hàng trên, Tabs "Important News" & "My Feed" ở hàng dưới */}
        <div className="pb-1.5 mb-2 border-b border-gray-100">
          {/* Hàng 1: Tiêu đề không bị cắt + Nhóm công cụ */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                Tin mới - Trendsense
              </h2>
            </div>

            {/* Right toolset: Time ago + Refresh + Xem thêm */}
            <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 shrink-0">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Clock className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                <span>{timeAgoText}</span>
              </span>

              <button
                onClick={handleRefresh}
                title="Làm mới dữ liệu từ Trendsense"
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
              </button>

              <a
                href="#trendsense-home"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenMyFeed();
                }}
                className="text-[10.5px] font-semibold text-rose-700 hover:text-rose-800 hover:underline inline-flex items-center gap-0.5 shrink-0"
              >
                <span>Xem thêm</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Hàng 2: Tabs chuyển xuống dưới title */}
          <div className="flex items-center bg-gray-100/90 p-0.5 rounded-lg border border-gray-200/60 w-fit">
            {/* Tab 1: Important News - Ẩn khi không có dữ liệu */}
            {showImportantTab && (
              <button
                id="tab-trendsense-important"
                onClick={() => setActiveTab('important')}
                className={`px-2 py-0.5 text-[10.5px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'important'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Flame className={`w-2.5 h-2.5 ${activeTab === 'important' ? 'text-rose-600 fill-rose-600/20' : 'text-gray-400'}`} />
                <span>Important News</span>
                {importantNewsList.length > 0 && (
                  <span className={`text-[9px] px-1 py-0.1 rounded-full font-bold leading-tight ${
                    activeTab === 'important' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {importantNewsList.length}
                  </span>
                )}
              </button>
            )}

            {/* Tab 2: My Feed */}
            <button
              id="tab-trendsense-myfeed"
              onClick={() => setActiveTab('my_feed')}
              className={`px-2 py-0.5 text-[10.5px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'my_feed'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Rss className={`w-2.5 h-2.5 ${activeTab === 'my_feed' ? 'text-rose-600' : 'text-gray-400'}`} />
              <span>My Feed</span>
              {myFeedNewsList.length > 0 && !showEmptyFeedForTruongBan && (
                <span className={`text-[9px] px-1 py-0.1 rounded-full font-bold leading-tight ${
                  activeTab === 'my_feed' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {myFeedNewsList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {showEmptyFeedForTruongBan ? (
          /* Trạng thái chưa cấu hình My Feed cho Trưởng ban - Banner nhỏ gọn */
          <div 
            id="trendsense-truongban-empty-state"
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-rose-50/40 border border-dashed border-rose-200 rounded-lg text-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="text-gray-800 font-medium text-[11px]">
                Chưa có tin Trendsense phù hợp. Tạo My Feed để nhận gợi ý chuyên sâu.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-create-my-feed-truong-ban"
                onClick={handleOpenMyFeed}
                className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-2xs inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Tạo My Feed</span>
              </button>

              <button
                onClick={() => setIsTruongBanSimulatedFeed(true)}
                className="text-[10px] text-gray-500 hover:text-gray-800 underline py-0.5 px-1 cursor-pointer"
                title="Bấm để xem demo luồng tin sau khi Trưởng ban đã tạo My Feed"
              >
                (Demo)
              </button>
            </div>
          </div>
        ) : (
          /* Danh sách tin tức: Khung cuộn dọc nội bộ (Internal scrollable list) */
          <div className="flex-1 min-h-0 flex flex-col">
            <div 
              id="trendsense-scrollable-news-list"
              className="overflow-y-auto max-h-[105px] space-y-1.5 pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
              {isLoading && displayNews.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                  <span>Đang tải tin từ Trendsense...</span>
                </div>
              ) : displayNews.length === 0 ? (
                <div className="py-3 text-center text-xs text-gray-500">
                  Chưa có tin tức nào trong mục này.
                </div>
              ) : (
                displayNews.map((item, index) => {
                  return (
                    <div 
                      key={item.id || index}
                      id={`trendsense-news-item-${index}`}
                      className="p-1.5 px-2 rounded-lg border border-gray-200/70 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all text-xs flex items-center justify-between gap-2 shadow-2xs group"
                    >
                      {/* Tiêu đề tin & metadata */}
                      <div className="min-w-0 flex-1">
                        <h3 
                          className="font-semibold text-gray-900 leading-snug truncate text-[11px] group-hover:text-rose-900"
                          title={item.title}
                        >
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px]">
                          <span className="text-gray-400 font-normal">
                            {item.timeAgoText || formatTimeAgoVi(item.publishedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Nút giao đề tài */}
                      <button
                        id={`btn-assign-trendsense-${index}`}
                        onClick={() => onOpenCreateModalWithTrendsense(item)}
                        title="Giao đề tài từ tin này"
                        className="text-[10px] font-semibold text-gray-700 hover:text-rose-700 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200 px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <PlusCircle className="w-3 h-3 stroke-[2.2] text-rose-600" />
                        <span>Giao đề tài</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Trưởng ban demo mode reset */}
            {userRole === 'Trưởng ban' && isTruongBanSimulatedFeed && activeTab === 'my_feed' && (
              <div className="mt-1 pt-0.5 text-right">
                <button
                  onClick={() => setIsTruongBanSimulatedFeed(false)}
                  className="text-[9.5px] text-gray-400 hover:text-rose-700 underline cursor-pointer"
                >
                  (Quay lại trạng thái Chưa có My Feed)
                </button>
              </div>
            )}
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
