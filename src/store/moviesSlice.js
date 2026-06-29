import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService } from '../services/movieService';

// Fetch all movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { rejectWithValue }) => {
    try {
      return await movieService.getAll();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch movies');
    }
  }
);

// Fetch a single movie by ID
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      return await movieService.getById(id);
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch movie with ID ${id}`);
    }
  }
);

// Add a new movie
export const addMovie = createAsyncThunk(
  'movies/addMovie',
  async (movieData, { rejectWithValue }) => {
    try {
      return await movieService.create(movieData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add movie');
    }
  }
);

// Update an existing movie
export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }, { rejectWithValue }) => {
    try {
      return await movieService.update(id, movieData);
    } catch (error) {
      return rejectWithValue(error.message || `Failed to update movie with ID ${id}`);
    }
  }
);

// Delete a movie
export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      return await movieService.delete(id);
    } catch (error) {
      return rejectWithValue(error.message || `Failed to delete movie with ID ${id}`);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    currentMovie: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Movie By ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentMovie = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Movie
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.push(action.payload);
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Movie
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
        state.movies = state.movies.map((movie) =>
          movie.id === action.payload.id ? action.payload : movie
        );
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Movie
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
        if (state.currentMovie && state.currentMovie.id === action.payload) {
          state.currentMovie = null;
        }
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMovie, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;
