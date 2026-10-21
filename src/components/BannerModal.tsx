import React, { useState, useEffect } from 'react';
import { VinylBanner, BannerCategory, ChecklistItem } from '../types/vinyl';
import { PRESET_IMAGES } from '../data/defaultBanners';
import { X, Upload, Plus, Trash2, Calendar, MapPin, Calculator, Sparkles } from 'lucide-react';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (banner: VinylBanner) => void;
  editingBanner?: VinylBanner | null;
}

const COMMON_SIZES = [
  { label: 'หน้าร้าน (1.2 × 4.5 ม.)', w: 4.5, h: 1.2 },
  { label: 'งานอีเวนต์ (2.5 × 6.0 ม.)', w: 6.0, h: 2.5 },
  { label: 'คัตเอาต์เสาไฟ (1.0 × 3.0 ม.)', w: 1.0, h: 3.0 },
  { label: 'บิลบอร์ดโครงเหล็ก (6.0 × 18.0 ม.)', w: 18.0, h: 6.0 },
  { label: 'ตู้ไฟโชว์รูม (4.0 × 8.0 ม.)', w: 8.0, h: 4.0 },
];

const MATERIAL_PRESETS = [
  'ไวนิลทึบแสง Frontlit 440g พับขอบตอกตาไก่รอบด้าน',
  'ไวนิลทึบแสง Frontlit 510g พับขอบร้อยท่อเหล็กบน-ล่าง',
  'ไวนิลโปร่งแสง Backlit 510g สำหรับตู้ไฟกลางคืน',
  'ไวนิลตาข่าย Mesh ทนแรงต้านลมสูง สำหรับตึกสูง',
  'ไวนิลด้าน Matte 440g เหมาะสำหรับถ่ายภาพไม่สะท้อนแสง'
];

const ZONE_PRESETS = [
  'กรุงเทพฯ ชั้นใน',
  'กรุงเทพฯ ตะวันออก',
  'กรุงเทพฯ เหนือ',
  'กรุงเทพฯ ฝั่งธนบุรี',
  'สุขุมวิท / วัฒนา',
  'นนทบุรี',
  'ปทุมธานี',
  'สมุทรปราการ',
  'ต่างจังหวัด'
];

