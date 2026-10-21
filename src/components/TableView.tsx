import React, { useState } from 'react';
import { VinylBanner } from '../types/vinyl';
import { calculateTimeRemaining, formatThaiDate } from '../utils/time';
import { CATEGORY_LABELS } from '../data/defaultBanners';
import { 
  Search, 
  ArrowUpDown, 
  Share2, 
  Printer, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  RotateCcw,
  Calendar
} from 'lucide-react';

interface TableViewProps {
  banners: VinylBanner[];
  onEdit: (banner: VinylBanner) => void;
  onDelete: (id: string) => void;
  onMarkDismantled: (id: string) => void;
  onExtendDays: (id: string, days: number) => void;
  onOpenLineModal: (banner: VinylBanner) => void;
  onOpenPrintModal: (banner: VinylBanner) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  banners,
  onEdit,
  onDelete,
  onMarkDismantled,
  onExtendDays,
  onOpenLineModal,
  onOpenPrintModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'expiry' | 'area' | 'fee'>('expiry');

  const filtered = banners.filter(b => {
    const q = searchTerm.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.zone.toLowerCase().includes(q) ||
      b.clientName.toLowerCase().includes(q) ||
      b.clientPhone.includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'expiry') {
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    }
    if (sortBy === 'area') {
      return (b.widthMeter * b.heightMeter) - (a.widthMeter * a.heightMeter);
    }
    if (sortBy === 'fee') {
      return b.fee - a.fee;
    }
    return 0;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Search and Sort Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อป้าย, สถานที่, หรือลูกค้า..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500">เรียงตาม:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'expiry' | 'area' | 'fee')}
            className="text-xs border border-slate-300 rounded-md py-1.5 px-2 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="expiry">วันหมดอายุ / เวลาเหลือน้อยสุด</option>
            <option value="area">ขนาดพื้นที่ ตร.ม. (มากไปน้อย)</option>
            <option value="fee">งบประมาณ / ค่าเช่า (มากไปน้อย)</option>
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-100/70 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">ชื่อป้าย / สถานที่</th>
              <th className="py-3 px-3">ประเภท & โซน</th>
              <th className="py-3 px-3">ขนาด (ตร.ม.)</th>
              <th className="py-3 px-4">เวลานับถอยหลัง / วันปลด</th>
              <th className="py-3 px-3">ลูกค้า / เบอร์โทร</th>
              <th className="py-3 px-3 text-right">ค่าเช่า/งบ</th>
              <th className="py-3 px-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลป้ายไวนิลที่ค้นหา
                </td>
              </tr>
            ) : (
              sorted.map(banner => {
                const rem = calculateTimeRemaining(banner.targetDate, banner.startDate);
                const area = (banner.widthMeter * banner.heightMeter).toFixed(1);
                const categoryMeta = CATEGORY_LABELS[banner.category] || { label: banner.category };
                const isDismantled = banner.status === 'dismantled';

                return (
                  <tr 
                    key={banner.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isDismantled ? 'opacity-60 bg-slate-50/40' : ''
                    }`}
                  >
                    {/* Title & Location */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 leading-snug line-clamp-1">
                        {banner.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {banner.location}
                      </div>
                    </td>

                    {/* Category & Zone */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{categoryMeta.label}</div>
                      <div className="text-[11px] text-slate-400">{banner.zone}</div>
                    </td>

                    {/* Dimensions */}
                    <td className="py-3 px-3 font-mono-numbers whitespace-nowrap">
                      <div>{banner.widthMeter} × {banner.heightMeter} ม.</div>
                      <div className="text-[11px] text-slate-400">({area} ตร.ม.)</div>
                    </td>

                    {/* Target Date & Countdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isDismantled ? (
                        <span className="text-emerald-700 font-medium">ปลดแล้ว</span>
                      ) : rem.isExpired ? (
                        <div className="text-rose-600 font-bold">
                          🚨 เกินกำหนด {rem.days} วัน {rem.hours} ชม.
                        </div>
                      ) : rem.days === 0 ? (
                        <div className="text-amber-600 font-bold">
                          ⚠️ ครบวันนี้ (เหลือ {rem.hours} ชม. {rem.minutes} น.)
                        </div>
                      ) : (
                        <div className="font-mono-numbers font-medium text-slate-800">
                          ⏳ เหลืออีก {rem.days} วัน {rem.hours} ชม.
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 font-mono-numbers">
                        {formatThaiDate(banner.targetDate, false)}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{banner.clientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono-numbers">{banner.clientPhone || '-'}</div>
                    </td>

                    {/* Fee */}
                    <td className="py-3 px-3 text-right font-mono-numbers font-medium text-slate-900 whitespace-nowrap">
                      {banner.fee > 0 ? `฿${banner.fee.toLocaleString()}` : '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenLineModal(banner)}
                          title="ส่งเตือนผ่าน LINE"
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenPrintModal(banner)}
                          title="พิมพ์ใบสั่งงาน"
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {!isDismantled ? (
                          <button
                            type="button"
                            onClick={() => onMarkDismantled(banner.id)}
                            title="บันทึกว่าปลดป้ายแล้ว"
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onExtendDays(banner.id, 30)}
                            title="ต่อสัญญา +30 วัน"
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onEdit(banner)}
                          title="แก้ไข"
                          className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(banner.id)}
                          title="ลบ"
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
