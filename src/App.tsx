/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VinylBanner } from './types/vinyl';
import { INITIAL_BANNERS } from './data/defaultBanners';
import { calculateTimeRemaining } from './utils/time';
import { playChime } from './utils/audio';

import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { CountdownCard } from './components/CountdownCard';
import { TableView } from './components/TableView';
import { ZoneMapView } from './components/ZoneMapView';
import { BannerModal } from './components/BannerModal';
import { LineReminderModal } from './components/LineReminderModal';
import { PrintWorkOrderModal } from './components/PrintWorkOrderModal';

import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Plus, 
  RotateCcw, 
  Layers,
  Clock,
  CheckCircle2,
  BellRing
} from 'lucide-react';

const STORAGE_KEY = 'vinylguard_banners_v1';

export default function App() {
  const [banners, setBanners] = useState<VinylBanner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_BANNERS;
  });

  const [currentTab, setCurrentTab] = useState<'grid' | 'urgent' | 'zones' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'urgent' | 'dismantled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<VinylBanner | null>(null);
  const [lineModalBanner, setLineModalBanner] = useState<VinylBanner | null>(null);
  const [printModalBanner, setPrintModalBanner] = useState<VinylBanner | null>(null);

  // Live real-time tick (every 1 second)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    } catch {
      // Ignore quota errors
    }
  }, [banners]);

  // Urgent count calculation
  const urgentCount = banners.filter(b => {
    if (b.status !== 'active') return false;
    const rem = calculateTimeRemaining(b.targetDate, b.startDate);
    return rem.urgencyLevel === 'expired' || rem.urgencyLevel === 'critical';
  }).length;

  // Handlers
  const handleSaveBanner = (saved: VinylBanner) => {
    setBanners(prev => {
      const idx = prev.findIndex(b => b.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    if (soundEnabled) playChime('success');
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการป้ายไวนิลนี้ใช่หรือไม่?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      if (soundEnabled) playChime('click');
    }
  };

  const handleToggleChecklist = (bannerId: string, itemId: string) => {
    setBanners(prev => prev.map(b => {
      if (b.id !== bannerId) return b;
      return {
        ...b,
        checklist: b.checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c)
      };
    }));
    if (soundEnabled) playChime('click');
  };

  const handleMarkDismantled = (id: string) => {
    setBanners(prev => prev.map(b => {
      if (b.id !== id) return b;
      return {
        ...b,
        status: 'dismantled',
        dismantledAt: new Date().toISOString()
      };
    }));
    if (soundEnabled) playChime('success');
  };

  const handleExtendDays = (id: string, days: number) => {
    setBanners(prev => prev.map(b => {
      if (b.id !== id) return b;
      const currentTarget = new Date(b.targetDate).getTime();
      const newTarget = new Date(currentTarget + days * 24 * 3600 * 1000).toISOString();
      return {
        ...b,
        targetDate: newTarget,
        status: 'active'
      };
    }));
    if (soundEnabled) playChime('success');
  };

  const handleResetData = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลเป็นชุดตัวอย่างเริ่มต้นใช่หรือไม่?')) {
      setBanners(INITIAL_BANNERS);
      localStorage.removeItem(STORAGE_KEY);
      if (soundEnabled) playChime('success');
    }
  };

  // Filter logic
  const filteredBanners = banners.filter(b => {
    const rem = calculateTimeRemaining(b.targetDate, b.startDate);

    // Tab-level restriction
    if (currentTab === 'urgent') {
      if (b.status === 'dismantled') return false;
      if (rem.urgencyLevel !== 'expired' && rem.urgencyLevel !== 'critical' && rem.urgencyLevel !== 'warning') {
        return false;
      }
    }

    // Status filter
    if (statusFilter === 'active' && b.status !== 'active') return false;
    if (statusFilter === 'dismantled' && b.status !== 'dismantled') return false;
    if (statusFilter === 'urgent') {
      if (b.status === 'dismantled') return false;
      if (rem.urgencyLevel !== 'expired' && rem.urgencyLevel !== 'critical') return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchLoc = b.location.toLowerCase().includes(q);
      const matchZone = b.zone.toLowerCase().includes(q);
      const matchClient = b.clientName.toLowerCase().includes(q);
      const matchPhone = b.clientPhone.includes(q);
      if (!matchTitle && !matchLoc && !matchZone && !matchClient && !matchPhone) return false;
    }

    return true;
  });

  // Sort by urgency: expired & critical first, then warning, then normal, dismantled last
  const sortedBanners = [...filteredBanners].sort((a, b) => {
    if (a.status === 'dismantled' && b.status !== 'dismantled') return 1;
    if (a.status !== 'dismantled' && b.status === 'dismantled') return -1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewModal={() => { setEditingBanner(null); setIsBannerModalOpen(true); }}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        urgentCount={urgentCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Urgent Alert Banner (shown when expired or due today items exist) */}
        {urgentCount > 0 && currentTab !== 'urgent' && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-900 leading-tight">
                  มีป้ายไวนิล {urgentCount} ป้าย ที่เกินกำหนดหรือต้องปลดป้ายภายในวันนี้!
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  โปรดประสานงานทีมช่าง หรือติดต่อลูกค้าเพื่อต่อสัญญาเช่าโดยด่วน
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('urgent')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors shrink-0 whitespace-nowrap"
            >
              ดูรายการด่วนทั้งหมด ({urgentCount})
            </button>
          </div>
        )}

        {/* Operational Statistics Bar */}
        <StatsBar
          banners={banners}
          onSelectUrgent={() => { setCurrentTab('urgent'); setStatusFilter('urgent'); }}
          onSelectNormal={() => { setCurrentTab('grid'); setStatusFilter('active'); }}
          onSelectDismantled={() => { setCurrentTab('grid'); setStatusFilter('dismantled'); }}
          activeFilter={statusFilter}
        />

        {/* Interactive Controls & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อป้าย, สถานที่, โซน, หรือชื่อลูกค้า..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>

          {/* Status Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ทั้งหมด ({banners.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'active'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              กำลังจัดแสดง ({banners.filter(b => b.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('urgent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                statusFilter === 'urgent'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              <span>ด่วน / เกินกำหนด</span>
              {urgentCount > 0 && (
                <span className="text-[10px] px-1 bg-white/20 rounded font-mono-numbers">
                  {urgentCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('dismantled')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === 'dismantled'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ปลดแล้ว ({banners.filter(b => b.status === 'dismantled').length})
            </button>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg py-1.5 px-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 shrink-0"
            >
              <option value="all">ทุกประเภทป้าย</option>
              <option value="rental_ad">ป้ายโฆษณาเช่า (บิลบอร์ด)</option>
              <option value="event">ป้ายงานอีเวนต์/กิจกรรม</option>
              <option value="store_promo">ป้ายโปรโมชั่นหน้าร้าน</option>
              <option value="tax_permit">ป้ายภาษี/ขออนุญาต</option>
              <option value="production_install">คิวผลิตและติดตั้ง</option>
            </select>
          </div>
        </div>

        {/* View Routing */}
        {currentTab === 'table' ? (
          <TableView
            banners={sortedBanners}
            onEdit={banner => { setEditingBanner(banner); setIsBannerModalOpen(true); }}
            onDelete={handleDeleteBanner}
            onMarkDismantled={handleMarkDismantled}
            onExtendDays={handleExtendDays}
            onOpenLineModal={banner => setLineModalBanner(banner)}
            onOpenPrintModal={banner => setPrintModalBanner(banner)}
          />
        ) : currentTab === 'zones' ? (
          <ZoneMapView
            banners={sortedBanners}
            onSelectBanner={banner => { setEditingBanner(banner); setIsBannerModalOpen(true); }}
            onOpenLineModal={banner => setLineModalBanner(banner)}
          />
        ) : (
          /* Grid View (Standard and Urgent Tab) */
          <div>
            {currentTab === 'urgent' && (
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>คิวงานเร่งด่วน: ป้ายที่เกินกำหนดหรือต้องปลดป้ายภายใน 3 วัน</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    เรียงตามลำดับเวลาที่เหลือน้อยที่สุด เพื่อให้ทีมงานจัดเตรียมรถกระเช้าและเครื่องมือได้ทันเวลา
                  </p>
                </div>
              </div>
            )}

            {sortedBanners.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-800">
                    ไม่พบรายการป้ายไวนิล
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง'
                      : 'เริ่มลงทะเบียนป้ายไวนิลแผ่นแรกเพื่อเริ่มต้นระบบนับถอยหลังเตือนความจำ'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingBanner(null); setIsBannerModalOpen(true); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มป้ายไวนิล</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedBanners.map(banner => (
                  <CountdownCard
                    key={banner.id}
                    banner={banner}
                    currentTime={currentTime}
                    onEdit={b => { setEditingBanner(b); setIsBannerModalOpen(true); }}
                    onDelete={handleDeleteBanner}
                    onToggleChecklist={handleToggleChecklist}
                    onMarkDismantled={handleMarkDismantled}
                    onExtendDays={handleExtendDays}
                    onOpenLineModal={b => setLineModalBanner(b)}
                    onOpenPrintModal={b => setPrintModalBanner(b)}
                    playChimeSound={() => playChime('success')}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">VinylGuard</span>
            <span>·</span>
            <span>ระบบนับถอยหลังเตือนความจำป้ายไวนิลและการจัดการคิวปลดป้าย</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResetData}
              className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าข้อมูลตัวอย่าง</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={() => { setIsBannerModalOpen(false); setEditingBanner(null); }}
        onSave={handleSaveBanner}
        editingBanner={editingBanner}
      />

      <LineReminderModal
        banner={lineModalBanner}
        onClose={() => setLineModalBanner(null)}
      />

      <PrintWorkOrderModal
        banner={printModalBanner}
        onClose={() => setPrintModalBanner(null)}
      />
    </div>
  );
}
