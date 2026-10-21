import React from 'react';
import { Plus, Volume2, VolumeX, Bell } from 'lucide-react';

interface HeaderProps {
  currentTab: 'grid' | 'urgent' | 'zones' | 'table';
  setCurrentTab: (tab: 'grid' | 'urgent' | 'zones' | 'table') => void;
  onOpenNewModal: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewModal,
  soundEnabled,
  setSoundEnabled,
  urgentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('grid')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors whitespace-nowrap">
                VinylGuard
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-400">|</span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 whitespace-nowrap">
              ระบบนับถอยหลังเตือนความจำป้ายไวนิล
            </span>
          </div>

          {/* Zone 2: 4 single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('grid')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'grid'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              ภาพรวมนับถอยหลัง
            </button>

            <button
              onClick={() => setCurrentTab('urgent')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'urgent'
                  ? 'border-rose-600 text-rose-600 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <span>คิวปลดป้ายด่วน</span>
              {urgentCount > 0 && (
                <span className="text-xs px-1.5 py-0.2 font-mono-numbers bg-rose-100 text-rose-700 rounded">
                  {urgentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('zones')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'zones'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              พื้นที่และโซนติดตั้ง
            </button>

            <button
              onClick={() => setCurrentTab('table')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                currentTab === 'table'
                  ? 'border-amber-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              ตารางข้อมูลป้าย
            </button>
          </nav>

          {/* Zone 3: Primary action + sound switch */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'ปิดเสียงเตือน' : 'เปิดเสียงเตือน'}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มป้ายไวนิล</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('grid')}
            className={`px-2 py-1 rounded ${currentTab === 'grid' ? 'text-amber-700 bg-amber-50 font-semibold' : 'text-slate-600'}`}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => setCurrentTab('urgent')}
            className={`px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'urgent' ? 'text-rose-700 bg-rose-50 font-semibold' : 'text-slate-600'}`}
          >
            <span>คิวด่วน</span>
            {urgentCount > 0 && (
              <span className="text-[10px] px-1 bg-rose-200 text-rose-800 rounded font-mono-numbers">
                {urgentCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('zones')}
            className={`px-2 py-1 rounded ${currentTab === 'zones' ? 'text-amber-700 bg-amber-50 font-semibold' : 'text-slate-600'}`}
          >
            โซนพื้นที่
          </button>
          <button
            onClick={() => setCurrentTab('table')}
            className={`px-2 py-1 rounded ${currentTab === 'table' ? 'text-amber-700 bg-amber-50 font-semibold' : 'text-slate-600'}`}
          >
            ตาราง
          </button>
        </div>
      </div>
    </header>
  );
};
