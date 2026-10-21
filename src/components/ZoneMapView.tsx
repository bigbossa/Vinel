import React, { useState } from 'react';
import { VinylBanner } from '../types/vinyl';
import { calculateTimeRemaining, formatThaiDate } from '../utils/time';
import { CATEGORY_LABELS } from '../data/defaultBanners';
import { MapPin, Navigation, Clock, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface ZoneMapViewProps {
  banners: VinylBanner[];
  onSelectBanner: (banner: VinylBanner) => void;
  onOpenLineModal: (banner: VinylBanner) => void;
}

export const ZoneMapView: React.FC<ZoneMapViewProps> = ({
  banners,
  onSelectBanner,
  onOpenLineModal,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');

  // Extract unique zones
  const zones = Array.from(new Set(banners.map(b => b.zone || 'ทั่วไป')));

  const filteredBanners = selectedZone === 'all' 
    ? banners 
    : banners.filter(b => (b.zone || 'ทั่วไป') === selectedZone);

  // Group by zone for display
  const groupedByZone = zones.reduce((acc, z) => {
    acc[z] = banners.filter(b => (b.zone || 'ทั่วไป') === z);
    return acc;
  }, {} as Record<string, VinylBanner[]>);

  return (
    <div className="space-y-6">
      {/* Zone Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap shrink-0 flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-amber-600" />
          <span>เลือกโซน:</span>
        </span>
        <button
          type="button"
          onClick={() => setSelectedZone('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
            selectedZone === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ทุกโซน ({banners.length})
        </button>

        {zones.map(z => {
          const count = groupedByZone[z]?.length || 0;
          const urgentInZone = (groupedByZone[z] || []).filter(b => {
            const rem = calculateTimeRemaining(b.targetDate, b.startDate);
            return (rem.urgencyLevel === 'expired' || rem.urgencyLevel === 'critical') && b.status === 'active';
          }).length;

          return (
            <button
              key={z}
              type="button"
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedZone === z
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{z}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono-numbers ${
                urgentInZone > 0 ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual Zone Route Cards */}
      <div className="space-y-6">
        {(selectedZone === 'all' ? zones : [selectedZone]).map(z => {
          const zoneBanners = groupedByZone[z] || [];
          if (zoneBanners.length === 0) return null;

          return (
            <div key={z} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{z}</h3>
                  <span className="text-xs text-slate-500 font-mono-numbers">
                    ({zoneBanners.length} ป้าย)
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  วางแผนเส้นทางสายตรวจและช่างปลดป้าย
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zoneBanners.map(b => {
                  const rem = calculateTimeRemaining(b.targetDate, b.startDate);
                  const isDismantled = b.status === 'dismantled';

                  return (
                    <div 
                      key={b.id}
                      className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between transition-all ${
                        isDismantled 
                          ? 'border-slate-200 bg-slate-50 opacity-70' 
                          : rem.urgencyLevel === 'expired'
                          ? 'border-rose-200 bg-rose-50/60'
                          : rem.urgencyLevel === 'critical'
                          ? 'border-amber-200 bg-amber-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                            {b.title}
                          </h4>
                          <span className="text-[10px] shrink-0 font-mono-numbers text-slate-500">
                            {b.widthMeter}×{b.heightMeter} ม.
                          </span>
                        </div>

                        <p className="text-slate-600 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{b.location}</span>
                        </p>

                        <div className="pt-2 border-t border-slate-200/60">
                          {isDismantled ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              ปลดป้ายแล้ว
                            </span>
                          ) : rem.isExpired ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              เกินกำหนด {rem.days} วัน {rem.hours} ชม.
                            </span>
                          ) : (
                            <span className="text-slate-700 font-medium font-mono-numbers flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              เหลือ {rem.days} วัน {rem.hours} ชม. ({formatThaiDate(b.targetDate, false)})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-slate-500 text-[11px] truncate">
                          {b.clientName}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onOpenLineModal(b)}
                            className="text-emerald-700 hover:text-emerald-800 text-[11px] font-medium"
                          >
                            เตือน LINE
                          </button>
                          <span className="text-slate-300">·</span>
                          <button
                            type="button"
                            onClick={() => onSelectBanner(b)}
                            className="text-amber-700 hover:text-amber-800 text-[11px] font-medium"
                          >
                            แก้ไข
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
