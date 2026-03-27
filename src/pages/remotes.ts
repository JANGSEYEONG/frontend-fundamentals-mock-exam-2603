import { http } from 'pages/http';
import { Reservation, Room } from './reservation/models';
import { AxiosError } from 'axios';

export async function getRooms() {
  return http.get<Room[]>('/api/rooms');
}

export async function getReservations(date: string) {
  return http.get<Reservation[]>(`/api/reservations?date=${date}`);
}

export async function createReservation(data: Omit<Reservation, 'id'>) {
  const result = await http.post<typeof data, { ok: boolean; reservation?: unknown; code?: string; message?: string }>(
    '/api/reservations',
    data
  );
  if (!result.ok) {
    throw new Error(result.message ?? '예약에 실패했습니다.');
  }
  return result;
}

export async function getMyReservations() {
  return http.get<Reservation[]>('/api/my-reservations');
}

export async function cancelReservation(id: string) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}
