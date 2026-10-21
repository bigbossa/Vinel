import React from 'react';
import { VinylBanner } from '../types/vinyl';
import { calculateTimeRemaining } from '../utils/time';
import { AlertCircle, Clock, Layers, DollarSign, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  banners: VinylBanner[];
  onSelectUrgent: () => void;
  onSelectNormal: () => void;
  onSelectDismantled: () => void;
  activeFilter: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  banners,
  onSelectUrgent,
  onSelectNormal,
  onSelectDismantled,
  activeFilter,
}) => {
  const activeBanners = banners.filter(b => b.status === 'active');
  const dismantledBanners = banners.filter(b => b.status === 'dismantled');

  let expiredOrTodayCount = 0;
  let warningCount = 0;
  let totalArea = 0;
  let totalValue = 0;

  activeBanners.forEach(b => {
    const rem = calculateTimeRemaining(b.targetDate, b.startDate);
    if (rem.urgencyLevel === 'expired' || rem.urgencyLevel === 'critical') {
      expiredOrTodayCount++;
    } else if (rem.urgencyLevel === 'warning') {
      warningCount++;
    }
    totalArea += b.widthMeter * b.heightMeter;
    totalValue += b.fee;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Total Active */}
      <div 
        onClick={onSelectNormal}
        className={`p-3.5 rounded-xl border bg-white transition-all cursor-pointer ${
          activeFilter === 'active' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>ป้ายที่กำลังแสดง</span>
          <Layers className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold font-mono-numbers text-slate-900 leading-none">
          {activeBanners.length}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">จากทั้งหมด {banners.length} ป้าย</div>
      </div>

      {/* 2. Urgent / Expired */}
      <div 
        onClick={onSelectUrgent}
        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
          expiredOrTodayCount > 0 
            ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300' 
            : 'bg-white border-slate-200'
        } ${activeFilter === 'urgent' ? 'ring-1 ring-rose-500' : ''}`}
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <span className={expiredOrTodayCount > 0 ? 'text-rose-700 font-medium' : 'text-slate-500'}>
            ต้องปลดด่วน / เกินกำหนด
          </span>
          <AlertCircle className={`w-4 h-4 ${expiredOrTodayCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
        </div>
        <div className={`text-2xl font-bold font-mono-numbers leading-none ${expiredOrTodayCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
          {expiredOrTodayCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">หมดอายุแล้ว หรือครบวันนี้</div>
      </div>

      {/* 3. Approaching in 1-3 Days */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>ใกล้ครบกำหนด (1-3 วัน)</span>
          <Clock className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold font-mono-numbers text-amber-600 leading-none">
          {warningCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">เตรียมจัดคิวช่างปลดป้าย</div>
      </div>

      {/* 4. Total Area sq.m. */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>พื้นที่ไวนิลรวม</span>
          <span className="text-[10px] text-slate-400 font-mono">ตร.ม.</span>
        </div>
        <div className="text-2xl font-bold font-mono-numbers text-slate-900 leading-none">
          {totalArea.toFixed(1)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">เฉลี่ย {(totalArea / Math.max(1, activeBanners.length)).toFixed(1)} ตร.ม./ป้าย</div>
      </div>

      {/* 5. Total Dismantled / Archived */}
      <div 
        onClick={onSelectDismantled}
        className={`col-span-2 lg:col-span-1 p-3.5 rounded-xl border bg-white transition-all cursor-pointer ${
          activeFilter === 'dismantled' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>ปลดเสร็จสิ้นแล้ว</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold font-mono-numbers text-emerald-700 leading-none">
          {dismantledBanners.length}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">ประวัติงานที่ส่งมอบแล้ว</div>
      </div>
    </div>
  );
};
