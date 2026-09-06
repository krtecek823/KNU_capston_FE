import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Hotel, BookingRecord } from '../types';

export const HOTEL_QUERY_KEYS = {
  all: ['hotels'] as const,
  list: (query?: string) => ['hotels', 'list', query || ''] as const,
  detail: (id: string) => ['hotels', 'detail', id] as const,
  bookings: (email?: string) => ['bookings', email || ''] as const,
};

export const useHotels = (searchQuery?: string) => {
  return useQuery<Hotel[]>({
    queryKey: HOTEL_QUERY_KEYS.list(searchQuery),
    queryFn: () => api.getHotels(searchQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes caching
    gcTime: 10 * 60 * 1000, // 10 minutes memory retention
  });
};

export const useHotelDetail = (hotelId: string) => {
  return useQuery<Hotel | null>({
    queryKey: HOTEL_QUERY_KEYS.detail(hotelId),
    queryFn: async () => {
      const res = await api.getHotelById(hotelId);
      return res || null;
    },
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBookings = (userEmail?: string) => {
  return useQuery<BookingRecord[]>({
    queryKey: HOTEL_QUERY_KEYS.bookings(userEmail),
    queryFn: () => api.getBookings(userEmail),
    enabled: !!userEmail,
    staleTime: 1 * 60 * 1000,
  });
};
