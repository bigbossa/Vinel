import { VinylBanner, TimeRemaining } from '../types/vinyl';

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export function formatThaiDate(isoString: string, includeTime = true): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';

  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear() + 543; // Buddhist Era
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (includeTime) {
    return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
  }
  return `${day} ${month} ${year}`;
}

export function formatThaiDateShort(isoString: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '-';
  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const year = (d.getFullYear() + 543).toString().slice(-2);
  return `${day} ${month} ${year}`;
}

export function calculateTimeRemaining(targetIso: string, startIso?: string): TimeRemaining {
  const now = new Date().getTime();
  const target = new Date(targetIso).getTime();
  const start = startIso ? new Date(startIso).getTime() : target - 30 * 24 * 3600 * 1000;

  const diffMs = target - now;
  const isExpired = diffMs <= 0;
  const totalSeconds = Math.max(0, Math.floor(Math.abs(diffMs) / 1000));

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Calculate elapsed percentage of lifecycle
  const totalDurationMs = Math.max(1, target - start);
  const elapsedMs = Math.max(0, Math.min(totalDurationMs, now - start));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));

  // Urgency classification
  let urgencyLevel: TimeRemaining['urgencyLevel'] = 'normal';
  if (isExpired) {
    urgencyLevel = 'expired';
  } else if (days === 0 && hours < 24) {
    urgencyLevel = 'critical'; // Due today / within 24 hours
  } else if (days <= 3) {
    urgencyLevel = 'warning'; // 1-3 days left
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired,
    totalSeconds,
    progressPercent,
    urgencyLevel,
  };
}

export function generateLineMessage(banner: VinylBanner, timeRem: TimeRemaining): string {
  const area = (banner.widthMeter * banner.heightMeter).toFixed(1);
  const formattedTarget = formatThaiDate(banner.targetDate);
  
  let countdownText = '';
  if (banner.status === 'dismantled') {
    countdownText = '✅ ป้ายนี้ทำการปลดเรียบร้อยแล้ว';
  } else if (timeRem.isExpired) {
    countdownText = `🚨 เกินกำหนดปลดป้ายแล้ว (${timeRem.days} วัน ${timeRem.hours} ชม.) กรุณาดำเนินการทันที!`;
  } else if (timeRem.days === 0) {
    countdownText = `⚠️ ครบกำหนดวันนี้! เหลือเวลาอีก ${timeRem.hours} ชม. ${timeRem.minutes} นาที`;
  } else {
    countdownText = `⏳ เหลือเวลาอีก: ${timeRem.days} วัน ${timeRem.hours} ชม.`;
  }

  return `[แจ้งเตือนกำหนดการป้ายไวนิล - VinylGuard]
🏷️ ชื่อป้าย: ${banner.title}
📍 สถานที่: ${banner.location} (โซน: ${banner.zone})
📐 ขนาด: ${banner.widthMeter} × ${banner.heightMeter} ม. (${area} ตร.ม.)
🗓️ กำหนดปลดป้าย: ${formattedTarget}
${countdownText}
👤 ผู้ติดต่อ/ลูกค้า: ${banner.clientName} (โทร: ${banner.clientPhone || '-'})
📝 หมายเหตุ: ${banner.notes || '-'}`;
}

export function downloadCalendarEvent(banner: VinylBanner) {
  const d = new Date(banner.targetDate);
  const pad = (n: number) => String(n).padStart(2, '0');
  
  // Format YYYYMMDDTHHMMSSZ
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtStart = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const endD = new Date(d.getTime() + 2 * 3600 * 1000); // 2 hours
  const dtEnd = endD.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const title = `[ปลดป้ายไวนิล] ${banner.title}`;
  const description = `กำหนดปลดป้าย/หมดอายุสัญญา: ${banner.title}\\nสถานที่: ${banner.location}\\nขนาด: ${banner.widthMeter}x${banner.heightMeter} ม.\\nลูกค้า: ${banner.clientName} (${banner.clientPhone})`;
  const location = banner.location;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VinylGuard//Vinyl Banner Reminder//TH',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${banner.id}@vinylguard.app`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:เตือนล่วงหน้า 1 วัน: ปลดป้ายไวนิล',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `vinyl-reminder-${banner.id.slice(0, 8)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
