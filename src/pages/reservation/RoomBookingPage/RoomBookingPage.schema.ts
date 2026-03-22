import { z } from 'zod';
import qs from 'qs';

export const bookingFilterSchema = z.object({
  date: z.string().default(''),
  startTime: z.string().default(''),
  endTime: z.string().default(''),
  attendees: z.coerce.number().int().min(1).default(1),
  equipment: z.union([z.string().transform(v => v.split(',').filter(Boolean)), z.array(z.string())]).default([]),
  floor: z
    .union([z.literal('').transform(() => null), z.coerce.number().int()])
    .nullable()
    .default(null),
});

export type BookingFilter = z.output<typeof bookingFilterSchema>;

export function parseFilterFromQs(search: string): BookingFilter {
  const raw = qs.parse(search, { ignoreQueryPrefix: true });
  return bookingFilterSchema.parse(raw);
}

export function stringifyFilterToQs(filter: BookingFilter): string {
  const params: Record<string, string> = {};

  if (filter.date) params.date = filter.date;
  if (filter.startTime) params.startTime = filter.startTime;
  if (filter.endTime) params.endTime = filter.endTime;
  if (filter.attendees > 1) params.attendees = String(filter.attendees);
  if (filter.equipment.length > 0) params.equipment = filter.equipment.join(',');
  if (filter.floor != null) params.floor = String(filter.floor);

  return qs.stringify(params);
}
