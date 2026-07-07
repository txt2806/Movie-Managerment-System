import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, addBooking, clearBookingError } from '../store/bookingsSlice';

export function useBookingController() {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  const fetchAllBookings = useCallback(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const createBooking = useCallback(async (bookingData) => {
    const result = await dispatch(addBooking(bookingData));
    if (addBooking.rejected.match(result)) {
      throw new Error(result.payload || 'Failed to create booking');
    }
    return result.payload;
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearBookingError());
  }, [dispatch]);

  return {
    bookings,
    loading,
    error,
    fetchAllBookings,
    createBooking,
    clearErrors
  };
}
