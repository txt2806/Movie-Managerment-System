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
                onClick={() => navigate(`/booking/${featuredMovie.id}`)} 
                className="btn-hero-play"
              >
                🎟️ {t('heroPlay')}
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

      {/* Category Gradient Row (Bạn đang quan tâm gì?) */}
      {!searchTerm && selectedGenre === 'All' && (
        <section className="interest-section">
          <h2 className="interest-section-title">Bạn đang quan tâm gì?</h2>
          <div className="interest-cards-grid">
            <button 
              type="button" 
              onClick={() => setSelectedGenre('Sci-Fi')} 
              className="interest-card card-scifi"
            >
              <h3>Viễn Tưởng</h3>
              <span>Xem chủ đề ›</span>
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedGenre('Action')} 
              className="interest-card card-action"
            >
              <h3>Hành Động</h3>
              <span>Xem chủ đề ›</span>
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedGenre('Thriller')} 
              className="interest-card card-thriller"
            >
              <h3>Kinh Dị</h3>
              <span>Xem chủ đề ›</span>
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedGenre('Animation')} 
              className="interest-card card-animation"
            >
              <h3>Hoạt Hình</h3>
              <span>Xem chủ đề ›</span>
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedGenre('Drama')} 
              className="interest-card card-drama"
            >
              <h3>Cổ Trang</h3>
              <span>Xem chủ đề ›</span>
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedGenre('Adventure')} 
              className="interest-card card-adventure"
            >
              <h3>Chiến Tranh</h3>
              <span>Xem chủ đề ›</span>
            </button>
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
  const navigate = useNavigate();
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem(`liked_${movie.id}`);
    return saved === 'true';
  });

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(`liked_${movie.id}`, String(newLiked));
  };

  // Vietnamese subtitle lookup for authentic look matching reference
  const vnSubtitles = {
    "1": "Kẻ Kiến Tạo Giấc Mơ",
    "2": "Kỵ Sĩ Bóng Đêm",
    "3": "Hố Đen Tử Thần",
    "4": "Ký Sinh Trùng",
    "5": "Vùng Đất Linh Hồn",
    "6": "Ma Trận",
    "7": "Dòng Chảy Của Nước",
    "8": "Hành Trình Django"
  };
  const subTitle = vnSubtitles[movie.id] || movie.title;

  // Extended genres for dot-separated list matching reference
  const genreMap = {
    "Sci-Fi": "Khoa Học • Viễn Tưởng • Kịch Tính",
    "Action": "Hành Động • Phiêu Lưu • Kịch Tính",
    "Thriller": "Gây Cấn • Kinh Dị • Tâm Lý",
    "Animation": "Hoạt Hình • Phiêu Lưu • Gia Đình",
    "Adventure": "Phiêu Lưu • Giả Tưởng • Hành Động",
    "Drama": "Chính Kịch • Tâm Lý • Cổ Điển"
  };
  const dotGenres = genreMap[movie.genre] || `${movie.genre} • Chiếu Rạp • Hay`;

  return (
    <div className="movie-card-container">
      {/* Static Base Card */}
      <Link to={`/movies/${movie.id}`} className="movie-card-base">
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
          <div className="card-badge-bottom">
            <span>P.Đ. {movie.rating}</span>
          </div>
        </div>
        <div className="card-info-bottom">
          <h3 className="card-title-base">{movie.title}</h3>
          <p className="card-subtitle-base">{subTitle}</p>
        </div>
      </Link>

      {/* Hover Detailed Popup Card */}
      <div className="movie-card-hover-popup">
        <div className="popup-image-wrapper" onClick={() => navigate(`/movies/${movie.id}`)}>
          <img
            src={movie.image || '/favicon.svg'}
            alt={movie.title}
            className="popup-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
            }}
          />
          <div className="popup-badge-bottom">
            <span>P.Đ. {movie.rating}</span>
          </div>
        </div>

        <div className="popup-details">
          <h4 className="popup-title">{movie.title}</h4>
          <p className="popup-subtitle">{subTitle}</p>

          {/* Action Buttons Row */}
          <div className="popup-buttons-row">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/booking/${movie.id}`);
              }}
              className="popup-btn-play"
            >
              <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Xem ngay
            </button>

            <button
              onClick={toggleLike}
              className={`popup-btn-action btn-like ${liked ? 'liked' : ''}`}
              title="Thích"
            >
              <svg className="action-icon" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/movies/${movie.id}`);
              }}
              className="popup-btn-action btn-info"
              title="Chi tiết"
            >
              <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>

          {/* Badges/Tags Row */}
          <div className="popup-tags-row">
            <span className="badge-imdb">IMDb {movie.rating.toFixed(1)}</span>
            <span className="badge-age">{movie.rating >= 8.5 || movie.genre === 'Action' ? 'T16' : 'PG-13'}</span>
            <span className="badge-year">{movie.releaseYear}</span>
            <span className="badge-status">Phần 1</span>
            <span className="badge-complete">Tập Hoàn Tất</span>
          </div>

          {/* Genres */}
          <p className="popup-genres">{dotGenres}</p>

          {/* Admin Delete Action */}
          {isAdmin && (
            <div className="popup-admin-row">
              <button
                onClick={(e) => handleDelete(e, movie.id, movie.title)}
                className="btn-delete-popup"
                title="Xóa phim"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="delete-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa phim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
