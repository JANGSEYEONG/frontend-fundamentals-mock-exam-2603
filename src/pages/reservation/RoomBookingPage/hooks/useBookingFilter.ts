import { format } from 'date-fns';
import { createParser, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { BookingFilter } from '../RoomBookingPage.schema';

const parseAsCommaSeparatedArray = createParser({
  parse: (value: string) => value.split(',').filter(Boolean),
  serialize: (value: string[]) => value.join(','),
});

const bookingFilterParsers = {
  date: parseAsString.withDefault(format(new Date(), 'yyyy-MM-dd')),
  startTime: parseAsString.withDefault(''),
  endTime: parseAsString.withDefault(''),
  attendees: parseAsInteger.withDefault(1),
  equipment: parseAsCommaSeparatedArray.withDefault([]),
  floor: parseAsInteger,
};

export function useBookingFilter(): [BookingFilter, (patch: Partial<BookingFilter>) => void] {
  const [queryState, setQueryState] = useQueryStates(bookingFilterParsers, {
    history: 'replace',
  });

  const bookingFilter = {
    date: queryState.date,
    startTime: queryState.startTime,
    endTime: queryState.endTime,
    attendees: queryState.attendees,
    equipment: queryState.equipment,
    floor: queryState.floor,
  };

  const setBookingFilter = (patch: Partial<BookingFilter>) => {
    setQueryState(patch);
  };

  return [bookingFilter, setBookingFilter];
}
