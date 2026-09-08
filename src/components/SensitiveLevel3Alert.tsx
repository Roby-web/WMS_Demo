import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Filter, 
  X, 
  Send, 
  Check, 
  Sparkles, 
  UserCheck, 
  FileText,
  User,
  Building,
  Info,
  Sliders,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Topic, UserRole, SensitivityLevel } from '../types';

export interface SensitiveLevel3AlertProps {
  topics: Topic[];
  userRole?: UserRole | string;
  onSelectTopic: (topic: Topic) => void;
  onFilterLevel3?: (active: boolean) => void;
  isFilteringLevel3?: boolean;
  onFilterLevel2?: (active: boolean) => void;
  isFilteringLevel2?: boolean;
  onDepartmentHeadApprove?: (topicId: string, keepLevel3: boolean, note?: string) => void;
  onEditorialDirective?: (topicId: string, directive: string) => void;
  onChangeSensitivityLevel?: (topicId: string, newLevel: SensitivityLevel | 0, reason?: string) => void;
  onQuickSwitchRole?: (role: UserRole) => void;
  onQuickCreateSampleTopic?: (level: 1 | 2 | 3) => void;
  onOpenCreateModal?: () => void;
}

export const SensitiveLevel3Alert: React.FC<SensitiveLevel3AlertProps> = ({
  topics,
  userRole = 'Ban biên tập',
  onSelectTopic,
  onFilterLevel3,
  isFilteringLevel3 = false,
  onFilterLevel2,
  isFilteringLevel2 = false,
  onDepartmentHeadApprove,
  onEditorialDirective,
  onChangeSensitivityLevel,
  onQuickSwitchRole,
  onQuickCreateSampleTopic,
  onOpenCreateModal,
}) => {
  const [showDemoGuide, setShowDemoGuide] = useState(true);
  const [showDirectiveInputForId, setShowDirectiveInputForId] = useState<string | null>(null);
  const [directiveText, setDirectiveText] = useState('');

  // State đổi mức nhạy cảm cho Ban biên tập
  const [editingLevelTopicId, setEditingLevelTopicId] = useState<string | null>(null);
  const [selectedNewLevel, setSelectedNewLevel] = useState<SensitivityLevel | 0>(2);
  const [levelChangeReason, setLevelChangeReason] = useState<string>('');

  // 1. Phân loại đề tài theo Mức & Trạng thái duyệt
  // Mức 1: Chỉ hiển thị nhận diện ở list
  const level1Topics = topics.filter(t => t.isSensitive && t.sensitivityLevel === 1);

  // Mức 2: Trưởng ban nhận thông báo đầu trang (do phóng viên đề xuất)
  const level2Topics = topics.filter(t => t.isSensitive && t.sensitivityLevel === 2);

  // Mức 3 do Phóng viên đề xuất và chưa qua Trưởng ban duyệt: Trưởng ban nhận thông báo
  const level3PendingTopics = topics.filter(
    t => t.isSensitive && t.sensitivityLevel === 3 && !t.isDepartmentHeadApproved
  );

  // Mức 3 đã được Trưởng ban thẩm duyệt (hoặc đề tài Mức 3 sẵn sàng cho BBT)
  const level3ForEditorialTopics = topics.filter(
    t => t.isSensitive && t.sensitivityLevel === 3 && t.isDepartmentHeadApproved
  );

  // Tổng số đề tài Mức 3 trong hệ thống
  const allLevel3Topics = topics.filter(t => t.isSensitive && t.sensitivityLevel === 3);

  const handleSendDirective = (topicId: string) => {
    if (!directiveText.trim()) return;
    onEditorialDirective?.(topicId, directiveText.trim());
    setShowDirectiveInputForId(null);
    setDirectiveText('');
  };

  const handleSaveLevelChange = (topicId: string) => {
    onChangeSensitivityLevel?.(topicId, selectedNewLevel, levelChangeReason.trim());
    setEditingLevelTopicId(null);
    setLevelChangeReason('');
  };

  return (
    <div id="sensitive-topics-flow-container" className="space-y-2.5">
      {/* ================= 1. THANH ĐIỀU HƯỚNG QUY TRÌNH 3 CẤP ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden transition-all">
        <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm tracking-wide">
                QUY TRÌNH DUYỆT ĐỀ TÀI NHẠY CẢM THEO 3 CẤP
              </span>
              <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 border border-slate-600 font-medium">
                Đang ở menu cấp: <strong className="text-amber-300 font-bold">{userRole}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDemoGuide(!showDemoGuide)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
            >
              <span>{showDemoGuide ? 'Thu gọn luồng' : 'Xem chi tiết luồng'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${showDemoGuide ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Step Interactive Stepper Bar */}
        {showDemoGuide && (
          <div className="p-3 bg-slate-50/80 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {/* Cấp 1: Phóng viên */}
              <button
                type="button"
                onClick={() => onQuickSwitchRole?.('Phóng viên')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  userRole === 'Phóng viên'
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                      Cấp 1: Phóng viên
                    </span>
                    {userRole === 'Phóng viên' && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Đang chọn
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs mt-1">Đề xuất đề tài</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Phóng viên tạo đề tài và tích chọn mức nhạy cảm (Mức 1, 2, 3).
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-blue-100 flex items-center justify-between text-[10.5px] text-blue-700 font-semibold">
                  <span>Mức 1 (List) • Mức 2 & 3 (Gửi TB)</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Cấp 2: Trưởng ban */}
              <button
                type="button"
                onClick={() => onQuickSwitchRole?.('Trưởng ban')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  userRole === 'Trưởng ban'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/40 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      Cấp 2: Trưởng ban
                    </span>
                    {userRole === 'Trưởng ban' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Đang chọn
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs mt-1">Thông báo Mức 2, 3 & Duyệt Mức 3</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Nhận thông báo đề tài Mức 2 & 3 do PV đề xuất. Thẩm duyệt đề tài Mức 3 trước khi chuyển lên BBT.
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-amber-100 flex items-center justify-between text-[10.5px] text-amber-800 font-semibold">
                  <span>
                    Chờ duyệt M3: <strong className="text-rose-700 font-bold">{level3PendingTopics.length}</strong> • M2: <strong>{level2Topics.length}</strong>
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Cấp 3: Ban biên tập */}
              <button
                type="button"
                onClick={() => onQuickSwitchRole?.('Ban biên tập')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  userRole === 'Ban biên tập'
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-rose-300 hover:bg-rose-50/40 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200">
                      Cấp 3: Ban biên tập
                    </span>
                    {userRole === 'Ban biên tập' && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Đang chọn
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs mt-1">Thông báo Mức 3 & Đổi mức nhạy cảm</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    Nhận thông báo đề tài Mức 3 đã qua Trưởng ban duyệt. Chỉ đạo định hướng hoặc trực tiếp thay đổi mức nhạy cảm.
                  </p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-rose-100 flex items-center justify-between text-[10.5px] text-rose-800 font-semibold">
                  <span>
                    Đề tài Mức 3: <strong className="font-bold">{level3ForEditorialTopics.length}</strong> (Tổng M3: {allLevel3Topics.length})
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. HIỂN THỊ CHI TIẾT THEO CẤP ĐƯỢC CHỌN Ở MENU ================= */}

      {/* ------------------------------------------------------------- */}
      {/* VAI TRÒ 1: PHÓNG VIÊN                                         */}
      {/* ------------------------------------------------------------- */}
      {userRole === 'Phóng viên' && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-3 shadow-2xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-200 text-blue-950">
                    Cấp 1: Phóng viên đề xuất đề tài
                  </span>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">
                    Khởi tạo đề tài và tích chọn mức độ nhạy cảm
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-0.5">
                  Phóng viên đề xuất đề tài: Mức 1 (nhận diện tại list), Mức 2 (báo Trưởng ban), Mức 3 (Trưởng ban duyệt trước khi trình BBT).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenCreateModal && (
                <button
                  type="button"
                  onClick={onOpenCreateModal}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo đề tài mới</span>
                </button>
              )}
            </div>
          </div>

          {/* Hộp test nhanh 3 mức cho Phóng viên */}
          <div className="bg-white p-2.5 rounded-lg border border-blue-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-900 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Thử nghiệm nhanh: Tạo đề tài mẫu các mức:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onQuickCreateSampleTopic?.(1)}
                className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md transition-colors cursor-pointer"
                title="Tạo đề tài Mức 1: Chỉ nhận diện ở list"
              >
                + Test Mức 1 (Ở List)
              </button>
              <button
                type="button"
                onClick={() => onQuickCreateSampleTopic?.(2)}
                className="px-2.5 py-1 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-300 rounded-md transition-colors cursor-pointer"
                title="Tạo đề tài Mức 2: Báo Trưởng ban trên đầu trang"
              >
                + Test Mức 2 (Gửi Trưởng ban)
              </button>
              <button
                type="button"
                onClick={() => onQuickCreateSampleTopic?.(3)}
                className="px-2.5 py-1 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-md transition-colors cursor-pointer"
                title="Tạo đề tài Mức 3: Trưởng ban duyệt trước khi trình BBT"
              >
                + Test Mức 3 (Cần Trưởng ban duyệt)
              </button>
            </div>
          </div>

          {/* Hướng dẫn chuyển cấp tiếp theo */}
          <div className="bg-blue-100/70 border border-blue-300/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-blue-950">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                👉 <strong>Bước tiếp theo:</strong> Sau khi tạo đề tài Mức 2 hoặc 3, hãy chuyển sang cấp <strong>"Trưởng ban"</strong> ở menu phía trên để xem thông báo và thực hiện duyệt.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onQuickSwitchRole?.('Trưởng ban')}
              className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 font-bold rounded-md shrink-0 ml-2 cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Sang cấp Trưởng ban</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VAI TRÒ 2: TRƯỞNG BAN                                         */}
      {/* ------------------------------------------------------------- */}
      {userRole === 'Trưởng ban' && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* 1. KHỐI THÔNG BÁO ĐỀ TÀI MỨC 3 CHỜ TRƯỞNG BAN DUYỆT */}
          {level3PendingTopics.length > 0 ? (
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-3.5 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-rose-700 px-2 py-0.5 rounded shadow-2xs">
                        Thông báo Trưởng ban • Cần duyệt Mức 3
                      </span>
                      <span className="font-extrabold text-rose-950 text-xs sm:text-sm">
                        Có {level3PendingTopics.length} đề tài nhạy cảm Mức 3 do Phóng viên đề xuất đang chờ Trưởng ban thẩm duyệt
                      </span>
                    </div>

                    {onFilterLevel3 && (
                      <button
                        type="button"
                        onClick={() => onFilterLevel3(!isFilteringLevel3)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isFilteringLevel3 
                            ? 'bg-rose-700 text-white border-rose-800' 
                            : 'bg-white text-rose-900 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        <Filter className="w-3 h-3" />
                        <span>{isFilteringLevel3 ? 'Hủy lọc' : `Lọc xem bảng (${level3PendingTopics.length})`}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 text-xs leading-relaxed">
                    Theo quy chế luồng 3 cấp: Đề tài nhạy cảm Mức 3 do phóng viên đề xuất bắt buộc phải được <strong>Trưởng ban chuyên môn duyệt trước</strong>. Nếu Trưởng ban duyệt giữ nguyên Mức 3 thì cấp <strong>Ban biên tập mới nhận được thông báo</strong> trên đầu trang.
                  </p>

                  {/* Danh sách đề tài Mức 3 cần duyệt */}
                  <div className="space-y-2 mt-2">
                    {level3PendingTopics.map((topic) => (
                      <div 
                        key={topic.id}
                        className="bg-white p-3 rounded-lg border border-rose-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 border border-rose-300">
                              Mức 3: Đặc biệt
                            </span>
                            <span 
                              onClick={() => onSelectTopic(topic)}
                              className="font-bold text-gray-900 text-xs sm:text-sm hover:text-rose-700 cursor-pointer line-clamp-1"
                            >
                              {topic.title}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mt-1">
                            <span>Phóng viên đề xuất: <strong className="text-gray-700">{topic.author}</strong></span>
                            <span>Ban: <strong className="text-gray-700">{topic.department}</strong></span>
                            <span className="text-rose-700">Lĩnh vực: {topic.sensitivityCategory || 'Chung'}</span>
                          </div>
                        </div>

                        {/* Các nút duyệt của Trưởng ban */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onSelectTopic(topic)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                          >
                            Chi tiết
                          </button>

                          {onDepartmentHeadApprove && (
                            <>
                              <button
                                type="button"
                                onClick={() => onDepartmentHeadApprove(topic.id, false, 'Trưởng ban đã duyệt và hạ xuống Mức 2 để xử lý tại Ban.')}
                                className="px-2.5 py-1.5 text-xs font-semibold text-orange-800 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded-md transition-colors cursor-pointer"
                                title="Duyệt và hạ xuống Mức 2 (xử lý nội bộ ban, không trình BBT)"
                              >
                                Duyệt hạ Mức 2
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => onDepartmentHeadApprove(topic.id, true, 'Trưởng ban đã thẩm định hồ sơ, duyệt giữ nguyên Mức 3 và kính trình Ban biên tập chỉ đạo.')}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-md shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="Duyệt giữ nguyên Mức 3 và chuyển thông báo lên Ban biên tập"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Duyệt & Giữ Mức 3 (Trình BBT)</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>Trưởng ban:</strong> Không có đề tài Mức 3 nào đang chờ duyệt.
                  {level3ForEditorialTopics.length > 0 && (
                    <span className="text-emerald-700 font-semibold ml-1">
                      (Đã có {level3ForEditorialTopics.length} đề tài Mức 3 được duyệt trình lên Ban biên tập).
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* 2. KHỐI THÔNG BÁO ĐỀ TÀI MỨC 2 CHO TRƯỞNG BAN */}
          {level2Topics.length > 0 && (
            <div className="bg-orange-50 border border-orange-300/90 rounded-xl p-3 shadow-2xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-950 bg-orange-200 px-2 py-0.5 rounded">
                        Thông báo Mức 2: Tăng cường
                      </span>
                      <span className="font-bold text-orange-950 text-xs sm:text-sm">
                        Có {level2Topics.length} đề tài nhạy cảm Mức 2 do Phóng viên đề xuất thuộc thẩm quyền Trưởng ban theo dõi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onFilterLevel2 && (
                    <button
                      type="button"
                      onClick={() => onFilterLevel2(!isFilteringLevel2)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isFilteringLevel2 
                          ? 'bg-orange-600 text-white border-orange-700' 
                          : 'bg-white text-orange-900 border-orange-300 hover:bg-orange-100'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                      <span>{isFilteringLevel2 ? 'Bỏ lọc' : `Lọc xem bảng (${level2Topics.length})`}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Danh sách đề tài Mức 2 */}
              <div className="space-y-1.5 pt-1">
                {level2Topics.map(topic => (
                  <div key={topic.id} className="bg-white p-2.5 rounded-lg border border-orange-200 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-900 border border-orange-200">
                          Mức 2
                        </span>
                        <span 
                          onClick={() => onSelectTopic(topic)}
                          className="font-semibold text-gray-900 hover:text-orange-800 cursor-pointer line-clamp-1"
                        >
                          {topic.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                        <span>Phóng viên: <strong className="text-gray-700">{topic.author}</strong></span>
                        <span>Ban: <strong className="text-gray-700">{topic.department}</strong></span>
                        <span className="text-orange-900">Lĩnh vực: {topic.sensitivityCategory || 'Chung'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectTopic(topic)}
                      className="px-2 py-1 text-[11px] font-semibold text-orange-900 bg-orange-100 hover:bg-orange-200 rounded transition-colors cursor-pointer shrink-0"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gợi ý bước tiếp theo sang Ban biên tập */}
          <div className="bg-amber-100/70 border border-amber-300 rounded-lg p-2.5 flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-800 shrink-0" />
              <span>
                👉 <strong>Bước tiếp theo:</strong> Sau khi Trưởng ban duyệt đề tài Mức 3, hãy chọn cấp <strong>"Ban biên tập"</strong> ở menu phía trên để xem thông báo và chỉ đạo hoặc thay đổi mức nhạy cảm.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onQuickSwitchRole?.('Ban biên tập')}
              className="px-3 py-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold rounded-md shrink-0 ml-2 cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Sang Ban biên tập</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VAI TRÒ 3: BAN BIÊN TẬP                                       */}
      {/* ------------------------------------------------------------- */}
      {userRole === 'Ban biên tập' && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* SHOW THÔNG BÁO VỚI ĐỀ TÀI MỨC 3 */}
          {allLevel3Topics.length > 0 ? (
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-3.5 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-rose-800 px-2.5 py-0.5 rounded shadow-2xs">
                        Thông báo Ban biên tập • Đề tài Mức 3
                      </span>
                      <span className="font-extrabold text-rose-950 text-xs sm:text-sm">
                        Có {allLevel3Topics.length} đề tài nhạy cảm Mức 3 (Ban biên tập có quyền thay đổi mức nhạy cảm & chỉ đạo)
                      </span>
                    </div>

                    {onFilterLevel3 && (
                      <button
                        type="button"
                        onClick={() => onFilterLevel3(!isFilteringLevel3)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isFilteringLevel3 
                            ? 'bg-rose-800 text-white border-rose-900' 
                            : 'bg-white text-rose-900 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        <Filter className="w-3 h-3" />
                        <span>{isFilteringLevel3 ? 'Hủy lọc' : `Lọc xem bảng (${allLevel3Topics.length})`}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 text-xs leading-relaxed">
                    Ban biên tập nhận được thông báo đề tài Mức 3. <strong>Ban biên tập có thể thay đổi mức nhạy cảm</strong> (Mức 3 ➔ Mức 2, Mức 1 hoặc Bỏ nhạy cảm) và phát lệnh chỉ đạo định hướng xuất bản.
                  </p>

                  {/* Danh sách đề tài Mức 3 hiển thị cho Ban biên tập */}
                  <div className="space-y-3 mt-2">
                    {allLevel3Topics.map((topic) => (
                      <div 
                        key={topic.id}
                        className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 border border-rose-300">
                                Mức 3: Đặc biệt
                              </span>
                              <span 
                                onClick={() => onSelectTopic(topic)}
                                className="font-bold text-gray-900 text-xs sm:text-sm hover:text-rose-700 cursor-pointer line-clamp-1"
                              >
                                {topic.title}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 mt-1">
                              <span>Phóng viên: <strong className="text-gray-700">{topic.author}</strong></span>
                              <span>Ban: <strong className="text-gray-700">{topic.department}</strong></span>
                              <span className="text-rose-800 font-medium">Lĩnh vực: {topic.sensitivityCategory || 'Chung'}</span>
                              {topic.isDepartmentHeadApproved && (
                                <span className="text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  <UserCheck className="w-3 h-3" />
                                  Trưởng ban đã duyệt ({topic.departmentHeadApprovedAt || 'Hôm nay'})
                                </span>
                              )}
                              {!topic.isDepartmentHeadApproved && (
                                <span className="text-amber-700 font-medium flex items-center gap-1 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                  Chờ Trưởng ban duyệt
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onSelectTopic(topic)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                            >
                              Xem hồ sơ
                            </button>

                            {/* Nút bật công cụ Thay đổi mức nhạy cảm của BBT */}
                            <button
                              type="button"
                              onClick={() => {
                                if (editingLevelTopicId === topic.id) {
                                  setEditingLevelTopicId(null);
                                } else {
                                  setEditingLevelTopicId(topic.id);
                                  setSelectedNewLevel(2);
                                  setLevelChangeReason('Ban biên tập điều chỉnh mức nhạy cảm để phù hợp với định hướng xuất bản.');
                                }
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-md shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>{editingLevelTopicId === topic.id ? 'Đóng đổi mức' : 'Thay đổi mức nhạy cảm'}</span>
                            </button>

                            {/* Nút chỉ đạo */}
                            <button
                              type="button"
                              onClick={() => {
                                setShowDirectiveInputForId(showDirectiveInputForId === topic.id ? null : topic.id);
                                setDirectiveText(topic.editorialBoardDirective || 'Đồng ý chủ trương. Yêu cầu thẩm tra độc lập 2 nguồn tin, không suy diễn quy kết và gửi lại bản thảo cho Ban biên tập duyệt trước khi xuất bản.');
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-md shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>{topic.editorialBoardDirective ? 'Sửa chỉ đạo' : 'Chỉ đạo định hướng'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Ghi chú duyệt của Trưởng ban (nếu có) */}
                        {topic.departmentHeadNote && (
                          <div className="bg-amber-50/90 p-2 rounded-lg text-[11px] text-amber-950 border border-amber-200 flex items-start gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Ý kiến thẩm định của Trưởng ban: </strong>
                              <span>{topic.departmentHeadNote}</span>
                            </div>
                          </div>
                        )}

                        {/* Chỉ đạo hiện tại của Ban biên tập (nếu đã có) */}
                        {topic.editorialBoardDirective && (
                          <div className="bg-emerald-50 p-2 rounded-lg text-[11px] text-emerald-950 border border-emerald-200 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Chỉ đạo của Ban biên tập: </strong>
                              <span>{topic.editorialBoardDirective}</span>
                            </div>
                          </div>
                        )}

                        {/* ================= KHỐI THAY ĐỔI MỨC NHẠY CẢM CỦA BAN BIÊN TẬP ================= */}
                        {editingLevelTopicId === topic.id && (
                          <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2.5 animate-in fade-in duration-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                                Ban biên tập điều chỉnh mức độ nhạy cảm của đề tài:
                              </span>
                              <span className="text-[10.5px] text-gray-500 font-medium">
                                Hiện tại: <strong>Mức 3 (Đặc biệt)</strong>
                              </span>
                            </div>

                            {/* Bộ chọn mức mới */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedNewLevel(3)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  selectedNewLevel === 3
                                    ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Mức 3 (Đặc biệt)</div>
                                <div className="text-[10px] opacity-75">Giữ nguyên BBT chỉ đạo</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedNewLevel(2)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  selectedNewLevel === 2
                                    ? 'bg-orange-100 border-orange-500 text-orange-900 font-bold ring-1 ring-orange-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Mức 2 (Tăng cường)</div>
                                <div className="text-[10px] opacity-75">Hạ về Trưởng ban theo dõi</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedNewLevel(1)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  selectedNewLevel === 1
                                    ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold ring-1 ring-amber-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Mức 1 (Thông thường)</div>
                                <div className="text-[10px] opacity-75">Chỉ nhận diện ở list</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedNewLevel(0)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  selectedNewLevel === 0
                                    ? 'bg-slate-200 border-slate-500 text-slate-900 font-bold ring-1 ring-slate-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Không nhạy cảm</div>
                                <div className="text-[10px] opacity-75">Bỏ đánh dấu nhạy cảm</div>
                              </button>
                            </div>

                            {/* Lý do / Chỉ đạo của BBT */}
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <input
                                type="text"
                                value={levelChangeReason}
                                onChange={(e) => setLevelChangeReason(e.target.value)}
                                placeholder="Nhập lý do thay đổi mức / Ý kiến chỉ đạo của Ban biên tập..."
                                className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                              />
                              <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleSaveLevelChange(topic.id)}
                                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Lưu thay đổi mức</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingLevelTopicId(null)}
                                  className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Hộp nhập chỉ đạo nhanh */}
                        {showDirectiveInputForId === topic.id && (
                          <div className="pt-2 border-t border-rose-100 flex flex-col sm:flex-row items-center gap-2 animate-in fade-in duration-100">
                            <input
                              type="text"
                              value={directiveText}
                              onChange={(e) => setDirectiveText(e.target.value)}
                              placeholder="Nhập ý kiến chỉ đạo định hướng xuất bản của Ban biên tập..."
                              className="flex-1 w-full text-xs px-3 py-1.5 bg-rose-50/50 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                              <button
                                type="button"
                                onClick={() => handleSendDirective(topic.id)}
                                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                Ban hành chỉ đạo
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowDirectiveInputForId(null)}
                                className="px-2.5 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Đóng
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span>
                  <strong>Cấp Ban biên tập:</strong> Hiện không có đề tài nhạy cảm Mức 3 nào cần xử lý.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onQuickSwitchRole?.('Phóng viên')}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
              >
                Về cấp Phóng viên để tạo đề tài mới
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
