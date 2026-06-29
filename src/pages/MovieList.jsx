import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMovieController } from '../hooks/useMovieController';
import { useAuthController } from '../hooks/useAuthController';
import { useTranslation } from '../context/TranslationContext';
import './MovieList.css';

export default function MovieList() {
  const { movies, loading, error, fetchAllMovies, removeMovie } = useMovieController();
  const { isAdmin } = useAuthController();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  const handleDelete = async (e, id, title) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm(t('deleteConfirm', { title }))) {
      try {
        await removeMovie(id);
      } catch (err) {
        alert(err.message || 'Failed to delete movie');
      }
    }
  };

  // Get unique genres for filtering
  const genres = ['All', ...new Set(movies.map((m) => m.genre).filter(Boolean))];

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          movie.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Featured Movie for Netflix Hero Banner (default: Interstellar or Inception if present)
  const featuredMovie = movies.find(m => m.title === 'Interstellar') || movies[0];

  // Group movies by genre rows for Netflix style homepage
  const sciFiMovies = movies.filter(m => m.genre === 'Sci-Fi');
  const actionMovies = movies.filter(m => m.genre === 'Action');
  const otherMovies = movies.filter(m => m.genre !== 'Sci-Fi' && m.genre !== 'Action');

  return (
    <div className="movie-list-page">
      {/* Netflix Hero Banner (only shows when not searching/filtering) */}
      {!searchTerm && selectedGenre === 'All' && featuredMovie && (
        <section 
          className="netflix-hero-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0.1) 0%, rgba(20, 20, 20, 0.9) 100%), url(${featuredMovie.image})`
          }}
        >
          <div className="hero-content">
            <span className="hero-badge">N FILM</span>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <div className="hero-meta">
              <span className="hero-rating">★ {featuredMovie.rating}</span>
              <span>{featuredMovie.releaseYear}</span>
              <span className="hero-genre">{featuredMovie.genre}</span>
            </div>
            <p className="hero-desc">{featuredMovie.description}</p>
            <div className="hero-buttons">
              <button 
                onClick={() => navigate(`/movies/${featuredMovie.id}`)} 
                className="btn-hero-play"
              >
                ▶ {t('heroPlay')}
              </button>
              <button 
                onClick={() => navigate(`/movies/${featuredMovie.id}`)} 
                className="btn-hero-info"
              >
                ⓘ {t('heroMoreInfo')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Control filters panel */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="genre-filter-wrapper">
          <label htmlFor="genre-select">{t('filterGenreLabel')}</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="genre-select"
          >
            <option value="All">{t('filterGenreAll')}</option>
            {genres.filter(g => g !== 'All').map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t('loadingList')}</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Failed to Load Movies</h3>
          <p>{error}</p>
          <button onClick={fetchAllMovies} className="btn btn-primary">
            {t('retryBtn')}
          </button>
        </div>
      )}

      {/* Movie catalog displays */}
      {!loading && !error && (
        <>
          {/* Search Result Grid View */}
          {(searchTerm || selectedGenre !== 'All') ? (
            <div className="search-results-section">
              <h2 className="row-title">{t('browseOther')}</h2>
              {filteredMovies.length === 0 ? (
                <div className="empty-state">
                  <p>{t('emptyMovies')}</p>
                  {isAdmin && (
                    <Link to="/add" className="btn btn-primary">
                      {t('navAdd')}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="movie-grid">
                  {filteredMovies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      isAdmin={isAdmin} 
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Netflix Home Page Row Layout */
            <div className="netflix-rows-container">
              {/* Row 1: Popular / All */}
              {movies.length > 0 && (
                <section className="netflix-row">
                  <h2 className="row-title">{t('browsePopular')}</h2>
                  <div className="row-posters">
                    {movies.map((movie) => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        isAdmin={isAdmin} 
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Row 2: Sci-Fi */}
              {sciFiMovies.length > 0 && (
                <section className="netflix-row">
                  <h2 className="row-title">{t('browseSciFi')}</h2>
                  <div className="row-posters">
                    {sciFiMovies.map((movie) => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        isAdmin={isAdmin} 
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Row 3: Action */}
              {actionMovies.length > 0 && (
                <section className="netflix-row">
                  <h2 className="row-title">{t('browseAction')}</h2>
                  <div className="row-posters">
                    {actionMovies.map((movie) => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        isAdmin={isAdmin} 
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Row 4: Other */}
              {otherMovies.length > 0 && (
                <section className="netflix-row">
                  <h2 className="row-title">{t('browseOther')}</h2>
                  <div className="row-posters">
                    {otherMovies.map((movie) => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie} 
                        isAdmin={isAdmin} 
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Subcomponent for Movie Card (satisfies SRP and ISP)
function MovieCard({ movie, isAdmin, handleDelete }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-link">
      <article className="movie-card">
        <div className="card-image-wrapper">
          <img
            src={movie.image || '/favicon.svg'}
            alt={movie.title}
            className="card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
            }}
          />
          <div className="card-rating">
            <span className="star">★</span> {movie.rating}
          </div>
          <span className="card-genre-tag">{movie.genre}</span>
        </div>
        <div className="card-content">
          <div className="card-meta">
            <span className="card-year">{movie.releaseYear}</span>
          </div>
          <h3 className="card-title">{movie.title}</h3>
          <p className="card-desc">
            {movie.description.length > 70
              ? `${movie.description.substring(0, 67)}...`
              : movie.description}
          </p>
          
          <div className="card-bottom">
            <div className="card-pricing">
              {movie.originalPrice && movie.originalPrice > movie.currentPrice && (
                <span className="original-price">${movie.originalPrice.toFixed(2)}</span>
              )}
              <span className="current-price">${movie.currentPrice.toFixed(2)}</span>
            </div>
            
            {isAdmin && (
              <button
                onClick={(e) => handleDelete(e, movie.id, movie.title)}
                className="btn-delete"
                aria-label={`Delete ${movie.title}`}
                title="Delete movie"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