export const BannerModal: React.FC<BannerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBanner,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BannerCategory>('rental_ad');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('กรุงเทพฯ ชั้นใน');
  const [widthMeter, setWidthMeter] = useState(3.0);
  const [heightMeter, setHeightMeter] = useState(2.0);
  const [material, setMaterial] = useState(MATERIAL_PRESETS[0]);
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [fee, setFee] = useState(0);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES.billboard);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Default dates
  useEffect(() => {
    if (editingBanner) {
      setTitle(editingBanner.title);
      setCategory(editingBanner.category);
      setLocation(editingBanner.location);
      setZone(editingBanner.zone);
      setWidthMeter(editingBanner.widthMeter);
      setHeightMeter(editingBanner.heightMeter);
      setMaterial(editingBanner.material);
      setStartDate(editingBanner.startDate.slice(0, 16));
      setTargetDate(editingBanner.targetDate.slice(0, 16));
      setClientName(editingBanner.clientName);
      setClientPhone(editingBanner.clientPhone);
      setFee(editingBanner.fee);
      setNotes(editingBanner.notes);
      setImageUrl(editingBanner.imageUrl);
      setChecklist(editingBanner.checklist || []);
    } else {
      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
      in30Days.setHours(18, 0, 0, 0);

      // format YYYY-MM-DDTHH:mm
      const toLocalISO = (d: Date) => {
        const offset = d.getTimezoneOffset();
        const adjusted = new Date(d.getTime() - offset * 60 * 1000);
        return adjusted.toISOString().slice(0, 16);
      };

      setTitle('');
      setCategory('rental_ad');
      setLocation('');
      setZone('กรุงเทพฯ ชั้นใน');
      setWidthMeter(3.0);
      setHeightMeter(2.0);
      setMaterial(MATERIAL_PRESETS[0]);
      setStartDate(toLocalISO(now));
      setTargetDate(toLocalISO(in30Days));
      setClientName('');
      setClientPhone('');
      setFee(5000);
      setNotes('');
      setImageUrl(PRESET_IMAGES.billboard);
      setChecklist([
        { id: 'c-1', text: 'โทรแจ้งเตือนล่วงหน้า 3 วัน', done: false },
        { id: 'c-2', text: 'ประสานงานช่างปลดป้ายและรถกระเช้า', done: false },
        { id: 'c-3', text: 'ถ่ายรูปยืนยันสภาพพื้นที่หลังปลด', done: false }
      ]);
    }
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const area = (widthMeter * heightMeter).toFixed(2);

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      { id: 'c-' + Date.now(), text: newChecklistText.trim(), done: false }
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklist(checklist.filter(c => c.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !targetDate) {
      alert('กรุณากรอกชื่อป้าย สถานที่ติดตั้ง และกำหนดวันปลดป้าย');
      return;
    }

    const bannerToSave: VinylBanner = {
      id: editingBanner ? editingBanner.id : 'vb-' + Date.now(),
      title: title.trim(),
      category,
      location: location.trim(),
      zone,
      widthMeter: Number(widthMeter) || 1,
      heightMeter: Number(heightMeter) || 1,
      material,
      startDate: new Date(startDate || Date.now()).toISOString(),
      targetDate: new Date(targetDate).toISOString(),
      clientName: clientName.trim() || 'ลูกค้าทั่วไป',
      clientPhone: clientPhone.trim(),
      fee: Number(fee) || 0,
      notes: notes.trim(),
      imageUrl: imageUrl || PRESET_IMAGES.billboard,
      status: editingBanner ? editingBanner.status : 'active',
      remindDaysBefore: [7, 3, 1, 0],
      checklist,
      createdAt: editingBanner ? editingBanner.createdAt : new Date().toISOString(),
    };

    onSave(bannerToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingBanner ? 'แก้ไขข้อมูลป้ายไวนิล' : 'ลงทะเบียนป้ายไวนิลใหม่'}
            </h2>
            <p className="text-xs text-slate-500">
              ตั้งค่ากำหนดเวลานับถอยหลัง สเปกป้าย และรายการงานปลดป้าย
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              1. ข้อมูลทั่วไปและสถานที่ติดตั้ง
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ชื่อป้าย / แคมเปญ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="เช่น ป้ายโฆษณาคอนโดแยกอโศก หรือ ป้ายงานเทศกาลสงกรานต์"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ประเภทป้าย
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as BannerCategory)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="rental_ad">ป้ายโฆษณาเช่า (บิลบอร์ด)</option>
                  <option value="event">ป้ายงานอีเวนต์/กิจกรรม</option>
                  <option value="store_promo">ป้ายโปรโมชั่นหน้าร้าน</option>
                  <option value="tax_permit">ป้ายภาษี/ขออนุญาต</option>
                  <option value="production_install">คิวผลิตและติดตั้ง</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  จุดติดตั้งอย่างละเอียด <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="เช่น ทางด่วนฉลองรัช กม. 14 หรือ หน้าอาคารสาขา 1"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  โซนพื้นที่
                </label>
                <select
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {ZONE_PRESETS.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Time & Countdown Target */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              2. กำหนดเวลานับถอยหลัง (วันเริ่ม - วันปลดป้าย)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  วัน-เวลา เริ่มติดตั้ง
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                  <span>วัน-เวลา ครบกำหนดปลดป้าย / หมดสัญญา <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-amber-300 bg-amber-50/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono-numbers"
                />
              </div>
            </div>
          </div>

          {/* Specs & Dimensions */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                3. ขนาดและสเปกวัสดุผ้าไวนิล
              </h3>
              <span className="text-xs font-medium text-amber-700 font-mono-numbers bg-amber-50 px-2 py-0.5 rounded">
                พื้นที่: {area} ตร.ม.
              </span>
            </div>

            {/* Quick Size Presets */}
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SIZES.map((sz, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setWidthMeter(sz.w); setHeightMeter(sz.h); }}
                  className="px-2.5 py-1 text-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                >
                  {sz.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ความกว้าง (เมตร)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  value={widthMeter}
                  onChange={e => setWidthMeter(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ความสูง (เมตร)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  value={heightMeter}
                  onChange={e => setHeightMeter(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ชนิดวัสดุและการเก็บขอบ
                </label>
                <select
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                >
                  {MATERIAL_PRESETS.map((m, i) => (
                    <option key={i} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Client & Costs */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              4. ลูกค้า / ผู้ติดต่อ และงบประมาณ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ชื่อลูกค้า / ผู้รับผิดชอบ
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="เช่น บจก. มีเดีย หรือ คุณสมศักดิ์"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="081-xxx-xxxx"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ค่าเช่า / ค่าภาษี / ค่าผลิต (บาท)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fee}
                  onChange={e => setFee(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-numbers focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Photo & Image Choice */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              5. รูปถ่ายป้ายไวนิลจริง / ตัวอย่างกราฟิก
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-32 h-24 rounded-lg bg-slate-100 border overflow-hidden shrink-0">
                <img
                  src={imageUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setImageUrl(PRESET_IMAGES.billboard)}
                    className={`px-3 py-1.5 text-xs rounded-md border ${
                      imageUrl === PRESET_IMAGES.billboard ? 'bg-amber-100 border-amber-300 font-semibold' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    ป้ายบิลบอร์ดริมทาง
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl(PRESET_IMAGES.event)}
                    className={`px-3 py-1.5 text-xs rounded-md border ${
                      imageUrl === PRESET_IMAGES.event ? 'bg-amber-100 border-amber-300 font-semibold' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    ป้ายงานอีเวนต์
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl(PRESET_IMAGES.store)}
                    className={`px-3 py-1.5 text-xs rounded-md border ${
                      imageUrl === PRESET_IMAGES.store ? 'bg-amber-100 border-amber-300 font-semibold' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    ป้ายโปรโมชั่นหน้าร้าน
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>อัปโหลดรูปถ่ายจริงจากเครื่อง</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Checklist */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              6. รายการตรวจสอบและคิวงาน (Checklist)
            </h3>

            <div className="space-y-2">
              {checklist.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-800">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={e => setNewChecklistText(e.target.value)}
                  placeholder="เพิ่มรายการงานใหม่ เช่น เตรียมบันไดอลูมิเนียม 5 เมตร"
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklist(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddChecklist}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่ม</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-slate-200 space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="เช่น การเดินทางเข้าพื้นที่ต้องแลกบัตร, ห้ามทำงานหลัง 23:00 น., ต้องเก็บโครงเหล็กคืนลูกค้า"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              {editingBanner ? 'บันทึกการแก้ไข' : 'บันทึกและเริ่มนับถอยหลัง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
