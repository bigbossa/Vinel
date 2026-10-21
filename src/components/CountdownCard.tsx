import React, { useState } from 'react';
import { 
  VinylBanner, 
  TimeRemaining 
} from '../types/vinyl';
import { 
  formatThaiDate, 
  calculateTimeRemaining,
  downloadCalendarEvent 
} from '../utils/time';
import { CATEGORY_LABELS } from '../data/defaultBanners';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Share2, 
  Printer, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  MoreVertical, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CountdownCardProps {
  banner: VinylBanner;
  currentTime: Date;
  onEdit: (banner: VinylBanner) => void;
  onDelete: (id: string) => void;
  onToggleChecklist: (bannerId: string, itemId: string) => void;
  onMarkDismantled: (id: string) => void;
  onExtendDays: (id: string, days: number) => void;
  onOpenLineModal: (banner: VinylBanner) => void;
  onOpenPrintModal: (banner: VinylBanner) => void;
  playChimeSound?: () => void;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  banner,
  currentTime,
  onEdit,
  onDelete,
  onToggleChecklist,
  onMarkDismantled,
  onExtendDays,
  onOpenLineModal,
  onOpenPrintModal,
  playChimeSound,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAllChecklist, setShowAllChecklist] = useState(false);
  const [imageError, setImageError] = useState(false);

  const timeRem = calculateTimeRemaining(banner.targetDate, banner.startDate);
  const area = (banner.widthMeter * banner.heightMeter).toFixed(1);
  const categoryMeta = CATEGORY_LABELS[banner.category] || {
    label: banner.category,
    color: 'text-slate-700 bg-slate-100',
    desc: ''
  };

  const isDismantled = banner.status === 'dismantled';

  const handleDismantle = () => {
    setShowMenu(false);
    onMarkDismantled(banner.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    if (playChimeSound) playChimeSound();
  };

  const completedChecklistCount = banner.checklist.filter(c => c.done).length;

  return (
    <div 
      className={`relative bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isDismantled
          ? 'border-slate-200 opacity-75'
          : timeRem.urgencyLevel === 'expired'
          ? 'border-rose-300 ring-1 ring-rose-300 shadow-sm'
          : timeRem.urgencyLevel === 'critical'
          ? 'border-amber-300 ring-1 ring-amber-300 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Top Banner Photo / Thumbnail with Resilient Fallback */}
      <div className="relative h-44 bg-slate-100 overflow-hidden group">
        {!imageError && banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-slate-500">
            <Layers className="w-8 h-8 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-600">{banner.title}</span>
            <span className="text-[11px] text-slate-400">ป้ายไวนิล {banner.widthMeter}×{banner.heightMeter} ม.</span>
          </div>
        )}

        {/* Scrim Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Category & Status Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
            {categoryMeta.label}
          </span>

          <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
            {banner.widthMeter} × {banner.heightMeter} ม. ({area} ตร.ม.)
          </span>
        </div>

        {/* Bottom of Image: Title on Scrim */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <h3 className="font-semibold text-base leading-snug line-clamp-1 drop-shadow-sm">
            {banner.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{banner.location}</span>
          </div>
        </div>
      </div>

      {/* Main Content & Real-time Countdown Display */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Countdown Area */}
        <div className="space-y-3">
          {isDismantled ? (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>ปลดป้ายเรียบร้อยแล้ว</span>
              </div>
              {banner.dismantledAt && (
                <p className="text-xs text-slate-500 mt-0.5">
                  เมื่อ {formatThaiDate(banner.dismantledAt, true)}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="flex items-center gap-1 font-medium">
                  {timeRem.urgencyLevel === 'expired' ? (
                    <span className="text-rose-600 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      เกินกำหนดแล้ว
                    </span>
                  ) : timeRem.urgencyLevel === 'critical' ? (
                    <span className="text-amber-600 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      ครบกำหนดวันนี้
                    </span>
                  ) : (
                    <span className="text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      นับถอยหลังถึงวันปลด
                    </span>
                  )}
                </span>
                <span className="font-mono-numbers text-[11px] text-slate-400">
                  {formatThaiDate(banner.targetDate, false)}
                </span>
              </div>

              {/* Digital Segment Countdown Timer */}
              <div 
                className={`grid grid-cols-4 gap-1.5 p-2.5 rounded-lg border text-center transition-colors ${
                  timeRem.urgencyLevel === 'expired'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : timeRem.urgencyLevel === 'critical'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers leading-none">
                    {timeRem.days}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">วัน</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers leading-none">
                    {String(timeRem.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">ชั่วโมง</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers leading-none">
                    {String(timeRem.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">นาที</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers leading-none">
                    {String(timeRem.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase mt-1">วินาที</div>
                </div>
              </div>

              {/* Lifecycle Progress Bar */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>อายุการแสดงป้าย</span>
                  <span className="font-mono-numbers">{timeRem.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      timeRem.urgencyLevel === 'expired'
                        ? 'bg-rose-600'
                        : timeRem.urgencyLevel === 'critical'
                        ? 'bg-amber-500'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${timeRem.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ผู้ติดต่อ:</span>
              <span className="font-medium text-slate-800">{banner.clientName}</span>
            </div>
            {banner.clientPhone && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">เบอร์โทร:</span>
                <a 
                  href={`tel:${banner.clientPhone}`}
                  className="font-mono-numbers text-slate-700 hover:text-amber-600 transition-colors flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{banner.clientPhone}</span>
                </a>
              </div>
            )}
            {banner.fee > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">งบประมาณ/ค่าเช่า:</span>
                <span className="font-mono-numbers font-medium text-slate-900">
                  ฿{banner.fee.toLocaleString('th-TH')}
                </span>
              </div>
            )}
            {banner.material && (
              <div className="pt-1 text-[11px] text-slate-500 line-clamp-1" title={banner.material}>
                <span className="text-slate-400">สเปก: </span>
                {banner.material}
              </div>
            )}
          </div>

          {/* Operational Checklist */}
          {banner.checklist && banner.checklist.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span className="font-medium">
                  รายการงาน ({completedChecklistCount}/{banner.checklist.length})
                </span>
                {banner.checklist.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllChecklist(!showAllChecklist)}
                    className="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
                  >
                    {showAllChecklist ? 'ย่อ' : 'ดูทั้งหมด'}
                    {showAllChecklist ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {(showAllChecklist ? banner.checklist : banner.checklist.slice(0, 2)).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleChecklist(banner.id, item.id)}
                    className="w-full text-left flex items-start gap-2 text-xs py-0.5 group cursor-pointer"
                  >
                    {item.done ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-[11px] leading-tight ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Action Footer Bar */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1">
            {/* Quick LINE Reminder Button */}
            <button
              type="button"
              onClick={() => onOpenLineModal(banner)}
              title="สร้างข้อความแจ้งเตือน LINE"
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ส่งเตือน</span>
            </button>

            {/* Print Work Order Button */}
            <button
              type="button"
              onClick={() => onOpenPrintModal(banner)}
              title="พิมพ์ใบสั่งงานปลดป้าย"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {/* iCal Calendar Export Button */}
            <button
              type="button"
              onClick={() => downloadCalendarEvent(banner)}
              title="บันทึกเตือนลงปฏิทิน (.ics)"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Mark Dismantled or Extend Menu */}
          <div className="relative">
            {!isDismantled ? (
              <button
                type="button"
                onClick={handleDismantle}
                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>ปลดป้ายแล้ว</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onExtendDays(banner.id, 30)}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ต่อสัญญา +30 วัน</span>
              </button>
            )}
          </div>

          {/* More options menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 bottom-full mb-1 z-30 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onEdit(banner); }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    แก้ไขข้อมูลป้าย
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onExtendDays(banner.id, 7); }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    ต่อเวลาเพิ่ม +7 วัน
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onExtendDays(banner.id, 30); }}
                    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    ต่อสัญญาเพิ่ม +1 เดือน
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => { setShowMenu(false); onDelete(banner.id); }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50"
                  >
                    ลบรายการนี้
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
