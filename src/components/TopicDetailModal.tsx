import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  User, 
  Building, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  Shield,
  Check,
  UserCheck,
  Sliders
} from 'lucide-react';
import { Topic, TopicStatus, UserRole, SensitivityLevel } from '../types';

interface TopicDetailModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (topicId: string, status: TopicStatus) => void;
  onToggleImportant: (topicId: string) => void;
  userRole?: UserRole | string;
  onDepartmentHeadApprove?: (topicId: string, keepLevel3: boolean, note?: string) => void;
  onEditorialDirective?: (topicId: string, directive: string) => void;
  onChangeSensitivityLevel?: (topicId: string, newLevel: SensitivityLevel | 0, reason?: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  isOpen,
  onClose,
  onUpdateStatus,
  onToggleImportant,
  userRole = 'Ban biên tập',
  onDepartmentHeadApprove,
  onEditorialDirective,
  onChangeSensitivityLevel,
}) => {
  const [directiveInput, setDirectiveInput] = useState('');
  const [isEditingDirective, setIsEditingDirective] = useState(false);
  const [isChangingLevel, setIsChangingLevel] = useState(false);
  const [targetLevel, setTargetLevel] = useState<SensitivityLevel | 0>(2);
  const [levelChangeNote, setLevelChangeNote] = useState('');
  const [headNote, setHeadNote] = useState('');

  if (!isOpen || !topic) return null;

  const handleSendDirective = () => {
    if (!directiveInput.trim()) return;
    onEditorialDirective?.(topic.id, directiveInput.trim());
    setIsEditingDirective(false);
    setDirectiveInput('');
  };

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
            <span className="text-xs text-slate-400">
              Mã: {topic.id}
            </span>
            {topic.isSensitive && (
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                topic.sensitivityLevel === 3
                  ? 'bg-rose-900/90 text-rose-200 border border-rose-700'
                  : topic.sensitivityLevel === 2
                  ? 'bg-orange-900/90 text-orange-200 border border-orange-700'
                  : 'bg-amber-900/90 text-amber-200 border border-amber-700'
              }`}>
                {topic.sensitivityLevel === 3 ? (
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                ) : topic.sensitivityLevel === 2 ? (
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                ) : (
                  <Shield className="w-3 h-3 text-amber-400" />
                )}
                <span>Nhạy cảm Mức {topic.sensitivityLevel || 1}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleImportant(topic.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                topic.isImportant 
                  ? 'text-amber-400 hover:text-amber-300 bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={topic.isImportant ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu quan trọng'}
            >
              <Star className={`w-4 h-4 ${topic.isImportant ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-gray-900">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Tên đề tài
              </span>
              {topic.isImportant && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Quan trọng
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {topic.title}
            </h3>
          </div>

          {/* ================= KHỐI QUY TRÌNH DUYỆT 3 CẤP ĐỀ TÀI NHẠY CẢM ================= */}
          {topic.isSensitive && (
            <div className={`p-4 rounded-xl border ${
              topic.sensitivityLevel === 3 
                ? 'bg-rose-50/80 border-rose-300' 
                : topic.sensitivityLevel === 2 
                ? 'bg-orange-50/80 border-orange-300' 
                : 'bg-amber-50/80 border-amber-300'
            }`}>
              <div className="flex items-center justify-between mb-3 border-b pb-2 border-current/20">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    topic.sensitivityLevel === 3 
                      ? 'bg-rose-600 text-white' 
                      : topic.sensitivityLevel === 2 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-amber-500 text-white'
                  }`}>
                    {topic.sensitivityLevel === 3 ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : topic.sensitivityLevel === 2 ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">
                      Quy chế xử lý: Đề tài nhạy cảm Mức {topic.sensitivityLevel}
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      Lĩnh vực: <strong className="text-gray-900">{topic.sensitivityCategory || 'Chung'}</strong>
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 font-bold rounded-lg text-xs ${
                  topic.sensitivityLevel === 3 
                    ? 'bg-rose-200 text-rose-950 border border-rose-300' 
                    : topic.sensitivityLevel === 2 
                    ? 'bg-orange-200 text-orange-950 border border-orange-300' 
                    : 'bg-amber-200 text-amber-950 border border-amber-300'
                }`}>
                  {topic.sensitivityLevel === 3 
                    ? 'Mức 3: Ban biên tập chỉ đạo' 
                    : topic.sensitivityLevel === 2 
                    ? 'Mức 2: Trưởng ban kiểm soát' 
                    : 'Mức 1: Nhận diện ở List'}
                </span>
              </div>

              {/* Chi tiết tiến trình 3 cấp */}
              <div className="space-y-2.5 text-xs">
                {/* Cấp 1: Phóng viên đề xuất */}
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Cấp 1: Phóng viên đề xuất</span>
                      <span className="text-gray-500 text-[11px]">{topic.createdAt}</span>
                    </div>
                    <p className="text-gray-600 mt-0.5">
                      Phóng viên <strong>{topic.author}</strong> ({topic.department}) đã đề xuất đề tài và đánh dấu Mức {topic.sensitivityLevel}.
                    </p>
                  </div>
                </div>

                {/* Cấp 2: Thẩm duyệt của Trưởng ban */}
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Cấp 2: Trưởng ban chuyên môn</span>
                      <span className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded ${
                        topic.sensitivityLevel === 1
                          ? 'bg-gray-100 text-gray-700'
                          : topic.sensitivityLevel === 2
                          ? 'bg-orange-100 text-orange-800'
                          : topic.isDepartmentHeadApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {topic.sensitivityLevel === 1
                          ? 'Theo dõi tại List'
                          : topic.sensitivityLevel === 2
                          ? 'Trưởng ban kiểm soát'
                          : topic.isDepartmentHeadApproved
                          ? 'Đã duyệt giữ Mức 3 ➔ Trình BBT'
                          : 'Chờ Trưởng ban duyệt'}
                      </span>
                    </div>

                    <p className="text-gray-600">
                      {topic.sensitivityLevel === 1
                        ? 'Đề tài Mức 1 tuân thủ chuẩn biên tập thông thường, hiển thị nhận diện ở bảng danh sách.'
                        : topic.sensitivityLevel === 2
                        ? 'Đề tài Mức 2 được Trưởng ban chuyên môn trực tiếp chỉ đạo định hướng và kiểm chứng tài liệu.'
                        : topic.isDepartmentHeadApproved
                        ? `Trưởng ban đã thẩm định hồ sơ, giữ nguyên Mức 3 và trình Ban biên tập xem xét (${topic.departmentHeadApprovedAt || 'Gần đây'}).`
                        : 'Đề tài Mức 3 cần Trưởng ban duyệt trước khi chuyển cảnh báo lên Ban biên tập.'}
                    </p>

                    {topic.departmentHeadNote && (
                      <div className="bg-amber-50 p-2 rounded text-[11px] text-amber-900 border border-amber-200">
                        <strong>Ý kiến Trưởng ban: </strong>{topic.departmentHeadNote}
                      </div>
                    )}

                    {/* Nút hành động thẩm duyệt cho Trưởng ban (khi đề tài Mức 3 chưa duyệt) */}
                    {topic.sensitivityLevel === 3 && !topic.isDepartmentHeadApproved && onDepartmentHeadApprove && (
                      <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onDepartmentHeadApprove(topic.id, true, 'Trưởng ban đã duyệt hồ sơ giữ nguyên Mức 3 và chuyển trình Ban biên tập chỉ đạo.')}
                          className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Duyệt & Giữ Mức 3 (Trình BBT)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDepartmentHeadApprove(topic.id, false, 'Trưởng ban đã phê duyệt và hạ xuống Mức 2 để xử lý tại Ban.')}
                          className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 font-semibold rounded-lg text-xs cursor-pointer"
                        >
                          Duyệt & Hạ xuống Mức 2
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cấp 3: Ban biên tập chỉ đạo */}
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Cấp 3: Ban biên tập chỉ đạo</span>
                      <span className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded ${
                        topic.sensitivityLevel < 3
                          ? 'bg-gray-100 text-gray-500'
                          : !topic.isDepartmentHeadApproved
                          ? 'bg-slate-100 text-slate-600'
                          : topic.editorialBoardDirective
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {topic.sensitivityLevel < 3
                          ? 'Không cần trình BBT'
                          : !topic.isDepartmentHeadApproved
                          ? 'Chưa chuyển tới BBT'
                          : topic.editorialBoardDirective
                          ? 'BBT đã chỉ đạo'
                          : 'Chờ BBT chỉ đạo'}
                      </span>
                    </div>

                    <p className="text-gray-600">
                      {topic.sensitivityLevel < 3
                        ? 'Đề tài nhạy cảm Mức 1 & 2 xử lý ở cấp Phóng viên & Trưởng ban, không gửi cảnh báo tới Ban biên tập.'
                        : !topic.isDepartmentHeadApproved
                        ? 'Theo quy chế: Ban biên tập chỉ nhận được thông báo sau khi Trưởng ban đã thẩm định và duyệt giữ nguyên Mức 3.'
                        : 'Đề tài Mức 3 đã được Trưởng ban duyệt trình lên, cần Ban biên tập kiểm duyệt, chỉ đạo định hướng.'}
                    </p>

                    {topic.editorialBoardDirective && (
                      <div className="bg-emerald-50 p-2.5 rounded text-[11px] text-emerald-900 border border-emerald-200">
                        <strong className="block mb-0.5">Chỉ đạo của Ban biên tập:</strong>
                        <span>{topic.editorialBoardDirective}</span>
                      </div>
                    )}

                    {/* Thao tác chỉ đạo & Thay đổi mức nhạy cảm cho Ban biên tập */}
                    {userRole === 'Ban biên tập' && onChangeSensitivityLevel && (
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingLevel(!isChangingLevel);
                              setTargetLevel(topic.sensitivityLevel === 3 ? 2 : 3);
                              setLevelChangeNote('');
                            }}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>{isChangingLevel ? 'Đóng đổi mức' : 'Ban biên tập thay đổi mức nhạy cảm'}</span>
                          </button>

                          {topic.sensitivityLevel === 3 && onEditorialDirective && !isEditingDirective && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingDirective(true);
                                setDirectiveInput(topic.editorialBoardDirective || 'Đồng ý khai thác. Yêu cầu kiểm chứng độc lập 2 nguồn tin, gửi lại bản thảo cho Ban biên tập duyệt trước khi xuất bản.');
                              }}
                              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{topic.editorialBoardDirective ? 'Sửa chỉ đạo BBT' : 'Ghi ý kiến chỉ đạo của BBT'}</span>
                            </button>
                          )}
                        </div>

                        {/* Hộp thay đổi mức nhạy cảm của BBT */}
                        {isChangingLevel && (
                          <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2.5 animate-in fade-in duration-100">
                            <span className="text-xs font-bold text-amber-950 block">
                              Chọn mức độ nhạy cảm mới cho đề tài:
                            </span>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <button
                                type="button"
                                onClick={() => setTargetLevel(3)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  targetLevel === 3
                                    ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Mức 3 (Đặc biệt)</div>
                                <div className="text-[10px] opacity-75">BBT trực tiếp chỉ đạo</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setTargetLevel(2)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  targetLevel === 2
                                    ? 'bg-orange-100 border-orange-500 text-orange-900 font-bold ring-1 ring-orange-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Mức 2 (Tăng cường)</div>
                                <div className="text-[10px] opacity-75">Hạ về Trưởng ban theo dõi</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setTargetLevel(1)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  targetLevel === 1
                                    ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold ring-1 ring-amber-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Mức 1 (Thông thường)</div>
                                <div className="text-[10px] opacity-75">Chỉ hiển thị ở list</div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setTargetLevel(0)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                  targetLevel === 0
                                    ? 'bg-slate-200 border-slate-500 text-slate-900 font-bold ring-1 ring-slate-400'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="text-[11px] font-bold">Không nhạy cảm</div>
                                <div className="text-[10px] opacity-75">Bỏ đánh dấu nhạy cảm</div>
                              </button>
                            </div>

                            <input
                              type="text"
                              value={levelChangeNote}
                              onChange={(e) => setLevelChangeNote(e.target.value)}
                              placeholder="Nhập lý do thay đổi mức / Ý kiến chỉ đạo của Ban biên tập..."
                              className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onChangeSensitivityLevel(topic.id, targetLevel, levelChangeNote.trim() || 'Ban biên tập đã điều chỉnh mức nhạy cảm của đề tài.');
                                  setIsChangingLevel(false);
                                }}
                                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Cập nhật mức nhạy cảm</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsChangingLevel(false)}
                                className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Hộp soạn ý kiến chỉ đạo BBT */}
                        {isEditingDirective && (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={directiveInput}
                              onChange={(e) => setDirectiveInput(e.target.value)}
                              placeholder="Nhập ý kiến chỉ đạo định hướng xuất bản của Ban biên tập..."
                              className="w-full text-xs p-2 bg-rose-50/40 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={handleSendDirective}
                                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Ban hành chỉ đạo
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditingDirective(false)}
                                className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
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

            <div>
              <span className="text-gray-500 block mb-0.5">Tiến độ bài viết</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                topic.articleWorkflowStatus === 'Created'
                  ? 'bg-slate-200 text-slate-800'
                  : topic.articleWorkflowStatus === 'Verifying'
                  ? 'bg-amber-100 text-amber-900'
                  : topic.articleWorkflowStatus === 'Publishing'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-emerald-100 text-emerald-900'
              }`}>
                {topic.articleWorkflowStatus || (topic.status === 'Hoàn thành' ? 'Published' : 'Created')}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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
              className="px-4 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
