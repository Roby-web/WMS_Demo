import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Star, Calendar, User, Building, Globe, Zap } from 'lucide-react';
import { Topic, TopicStatus } from '../types';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTopic: Partial<Topic>) => void;
  initialData?: {
    title?: string;
    department?: string;
    fromTrendsense?: boolean;
    trendsenseNewsId?: string;
  } | null;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Thời sự - Chính trị');
  const [author, setAuthor] = useState('Trần Duy Tùng (PV)');
  const [status, setStatus] = useState<TopicStatus>('Chờ duyệt');
  const [isImportant, setIsImportant] = useState(true);
  const [isDueToday, setIsDueToday] = useState(true);
  const [deadline, setDeadline] = useState('17/1, 20:00');
  const [fromTrendsense, setFromTrendsense] = useState(false);
  const [userNeed, setUserNeed] = useState('Update');
  const [tags, setTags] = useState<string[]>(['Gửi BBT', 'Ưu tiên']);
  const [description, setDescription] = useState('');

  // Update form fields when opening modal or receiving initialData
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        if (initialData.department) {
          // Map to known department option if possible
          const dept = initialData.department.trim();
          if (dept.includes('Sức khỏe') || dept.includes('Y tế')) {
            setDepartment('Y tế - Sức khỏe');
          } else if (dept.includes('Giải trí') || dept.includes('Văn hóa')) {
            setDepartment('Thể thao - Giải trí');
          } else if (dept.includes('Pháp luật') || dept.includes('Điều tra')) {
            setDepartment('Pháp luật - Điều tra');
          } else if (dept.includes('Kinh tế') || dept.includes('Tài chính')) {
            setDepartment('Kinh tế - Thị trường');
          } else if (dept.includes('Công nghệ') || dept.includes('Khoa học')) {
            setDepartment('Công nghệ');
          } else if (dept.includes('Giáo dục')) {
            setDepartment('Giáo dục - Đô thị');
          } else {
            setDepartment('Thời sự - Chính trị');
          }
        }
        setFromTrendsense(Boolean(initialData.fromTrendsense));
        if (initialData.fromTrendsense) {
          setTags(prev => prev.includes('Trendsense') ? prev : ['Trendsense', ...prev]);
        }
      } else {
        setTitle('');
        setFromTrendsense(false);
        setTags(['Gửi BBT', 'Ưu tiên']);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalTags = fromTrendsense && !tags.includes('Trendsense') 
      ? ['Trendsense', ...tags] 
      : tags.filter(t => fromTrendsense || t !== 'Trendsense');

    onSubmit({
      title: title.trim(),
      department,
      author,
      status,
      isImportant,
      isDueToday,
      daysUntilDeadline: isDueToday ? 0 : 2,
      deadline,
      fromTrendsense,
      trendsenseNewsId: initialData?.trendsenseNewsId,
      userNeed,
      tags: finalTags,
      description: description.trim() || (fromTrendsense ? 'Đề tài được phát hiện và giao từ nguồn tin tức Trendsense.' : ''),
      commentsCount: 0,
    });

    // Reset
    setTitle('');
    setDescription('');
    onClose();
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-create-topic"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">
              {fromTrendsense ? 'Giao đề tài từ nguồn Trendsense' : 'Tạo đề xuất đề tài mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên đề tài */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Tên đề tài <span className="text-red-500">*</span>
            </label>
            <input
              id="input-new-topic-title"
              type="text"
              required
              placeholder="Nhập tiêu đề tin bài hoặc chủ đề đề xuất..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
            />
          </div>

          {/* TRƯỜNG: Đề tài từ Trendsense (Theo yêu cầu) */}
          <div className={`p-3 rounded-xl border transition-all ${
            fromTrendsense 
              ? 'bg-rose-50/80 border-rose-200 ring-1 ring-rose-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <label className="flex items-start justify-between cursor-pointer">
              <div className="flex items-center space-x-2.5">
                <input
                  id="checkbox-from-trendsense"
                  type="checkbox"
                  checked={fromTrendsense}
                  onChange={(e) => setFromTrendsense(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-100" />
                    Đề tài từ Trendsense
                  </span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Được đồng bộ và tự động đối soát với cơ sở dữ liệu tin tức Trendsense.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Ban chuyên môn & Người thực hiện */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ban chuyên môn
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="Thời sự - Chính trị">Thời sự - Chính trị</option>
                <option value="Kinh tế - Thị trường">Kinh tế - Thị trường</option>
                <option value="Giáo dục - Đô thị">Giáo dục - Đô thị</option>
                <option value="Y tế - Sức khỏe">Y tế - Sức khỏe</option>
                <option value="Pháp luật - Điều tra">Pháp luật - Điều tra</option>
                <option value="Thể thao - Giải trí">Thể thao - Giải trí</option>
                <option value="Công nghệ">Công nghệ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phóng viên đề xuất / Giao việc
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Quan trọng & Hạn chót */}
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Đề tài Quan trọng (Tính vào thống kê Top)
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDueToday}
                  onChange={(e) => {
                    setIsDueToday(e.target.checked);
                    if (e.target.checked) setDeadline('17/1, 20:00');
                    else setDeadline('19/1, 14:00');
                  }}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Hạn hôm nay (17/1)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hạn nộp bài / Xuất bản</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="17/1, 20:00"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Trạng thái khởi tạo</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TopicStatus)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900"
                >
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đang triển khai">Đang triển khai</option>
                  <option value="Lên kế hoạch">Lên kế hoạch</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags & User need */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-gray-600">Thẻ gán:</span>
            {fromTrendsense && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-100 border border-rose-300 text-rose-900 flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-700" />
                Trendsense
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleTag('Gửi BBT')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                tags.includes('Gửi BBT')
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              Gửi BBT
            </button>
            <button
              type="button"
              onClick={() => toggleTag('Ưu tiên')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                tags.includes('Ưu tiên')
                  ? 'bg-red-100 border-red-300 text-red-900 font-bold'
                  : 'bg-gray-100 border-gray-200 text-gray-600'
              }`}
            >
              Ưu tiên
            </button>
          </div>

          {/* Tóm tắt nội dung */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Ghi chú nội dung đề tài
            </label>
            <textarea
              rows={3}
              placeholder="Tóm tắt ý tưởng, góc nhìn, nguồn tin cần khai thác..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-[#be185d] hover:bg-[#9d174d] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {fromTrendsense ? 'Tạo & Giao đề tài' : 'Tạo đề tài'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

