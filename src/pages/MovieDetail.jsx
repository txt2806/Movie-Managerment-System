import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovieController } from '../hooks/useMovieController';
import { useAuthController } from '../hooks/useAuthController';
import { useTranslation } from '../context/TranslationContext';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentMovie, loading, error, fetchMovieDetail, removeMovie, resetCurrentMovie } = useMovieController();
  const { isAdmin } = useAuthController();
  const { t } = useTranslation();

  useEffect(() => {
    fetchMovieDetail(id);
    return () => {
      resetCurrentMovie();
    };
  }, [fetchMovieDetail, resetCurrentMovie, id]);

  const handleDelete = async () => {
    if (window.confirm(t('deleteConfirm', { title: currentMovie.title }))) {
      try {
        await removeMovie(id);
        navigate('/movies');
      } catch (err) {
        alert(err.message || 'Failed to delete movie');
      }
    }
  };

  if (loading) {
    return (
      <div className="detail-loading-container">
        <div className="spinner"></div>
        <p>{t('detailLoading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-card container-small">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Movie Details</h3>
        <p>{error}</p>
        <div className="error-actions">
          <Link to="/movies" className="btn btn-secondary">{t('detailBack')}</Link>
          <button onClick={() => fetchMovieDetail(id)} className="btn btn-primary">{t('retryBtn')}</button>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="empty-state container-small">
        <p>{t('detailNotFound')}</p>
        <Link to="/movies" className="btn btn-primary">{t('detailBack')}</Link>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <Link to="/movies" className="back-link">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('detailBack')}
      </Link>

      <div className="movie-detail-card">
        <div className="detail-image-section">
          <img
            src={currentMovie.image || '/favicon.svg'}
            alt={currentMovie.title}
            className="detail-poster"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
            }}
          />
        </div>
        
        <div className="detail-info-section">
          <div className="detail-header">
            <div className="detail-tags">
              <span className="tag tag-genre">{currentMovie.genre}</span>
              <span className="tag tag-year">{currentMovie.releaseYear}</span>
            </div>
            <h1 className="detail-title">{currentMovie.title}</h1>
            <div className="detail-rating-row">
              <span className="detail-star">★</span>
              <span className="detail-rating-score">{currentMovie.rating}</span>
              <span className="detail-rating-max">/10 ({t('detailRatingLabel')})</span>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-label">{t('detailPlot')}</h3>
            <p className="detail-plot">{currentMovie.description}</p>
          </div>

          <div className="detail-section booking-section-figma">
            <div className="price-tag-row">
              <span className="price-label">Giá vé:</span>
              <span className="price-val-gold">${currentMovie.currentPrice.toFixed(2)}</span>
            </div>
            
            <h3 className="section-label">Lịch Chiếu & Đặt Vé</h3>
            <div className="detail-cinemas-list">
              {[
                { name: 'CGV Vincom Center', times: ['10:15', '12:30', '15:00', '17:15', '19:30', '21:45'] },
                { name: 'Lotte Cinema Landmark', times: ['12:30', '15:00', '17:15', '19:30'] },
                { name: 'BHD Star Thao Dien', times: ['10:15', '15:00', '19:30', '21:45'] }
              ].map((cinema) => (
                <div key={cinema.name} className="cinema-showtimes-row">
                  <h4 className="cinema-row-name">{cinema.name}</h4>
                  <div className="showtimes-grid">
                    {cinema.times.map((time) => (
                      <Link 
                        key={time} 
                        to={`/booking/${currentMovie.id}?cinema=${encodeURIComponent(cinema.name)}&time=${time}`}
                        className="showtime-slot-btn"
                      >
                        {time}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="detail-actions">
              <Link to={`/edit/${currentMovie.id}`} className="btn btn-edit">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('detailEditBtn')}
              </Link>
              <button onClick={handleDelete} className="btn btn-detail-delete">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('detailDeleteBtn')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
