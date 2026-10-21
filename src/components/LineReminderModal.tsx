import React, { useState } from 'react';
import { VinylBanner } from '../types/vinyl';
import { calculateTimeRemaining, generateLineMessage } from '../utils/time';
import { X, Copy, Check, ExternalLink, Send } from 'lucide-react';

interface LineReminderModalProps {
  banner: VinylBanner | null;
  onClose: () => void;
}

export const LineReminderModal: React.FC<LineReminderModalProps> = ({ banner, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!banner) return null;

  const timeRem = calculateTimeRemaining(banner.targetDate, banner.startDate);
  const message = generateLineMessage(banner, timeRem);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-emerald-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              LINE
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">ส่งการแจ้งเตือนป้ายไวนิลผ่าน LINE</h3>
              <p className="text-xs text-slate-600">ข้อความเตือนความจำสำหรับทีมงานหรือลูกค้า</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ตัวอย่างข้อความแจ้งเตือนอัตโนมัติ:
            </span>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed selection:bg-emerald-100">
              {message}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกข้อความสำเร็จ!' : 'คัดลอกข้อความ'}</span>
            </button>

            <a
              href={lineShareUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#06C755] hover:bg-[#05b34c] text-white shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>เปิดส่งในแอป LINE</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
