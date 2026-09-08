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
  const [timeAgoText, setTimeAgoText] = useState<string>("Cập nhật 3' trước");

  // 2 Tabs: 'important' (Important News) & 'my_feed' (My Feed)
  const [activeTab, setActiveTab] = useState<'important' | 'my_feed'>('important');

  // My Feed modal & simulation state
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

  // Tách tin thành 2 danh sách theo 2 tab
  const importantNewsList = useMemo(() => {
    return news.filter(item => item.feedType === 'important');
  }, [news]);

  const myFeedNewsList = useMemo(() => {
    return news.filter(item => item.feedType === 'my_feed');
  }, [news]);

  // Danh sách tin hiển thị tương ứng với tab đang chọn
  const displayNews = useMemo(() => {
    const list = activeTab === 'important' ? importantNewsList : myFeedNewsList;
    return list.slice(0, 15);
  }, [activeTab, importantNewsList, myFeedNewsList]);

  // Trường hợp Trưởng ban chưa có cấu hình My Feed khi chuyển sang tab My Feed
  const showEmptyFeedForTruongBan = 
    userRole === 'Trưởng ban' && 
    activeTab === 'my_feed' && 
    !isTruongBanSimulatedFeed;

  return (
    <>
      <section 
        id="trendsense-news-box" 
        className="bg-white rounded-lg border border-gray-200/90 shadow-2xs p-3 h-full flex flex-col justify-between"
      >
        {/* Box Header: Title + Realtime Indicator + Last updated */}
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 whitespace-nowrap">
              Tin mới - Trendsense
            </h2>
            <span className="text-[11px] text-gray-500 font-normal flex items-center gap-1 pl-1">
              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{timeAgoText}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleRefresh}
              title="Làm mới dữ liệu từ Trendsense"
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2 TABS: Important News & My Feed */}
        <div className="flex items-center border-b border-gray-100 mb-2">
          <div className="flex items-center space-x-1">
            {/* Tab 1: Important News */}
            <button
              id="tab-trendsense-important"
              onClick={() => setActiveTab('important')}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                activeTab === 'important'
                  ? 'border-rose-600 text-rose-700 bg-rose-50/60'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activeTab === 'important' ? 'text-rose-600 fill-rose-600/20' : 'text-gray-400'}`} />
              <span>Important News</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'important' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {importantNewsList.length}
              </span>
            </button>

            {/* Tab 2: My Feed */}
            <button
              id="tab-trendsense-myfeed"
              onClick={() => setActiveTab('my_feed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
                activeTab === 'my_feed'
                  ? 'border-rose-600 text-rose-700 bg-rose-50/60'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Rss className={`w-3.5 h-3.5 ${activeTab === 'my_feed' ? 'text-rose-600' : 'text-gray-400'}`} />
              <span>My Feed</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'my_feed' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {myFeedNewsList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {showEmptyFeedForTruongBan ? (
          /* Trạng thái chưa cấu hình My Feed cho Trưởng ban trong tab My Feed */
          <div 
            id="trendsense-truongban-empty-state"
            className="flex-1 flex flex-col items-center justify-center text-center p-3 my-auto bg-gray-50/70 border border-dashed border-gray-200 rounded-xl min-h-[160px]"
          >
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-1.5 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <p className="text-xs text-gray-800 font-medium max-w-xs leading-relaxed mb-2 text-center">
              Chưa có tin từ Trendsense phù hợp với bạn. Hãy tạo My Feed của mình để được gợi ý các tin phù hợp
            </p>

            <div className="flex flex-col items-center justify-center gap-1.5 w-full">
              <button
                id="btn-create-my-feed-truong-ban"
                onClick={handleOpenMyFeed}
                className="px-5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Tạo My Feed</span>
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
          /* Danh sách tin tức: Mặc định mỗi tin hiển thị button "Giao đề tài" */
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[175px] pr-1 scrollbar-thin">
              {isLoading && displayNews.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-rose-500" />
                  <p>Đang tải tin từ Trendsense...</p>
                </div>
              ) : displayNews.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  Chưa có tin tức nào trong mục này.
                </div>
              ) : (
                displayNews.map((item, index) => {
                  return (
                    <div 
                      key={item.id || index}
                      id={`trendsense-news-item-${index}`}
                      className="p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all text-xs flex flex-col justify-between shrink-0 shadow-2xs group"
                    >
                      {/* Tiêu đề tin */}
                      <h3 
                        className="font-semibold text-gray-900 leading-snug line-clamp-2 mb-1 text-[12px]"
                        title={item.title}
                      >
                        {item.title}
                      </h3>

                      {/* Thời gian sau tiêu đề tin */}
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2 font-normal">
                        <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{item.timeAgoText || formatTimeAgoVi(item.publishedAt)}</span>
                      </div>

                      {/* Action row: Tên chuyên mục thay thế "Tin tiêu điểm" + Button "Giao đề tài" bỏ nền đỏ */}
                      <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between gap-2 mt-auto">
                        <span className={`px-1.5 py-0.5 text-[10.5px] font-semibold rounded border ${getDepartmentColor(item.department)}`}>
                          {item.department}
                        </span>

                        <button
                          id={`btn-assign-trendsense-${index}`}
                          onClick={() => onOpenCreateModalWithTrendsense(item)}
                          className="text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 active:scale-[0.98] px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <PlusCircle className="w-3.5 h-3.5 stroke-[2.2] text-gray-500" />
                          <span>Giao đề tài</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Text link "Xem thêm" at bottom of the news list */}
              {!isLoading && displayNews.length > 0 && (
                <div className="pt-1 text-center border-t border-gray-100 mt-0.5">
                  <a
                    href="#trendsense-home"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenMyFeed();
                    }}
                    className="inline-flex items-center justify-center gap-1 text-[11.5px] font-semibold text-rose-700 hover:text-rose-800 hover:underline py-0.5 px-2 transition-colors cursor-pointer"
                  >
                    <span>Xem thêm trên Trendsense</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* Trưởng ban demo mode reset */}
            {userRole === 'Trưởng ban' && isTruongBanSimulatedFeed && activeTab === 'my_feed' && (
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
