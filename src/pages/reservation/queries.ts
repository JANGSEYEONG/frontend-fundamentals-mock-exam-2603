import { queryOptions } from '@tanstack/react-query';
import { getMyReservations, getReservations, getRooms } from 'pages/remotes';

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
  });

export const reservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
  });

export const myReservationsQueryOptions = () =>
  queryOptions({
    queryKey: ['myReservations'],
    queryFn: () => getMyReservations(),
  });
