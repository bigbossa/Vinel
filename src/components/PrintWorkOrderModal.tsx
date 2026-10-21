import React from 'react';
import { VinylBanner } from '../types/vinyl';
import { formatThaiDate } from '../utils/time';
import { CATEGORY_LABELS } from '../data/defaultBanners';
import { X, Printer, ShieldCheck, MapPin, Phone, FileText } from 'lucide-react';

interface PrintWorkOrderModalProps {
  banner: VinylBanner | null;
  onClose: () => void;
}

export const PrintWorkOrderModal: React.FC<PrintWorkOrderModalProps> = ({ banner, onClose }) => {
  if (!banner) return null;

  const area = (banner.widthMeter * banner.heightMeter).toFixed(2);
  const categoryMeta = CATEGORY_LABELS[banner.category] || { label: banner.category, color: '', desc: '' };
  const workOrderNo = `WO-${banner.id.toUpperCase()}-${new Date().getFullYear() + 543}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-slate-800 text-sm">
              ตัวอย่างใบสั่งงานปลดป้าย / ตรวจเช็คสภาพ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์ใบสั่งงาน</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-8 sm:p-10 text-slate-900 bg-white space-y-6">
          {/* Header of Document */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                ใบสั่งงานปลดและตรวจสอบป้ายไวนิล
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                VINYLGUARD WORK ORDER & SITE DISMANTLE SHEET
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400">เลขที่เอกสาร</div>
              <div className="text-sm font-mono-numbers font-bold text-slate-900">{workOrderNo}</div>
              <div className="text-[11px] text-slate-500 font-mono-numbers">
                พิมพ์เมื่อ: {formatThaiDate(new Date().toISOString(), true)}
              </div>
            </div>
          </div>

          {/* Banner Summary Box */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="col-span-2 space-y-2">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">ชื่องาน / แคมเปญ</span>
                <div className="text-base font-bold text-slate-900 leading-tight">{banner.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">ประเภท:</span>{' '}
                  <span className="font-semibold text-slate-800">{categoryMeta.label}</span>
                </div>
                <div>
                  <span className="text-slate-400">ขนาด:</span>{' '}
                  <span className="font-mono-numbers font-semibold text-slate-800">
                    {banner.widthMeter} × {banner.heightMeter} ม. ({area} ตร.ม.)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">วันกำหนดปลดป้าย</span>
                <div className="text-xs sm:text-sm font-bold text-rose-600 font-mono-numbers">
                  {formatThaiDate(banner.targetDate, true)}
                </div>
              </div>
              <div className="text-xs text-slate-500">
                โซน: <span className="font-medium text-slate-700">{banner.zone}</span>
              </div>
            </div>
          </div>

          {/* Location & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>พิกัดและสถานที่ติดตั้ง</span>
              </div>
              <p className="text-slate-800 font-medium pl-4">{banner.location}</p>
              <div className="pl-4 text-slate-500">
                ผู้ติดต่อ: {banner.clientName} (โทร: {banner.clientPhone || '-'})
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>สเปกวัสดุผ้าและอุปกรณ์</span>
              </div>
              <p className="text-slate-800 pl-4">{banner.material}</p>
              {banner.notes && (
                <p className="pl-4 text-slate-500 italic">หมายเหตุ: {banner.notes}</p>
              )}
            </div>
          </div>

          {/* Field Operations Checklist */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              รายการตรวจสอบหน้างาน (ช่างผู้ปฏิบัติงานต้องติ๊กเช็คทุกข้อ)
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2 w-10 text-center">ตรวจ</th>
                    <th className="p-2">ขั้นตอนการปฏิบัติงาน</th>
                    <th className="p-2 w-32 text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-2.5 text-center">[  ]</td>
                    <td className="p-2.5">ตรวจสอบความปลอดภัย สายไฟรอบบริเวณ และตั้งกรวยจราจร</td>
                    <td className="p-2.5 text-right font-mono text-slate-400">ผ่าน / ไม่ผ่าน</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center">[  ]</td>
                    <td className="p-2.5">ถ่ายภาพป้ายก่อนปลด เพื่อบันทึกสภาพเดิม</td>
                    <td className="p-2.5 text-right font-mono text-slate-400">บันทึกภาพแล้ว</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center">[  ]</td>
                    <td className="p-2.5">ปลดผ้าไวนิล ม้วนเก็บอย่างเรียบร้อย ไม่ให้ฉีกขาด</td>
                    <td className="p-2.5 text-right font-mono text-slate-400">เก็บเรียบร้อย</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center">[  ]</td>
                    <td className="p-2.5">ตรวจเช็คสภาพโครงเหล็ก/จุดยึด ไม่ให้มีส่วนยื่นที่เป็นอันตราย</td>
                    <td className="p-2.5 text-right font-mono text-slate-400">ปลอดภัย</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center">[  ]</td>
                    <td className="p-2.5">เก็บกวาดเศษขยะ สายเคเบิลไทร์ และเศษลวดทั้งหมด</td>
                    <td className="p-2.5 text-right font-mono text-slate-400">สะอาดเรียบร้อย</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs border-t border-slate-200">
            <div className="text-center space-y-8">
              <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto" />
              <div>
                <p className="font-semibold text-slate-800">ลงชื่อช่างผู้ปฏิบัติงาน</p>
                <p className="text-[11px] text-slate-400">วันที่: ......./......./....... เวลา: ......:...... น.</p>
              </div>
            </div>

            <div className="text-center space-y-8">
              <div className="h-10 border-b border-dashed border-slate-400 w-3/4 mx-auto" />
              <div>
                <p className="font-semibold text-slate-800">ลงชื่อผู้ตรวจสอบ / ผู้รับผิดชอบ</p>
                <p className="text-[11px] text-slate-400">วันที่: ......./......./....... เวลา: ......:...... น.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
