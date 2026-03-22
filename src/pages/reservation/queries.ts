import { queryOptions } from '@tanstack/react-query';
import { getMyReservations, getReservations, getRooms } from 'pages/remotes';

export const getRoomsQueryOptions = () =>
  queryOptions({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
  });

export const getReservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
  });

export const getMyReservationsQueryOptions = () =>
  queryOptions({
    queryKey: ['myReservations'],
    queryFn: () => getMyReservations(),
  });
