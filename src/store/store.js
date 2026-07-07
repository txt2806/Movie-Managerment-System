import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './moviesSlice';
import bookingsReducer from './bookingsSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    bookings: bookingsReducer,
  },
});
