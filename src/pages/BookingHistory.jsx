import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookingController } from '../hooks/useBookingController';
import { useAuthController } from '../hooks/useAuthController';
import { useTranslation } from '../context/TranslationContext';
import './BookingHistory.css';

export default function BookingHistory() {
  const { bookings, loading, error, fetchAllBookings } = useBookingController();
  const { session } = useAuthController();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  // Filter bookings to only show the ones belonging to the logged-in user
  const userBookings = bookings.filter(
    (booking) => booking.userEmail === session?.email || booking.userId === session?.email
  );

  // Helper to format iso date string
  const formatDateTime = (dateStr, showtime) => {
    try {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day} @ ${showtime}`;
    } catch {
      return `${dateStr} @ ${showtime}`;
    }
  };

  const formatTimestamp = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString(t('lang') === 'vi' ? 'vi-VN' : 'en-US');
    } catch {
      return ts;
    }
  };

  return (
    <div className="booking-history-page">
      <Link to="/movies" className="back-link">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('detailBack')}
      </Link>

      <h1 className="history-title">{t('bookingHistoryTitle')}</h1>

      {loading && (
        <div className="history-loading">
          <div className="spinner"></div>
          <p>{t('detailLoading')}</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-card container-small">
          <div className="error-icon">⚠️</div>
          <h3>Failed to Load Bookings</h3>
          <p>{error}</p>
          <button onClick={fetchAllBookings} className="btn btn-primary">
            {t('retryBtn')}
          </button>
        </div>
      )}

      {!loading && !error && userBookings.length === 0 && (
        <div className="empty-history-card">
          <div className="empty-icon">🎟️</div>
          <p>{t('bookingHistoryEmpty')}</p>
          <Link to="/movies" className="btn btn-primary">
            {t('bookingBackHome')}
          </Link>
        </div>
      )}

      {!loading && !error && userBookings.length > 0 && (
        <div className="tickets-grid">
          {userBookings.map((booking) => (
            <article key={booking.id} className="cinema-ticket">
              {/* Ticket Left Part - Visual Banner / Poster */}
              <div className="ticket-poster-side">
                <img
                  src={booking.movieImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'}
                  alt={booking.movieTitle}
                  className="ticket-poster-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <div className="poster-overlay"></div>
              </div>

              {/* Ticket Middle Part - Info details */}
              <div className="ticket-info-side">
                <div className="ticket-header">
                  <span className="ticket-cinema-badge">{booking.cinema}</span>
                  <h2 className="ticket-movie-title">{booking.movieTitle}</h2>
                </div>

                <div className="ticket-body">
                  <div className="info-row">
                    <div className="info-cell">
                      <span className="info-label">{t('bookingShowtime')}</span>
                      <span className="info-val highlight">
                        {formatDateTime(booking.date, booking.showtime)}
                      </span>
                    </div>
                  </div>

                  <div className="info-row split">
                    <div className="info-cell">
                      <span className="info-label">{t('bookingSeatsSelected')}</span>
                      <span className="info-val seats-highlight">
                        {booking.seats.join(', ')}
                      </span>
                    </div>
                    <div className="info-cell">
                      <span className="info-label">{t('bookingTotal')}</span>
                      <span className="info-val price-highlight">
                        ${booking.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="info-row footer-info">
                    <span className="date-booked">
                      {t('bookingDateBooked')}: {formatTimestamp(booking.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Right Part - Tear off stub & Barcode */}
              <div className="ticket-stub-side">
                <div className="stub-divider">
                  <div className="notch notch-top"></div>
                  <div className="dashed-line"></div>
                  <div className="notch notch-bottom"></div>
                </div>
                <div className="stub-content">
                  <div className="barcode-container">
                    <div className="barcode-lines">
                      <span className="bar thick"></span>
                      <span className="bar thin"></span>
                      <span className="bar thick"></span>
                      <span className="bar thin"></span>
                      <span className="bar thin"></span>
                      <span className="bar thick"></span>
                      <span className="bar thin"></span>
                      <span className="bar thick"></span>
                      <span className="bar thin"></span>
                      <span className="bar thick"></span>
                    </div>
                    <span className="barcode-text">{booking.bookingCode}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
