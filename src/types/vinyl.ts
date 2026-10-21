export type BannerCategory = 
  | 'rental_ad'       // ป้ายโฆษณาเช่า (บิลบอร์ด / เสิมทางหลวง)
  | 'event'           // ป้ายงานอีเวนต์ & เทศกาล
  | 'store_promo'     // ป้ายโปรโมชั่นหน้าร้าน
  | 'tax_permit'      // ป้ายภาษี & ขออนุญาตเทศบาล
  | 'production_install'; // คิวสั่งผลิต & นัดติดตั้ง

export type BannerStatus = 'active' | 'dismantled' | 'extended';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface VinylBanner {
  id: string;
  title: string;
  category: BannerCategory;
  location: string;
  zone: string;
  widthMeter: number;
  heightMeter: number;
  material: string;
  startDate: string; // ISO string
  targetDate: string; // ISO string (วันปลดป้าย หรือ วันหมดอายุ)
  clientName: string;
  clientPhone: string;
  fee: number; // บาท
  notes: string;
  imageUrl: string;
  status: BannerStatus;
  remindDaysBefore: number[]; // e.g. [7, 3, 1, 0]
  checklist: ChecklistItem[];
  dismantledAt?: string;
  createdAt: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
  progressPercent: number; // 0 to 100% of time elapsed from start to target
  urgencyLevel: 'expired' | 'critical' | 'warning' | 'normal' | 'completed';
}
