import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMovies, 
  fetchMovieById, 
  addMovie, 
  updateMovie, 
  deleteMovie,
  clearCurrentMovie
} from '../store/moviesSlice';

export function useMovieController() {
  const dispatch = useDispatch();
  const { movies, currentMovie, loading, error } = useSelector((state) => state.movies);

  const fetchAllMovies = useCallback(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const fetchMovieDetail = useCallback((id) => {
    dispatch(fetchMovieById(id));
  }, [dispatch]);

  const createMovie = useCallback(async (movieData) => {
    const result = await dispatch(addMovie(movieData));
    if (addMovie.rejected.match(result)) {
      throw new Error(result.payload || 'Failed to create movie');
    }
    return result.payload;
  }, [dispatch]);

  const editMovie = useCallback(async (id, movieData) => {
    const result = await dispatch(updateMovie({ id, movieData }));
    if (updateMovie.rejected.match(result)) {
      throw new Error(result.payload || 'Failed to update movie');
    }
    return result.payload;
  }, [dispatch]);

  const removeMovie = useCallback(async (id) => {
    const result = await dispatch(deleteMovie(id));
    if (deleteMovie.rejected.match(result)) {
      throw new Error(result.payload || 'Failed to delete movie');
    }
    return result.payload;
  }, [dispatch]);

  const resetCurrentMovie = useCallback(() => {
    dispatch(clearCurrentMovie());
  }, [dispatch]);

  return {
    movies,
    currentMovie,
    loading,
    error,
    fetchAllMovies,
    fetchMovieDetail,
    createMovie,
    editMovie,
    removeMovie,
    resetCurrentMovie
  };
}
