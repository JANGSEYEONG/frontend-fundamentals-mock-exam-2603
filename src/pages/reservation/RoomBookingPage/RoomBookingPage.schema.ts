import { format } from 'date-fns';
import { z } from 'zod';

export const bookingFilterSchema = z.object({
  date: z.string().default(format(new Date(), 'yyyy-MM-dd')),
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
