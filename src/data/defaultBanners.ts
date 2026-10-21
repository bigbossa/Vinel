import { VinylBanner } from '../types/vinyl';

// Pre-generated high quality image references
export const PRESET_IMAGES = {
  billboard: '/src/assets/images/vinyl_roadside_billboard_1792574904852.jpg',
  event: '/src/assets/images/vinyl_event_banner_1792574905687.jpg',
  store: '/src/assets/images/vinyl_storefront_promo_1792574905823.jpg',
};

// Calculate base date relative to current time so timers are always live and meaningful
const now = new Date();

function addHours(hours: number): string {
  const d = new Date(now.getTime() + hours * 3600 * 1000);
  return d.toISOString();
}

function subDays(days: number): string {
  const d = new Date(now.getTime() - days * 24 * 3600 * 1000);
  return d.toISOString();
}

function addDays(days: number, hourOfDay = 17): string {
  const d = new Date(now.getTime() + days * 24 * 3600 * 1000);
  d.setHours(hourOfDay, 0, 0, 0);
  return d.toISOString();
}

export const INITIAL_BANNERS: VinylBanner[] = [
  {
    id: 'vb-001',
    title: 'ป้ายบิลบอร์ดทางด่วนฉลองรัช - โครงการคอนโดสุขุมวิท',
    category: 'rental_ad',
    location: 'ทางด่วนรามอินทรา-อาจณรงค์ ขาออก กม. 14+200',
    zone: 'กรุงเทพฯ ตะวันออก',
    widthMeter: 18.0,
    heightMeter: 6.0,
    material: 'ไวนิลทึบแสง Frontlit 510g เคลือบ UV พับขอบร้อยท่อเหล็กบน-ล่าง',
    startDate: subDays(28),
    targetDate: addHours(9), // Due today / in 9 hours!
    clientName: 'บจก. แอสเสท พลัส พร็อพเพอร์ตี้',
    clientPhone: '081-456-7890',
    fee: 45000,
    notes: 'ครบกำหนดสัญญาเช่า 1 เดือน ต้องปลดผ้าไวนิลเดิมลง หรือประสานงานต่อสัญญาภายใน 12:00 น.',
    imageUrl: PRESET_IMAGES.billboard,
    status: 'active',
    remindDaysBefore: [7, 3, 1, 0],
    checklist: [
      { id: 'c1', text: 'โทรติดต่อฝ่ายการตลาดลูกค้าแจ้งวันสิ้นสุดสัญญา', done: true },
      { id: 'c2', text: 'จองคิวรถกระเช้าและช่างปลดป้ายช่วงกลางคืน (22:00 น.)', done: false },
      { id: 'c3', text: 'ตรวจเช็คไฟสปอตไลท์ส่องป้ายตอนถอด', done: false },
    ],
    createdAt: subDays(28),
  },
  {
    id: 'vb-002',
    title: 'ป้ายไวนิลเทศกาลดนตรี River City Summer Fest',
    category: 'event',
    location: 'ลานคนเมือง ศาลาว่าการเสาชิงช้า',
    zone: 'กรุงเทพฯ ชั้นใน',
    widthMeter: 6.0,
    heightMeter: 2.5,
    material: 'ไวนิลทึบแสง 440g ตอกตาไก่ทุก 30 ซม. ผูกเชือกไนลอน',
    startDate: subDays(12),
    targetDate: addDays(2, 22), // Expiring in 2 days
    clientName: 'กองการท่องเที่ยวและกิจกรรมเมือง',
    clientPhone: '089-234-5678',
    fee: 12500,
    notes: 'งานเลิกคืนวันที่ 23 ต.ค. ต้องรีบเก็บป้ายทันทีก่อน 06:00 น. วันถัดไปเพื่อคืนพื้นที่ลาน',
    imageUrl: PRESET_IMAGES.event,
    status: 'active',
    remindDaysBefore: [3, 1, 0],
    checklist: [
      { id: 'c4', text: 'เช็คสภาพเชือกมัดตาไก่ป้องกันลมกระโชก', done: true },
      { id: 'c5', text: 'เตือนทีมรื้อถอนเตรียมถุงเก็บขยะและกรรไกรตัดสายเคเบิลไทร์', done: false },
    ],
    createdAt: subDays(12),
  },
  {
    id: 'vb-003',
    title: 'ป้ายโปรโมชั่นบรันช์สุดสัปดาห์ The Daily Bite',
    category: 'store_promo',
    location: 'กันสาดหน้าร้าน โครงการ The Commons ทองหล่อ',
    zone: 'สุขุมวิท / วัฒนา',
    widthMeter: 4.5,
    heightMeter: 1.2,
    material: 'ไวนิลด้าน Matte 440g ตอกตาไก่ 4 มุม ยึดยางยืดสปริง',
    startDate: subDays(7),
    targetDate: addDays(10, 18), // 10 days remaining
    clientName: 'คุณนภัทร (ผู้จัดการร้าน)',
    clientPhone: '086-789-0123',
    fee: 3800,
    notes: 'โปรโมชั่นตลอดเดือนตุลาคม เช็คสีป้ายไม่ให้โดนแดดเลีย',
    imageUrl: PRESET_IMAGES.store,
    status: 'active',
    remindDaysBefore: [5, 1],
    checklist: [
      { id: 'c6', text: 'ติดตั้งเรียบร้อย ถ่ายรูปส่งให้ลูกค้า', done: true },
      { id: 'c7', text: 'เช็คยอดสั่งอาหารเทียบกับป้ายโปรโมชั่น', done: true },
    ],
    createdAt: subDays(7),
  },
  {
    id: 'vb-004',
    title: 'ป้ายขออนุญาตภาษีป้ายเทศบาล - โชว์รูมยานยนต์',
    category: 'tax_permit',
    location: 'หน้าโชว์รูม ริมถนนรัตนาธิเบศร์ กม. 8',
    zone: 'นนทบุรี',
    widthMeter: 8.0,
    heightMeter: 4.0,
    material: 'ไวนิลโปร่งแสง Backlit 510g โครงตู้ไฟเหล็กกล่อง',
    startDate: subDays(360),
    targetDate: subDays(1), // EXPIRED yesterday!
    clientName: 'ฝ่ายอาคารและสถานที่ โชว์รูม',
    clientPhone: '082-999-1122',
    fee: 18400,
    notes: '🚨 เกินกำหนดชำระภาษีป้ายและยื่นต่อใบอนุญาตประจำปี! เสี่ยงถูกปรับวันละ 100 บาท รีบติดต่อเทศบาล',
    imageUrl: PRESET_IMAGES.billboard,
    status: 'active',
    remindDaysBefore: [30, 15, 7, 1, 0],
    checklist: [
      { id: 'c8', text: 'เตรียมเอกสาร ภ.ป.1 สำเนาโฉนดที่ดิน', done: true },
      { id: 'c9', text: 'ชำระค่าธรรมเนียมและสติกเกอร์ภาษีป้ายใหม่', done: false },
    ],
    createdAt: subDays(360),
  },
  {
    id: 'vb-005',
    title: 'คิวติดตั้งป้ายไวนิลโครงสร้างใหม่ สี่แยกเกษตร-นวมินทร์',
    category: 'production_install',
    location: 'ตอม่อสะพานข้ามแยกเกษตร เสาที่ 42-43',
    zone: 'กรุงเทพฯ เหนือ',
    widthMeter: 12.0,
    heightMeter: 4.0,
    material: 'ไวนิลตาข่าย Mesh ทนแรงต้านลมสูง พร้อมโครงทรัส',
    startDate: now.toISOString(),
    targetDate: addDays(4, 9), // 4 days remaining for scheduled install
    clientName: 'บจก. มีเดีย พลัส เน็ตเวิร์ค',
    clientPhone: '084-555-8822',
    fee: 32000,
    notes: 'พิมพ์เสร็จแล้ว อยู่ระหว่างส่งต่อให้ทีมช่างโครงสร้างขึ้นติดตั้งวันที่ 25 ต.ค.',
    imageUrl: PRESET_IMAGES.billboard,
    status: 'active',
    remindDaysBefore: [2, 1, 0],
    checklist: [
      { id: 'c10', text: 'ตรวจสอบขนาดงานพิมพ์จริงหน้าโรงงาน (12x4 ม.)', done: true },
      { id: 'c11', text: 'ประสานงานขออนุญาตปิดเบี่ยงเลนจราจร 1 ช่อง', done: false },
    ],
    createdAt: now.toISOString(),
  },
  {
    id: 'vb-006',
    title: 'ป้ายประชาสัมพันธ์เทศกาลกินเจ 2569 ซอยเยาวราช',
    category: 'event',
    location: 'ซุ้มประตูเฉลิมพระเกียรติ วงเวียนโอเดียน',
    zone: 'กรุงเทพฯ ชั้นใน',
    widthMeter: 8.0,
    heightMeter: 2.0,
    material: 'ไวนิล 440g ตอกตาไก่รอบด้าน',
    startDate: subDays(20),
    targetDate: subDays(3),
    clientName: 'คณะกรรมการจัดงานเทศกาลเจเยาวราช',
    clientPhone: '02-225-8899',
    fee: 8500,
    notes: 'ปลดป้ายเรียบร้อยแล้วเมื่อวันที่ 18 ต.ค. นำโครงเหล็กเข้าคลังสินค้า',
    imageUrl: PRESET_IMAGES.event,
    status: 'dismantled',
    dismantledAt: subDays(3),
    remindDaysBefore: [1, 0],
    checklist: [
      { id: 'c12', text: 'ปลดป้ายและม้วนเก็บลงกล่อง', done: true },
      { id: 'c13', text: 'ถ่ายรูปส่งยืนยันปิดงาน', done: true },
    ],
    createdAt: subDays(20),
  }
];

export const CATEGORY_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  rental_ad: {
    label: 'ป้ายโฆษณาเช่า',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    desc: 'ป้ายบิลบอร์ด / เสาข้างทางหลวง สัญญาเช่ารายเดือน/รายปี'
  },
  event: {
    label: 'ป้ายงานอีเวนต์/กิจกรรม',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    desc: 'งานเทศกาล งานวัด นิทรรศการ ต้องปลดเมื่อจบงาน'
  },
  store_promo: {
    label: 'ป้ายโปรโมชั่นหน้าร้าน',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    desc: 'แคมเปญลดราคา เมนูใหม่ หรือฉลองเปิดสาขา'
  },
  tax_permit: {
    label: 'ป้ายภาษี/ขออนุญาต',
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    desc: 'ป้ายที่ต้องยื่นต่ออายุภาษีป้ายหรือใบอนุญาตเทศบาลทุกปี'
  },
  production_install: {
    label: 'คิวผลิตและติดตั้ง',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    desc: 'คิวงานโรงพิมพ์และนัดหมายส่งมอบ/ขึ้นป้าย'
  }
};
