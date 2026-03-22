export const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};
export const ALL_EQUIPMENT = Object.keys(EQUIPMENT_LABELS);

export const TIME_SLOTS: string[] = [];
for (let h = 9; h <= 20; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 20) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
  }
}
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));
export const TIMELINE_START = 9;
export const TIMELINE_END = 20;
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}
