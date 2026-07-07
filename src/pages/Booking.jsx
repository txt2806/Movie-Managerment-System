import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieController } from '../hooks/useMovieController';
import { useBookingController } from '../hooks/useBookingController';
import { useAuthController } from '../hooks/useAuthController';
import { useTranslation } from '../context/TranslationContext';
import './Booking.css';

const CINEMAS = [
  'CGV Vincom Center',
  'Lotte Cinema Landmark',
  'BHD Star Thao Dien',
  'Galaxy Cinema Nguyen Du'
];

const SHOWTIMES = ['10:15', '12:30', '15:00', '17:15', '19:30', '21:45'];

function generateBookingId() {
  return `bk-${Date.now()}`;
}

function generateBookingCode() {
  return `CS-${Math.floor(100000 + Math.random() * 900000)}`;
}

function getTimestamp() {
  return new Date().toISOString();
}

function getDefaultDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export default function Booking() {
  const { movieId } = useParams();
  const { currentMovie, loading: movieLoading, error: movieError, fetchMovieDetail } = useMovieController();
  const { createBooking, loading: bookingSaving } = useBookingController();
  const { session } = useAuthController();
  const { t } = useTranslation();

  // Selection states
  const [selectedCinema, setSelectedCinema] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('cinema') || CINEMAS[0];
  });
  const [selectedDate, setSelectedDate] = useState(getDefaultDate);
  const [selectedTime, setSelectedTime] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('time') || SHOWTIMES[2];
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Customer details form state
  const [customerName, setCustomerName] = useState(session?.username || 'Standard User');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState(session?.email || '');

  // Reset selected seats when layout parameters change in render
  const [prevParams, setPrevParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const initCinema = params.get('cinema') || CINEMAS[0];
    const initTime = params.get('time') || SHOWTIMES[2];
    return {
      cinema: initCinema,
      date: selectedDate,
      time: initTime
    };
  });

  if (
    prevParams.cinema !== selectedCinema ||
    prevParams.date !== selectedDate ||
    prevParams.time !== selectedTime
  ) {
    setPrevParams({ cinema: selectedCinema, date: selectedDate, time: selectedTime });
    setSelectedSeats([]);
  }

  // Generate 3 dates starting from today
  const dates = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dayName = d.toLocaleDateString(t('lang') === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString(t('lang') === 'vi' ? 'vi-VN' : 'en-US', { month: 'short' });
      arr.push({
        isoString: d.toISOString().split('T')[0],
        label: `${dayName}, ${dayNum} ${month}`
      });
    }
    return arr;
  }, [t]);

  useEffect(() => {
    fetchMovieDetail(movieId);
  }, [fetchMovieDetail, movieId]);

  // Mock sold seats based on cinema, date, and showtime to simulate dynamic cinema behavior
  const soldSeats = useMemo(() => {
    // Generate deterministic pseudo-random sold seats based on selections
    const seed = `${selectedCinema}-${selectedDate}-${selectedTime}-${movieId}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const sold = new Set();
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const cols = 10;
    
    rows.forEach((row) => {
      for (let col = 1; col <= cols; col++) {
        const seatId = `${row}${col}`;
        const seatVal = seatId.charCodeAt(0) + seatId.charCodeAt(1) + Math.abs(hash);
        // ~30% occupancy
        if (seatVal % 3 === 0) {
          sold.add(seatId);
        }
      }
    });
    return sold;
  }, [selectedCinema, selectedDate, selectedTime, movieId]);

  if (movieLoading) {
    return (
      <div className="booking-loading">
        <div className="spinner"></div>
        <p>{t('detailLoading')}</p>
      </div>
    );
  }

  if (movieError || !currentMovie) {
    return (
      <div className="error-card container-small">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Movie</h3>
        <p>{movieError || t('detailNotFound')}</p>
        <Link to="/movies" className="btn btn-primary">{t('detailBack')}</Link>
      </div>
    );
  }

  const basePrice = currentMovie.currentPrice;

  // Seat classifications
  const getSeatInfo = (row, col) => {
    const seatId = `${row}${col}`;
    let type = 'standard';
    let surcharge = 0;
    let name = t('bookingStandard');

    if (['D', 'E', 'F'].includes(row)) {
      type = 'vip';
      surcharge = 2.0;
      name = t('bookingVip');
    } else if (row === 'G') {
      type = 'couple';
      surcharge = 0; // Handled separately: basePrice * 2 with 10% discount
      name = t('bookingCouple');
    }

    return { seatId, type, surcharge, name };
  };

  const handleSeatClick = (row, col) => {
    const { seatId } = getSeatInfo(row, col);
    if (soldSeats.has(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  // Pricing calculations
  const billing = (() => {
    let subtotal = 0;
    let vipSurcharge = 0;
    let coupleCount = 0;

    selectedSeats.forEach((seatId) => {
      const row = seatId[0];
      const { type } = getSeatInfo(row, 1);
      
      if (type === 'vip') {
        subtotal += basePrice + 2;
        vipSurcharge += 2;
      } else if (type === 'couple') {
        coupleCount++;
        // Couple seats are bought as individual sides but discounted: basePrice * 1.8 for each seat in the pair
        subtotal += basePrice * 0.9; 
      } else {
        subtotal += basePrice;
      }
    });

    return {
      subtotal,
      vipSurcharge,
      seatsCount: selectedSeats.length,
      coupleCount,
      total: subtotal
    };
  })();

  const handleBookTickets = async () => {
    if (selectedSeats.length === 0) return;

    const bookingData = {
      id: generateBookingId(),
      userId: session?.email || 'anonymous',
      userEmail: session?.email || 'anonymous',
      customerName,
      customerPhone,
      customerEmail,
      movieId: currentMovie.id,
      movieTitle: currentMovie.title,
      movieImage: currentMovie.image,
      cinema: selectedCinema,
      date: selectedDate,
      showtime: selectedTime,
      seats: selectedSeats,
      totalPrice: Number(billing.total.toFixed(2)),
      bookingCode: generateBookingCode(),
      timestamp: getTimestamp()
    };

    try {
      const result = await createBooking(bookingData);
      setCreatedBooking(result);
      setBookingSuccess(true);
    } catch (err) {
      alert(err.message || 'Failed to complete booking. Please try again.');
    }
  };

  if (bookingSuccess && createdBooking) {
    return (
      <div className="booking-success-container">
        <div className="success-card">
          <div className="success-icon-badge">✓</div>
          <h2 className="success-title">{t('bookingSuccessTitle')}</h2>
          <p className="success-message">{t('bookingSuccessMsg')}</p>

          <div className="ticket-receipt">
            <div className="receipt-row font-outfit">
              <h3>{createdBooking.movieTitle}</h3>
              <span className="receipt-code">{createdBooking.bookingCode}</span>
            </div>
            <hr className="receipt-divider" />
            <div className="receipt-details">
              <div className="detail-item">
                <span className="label">{t('bookingCinema')}:</span>
                <span className="value">{createdBooking.cinema}</span>
              </div>
              <div className="detail-item">
                <span className="label">{t('bookingShowtime')}:</span>
                <span className="value">{createdBooking.date} @ {createdBooking.showtime}</span>
              </div>
              <div className="detail-item">
                <span className="label">{t('bookingSeatLabel')}:</span>
                <span className="value highlight">{createdBooking.seats.join(', ')}</span>
              </div>
              <div className="detail-item">
                <span className="label">{t('bookingTotal')}:</span>
                <span className="value total">${createdBooking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/bookings" className="btn btn-primary">
              📋 {t('navBookings')}
            </Link>
            <Link to="/movies" className="btn btn-secondary">
              🏠 {t('bookingBackHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const columns = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="booking-page">
      <Link to={`/movies/${movieId}`} className="back-link">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('detailBack')}
      </Link>

      <h1 className="booking-page-title">{t('bookingTitle')}</h1>

      <div className="booking-layout">
        {/* Booking parameters & seat map */}
        <div className="booking-left">
          <div className="selection-panel">
            {/* Cinema Dropdown */}
            <div className="selection-group">
              <label htmlFor="cinema-select">{t('bookingCinema')}</label>
              <select
                id="cinema-select"
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
                className="select-field"
              >
                {CINEMAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date Pickers */}
            <div className="selection-group">
              <label>{t('bookingSelectDate')}</label>
              <div className="date-picker-grid">
                {dates.map((d) => (
                  <button
                    key={d.isoString}
                    type="button"
                    onClick={() => setSelectedDate(d.isoString)}
                    className={`date-btn ${selectedDate === d.isoString ? 'active' : ''}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime Selection */}
            <div className="selection-group">
              <label>{t('bookingSelectShowtime')}</label>
              <div className="time-picker-grid">
                {SHOWTIMES.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Layout */}
          <div className="seat-map-card">
            <div className="screen-container">
              <div className="screen-glow"></div>
              <p className="screen-text">{t('bookingScreen')}</p>
            </div>

            <div className="seating-grid">
              {rows.map((row) => (
                <div key={row} className="seating-row">
                  <span className="row-letter">{row}</span>
                  <div className="row-seats">
                    {columns.map((col) => {
                      const { seatId, type } = getSeatInfo(row, col);
                      const isSold = soldSeats.has(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      
                      // Couple seat pairing style class
                      let couplePairClass = '';
                      if (type === 'couple') {
                        couplePairClass = col % 2 === 1 ? 'couple-left' : 'couple-right';
                      }

                      return (
                        <div key={seatId} style={{ display: 'contents' }}>
                          {col === 5 && <div className="seating-aisle-gap" key={`gap-${row}`}></div>}
                          <button
                            type="button"
                            disabled={isSold}
                            onClick={() => handleSeatClick(row, col)}
                            className={`seat-btn seat-${type} ${isSelected ? 'selected' : ''} ${isSold ? 'sold' : ''} ${couplePairClass}`}
                            title={`${seatId} (${type.toUpperCase()})`}
                            aria-label={`Seat ${seatId} ${isSold ? 'Sold' : isSelected ? 'Selected' : 'Available'}`}
                          >
                            <span className="seat-num">{col}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <span className="row-letter">{row}</span>
                </div>
              ))}
            </div>

            {/* Seating Legend */}
            <div className="legend-section">
              <h4 className="legend-title">{t('bookingLegend')}</h4>
              <div className="legend-grid">
                <div className="legend-item">
                  <span className="legend-box seat-standard"></span>
                  <span>{t('bookingStandard')}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box seat-vip"></span>
                  <span>{t('bookingVip')}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box seat-couple"></span>
                  <span>{t('bookingCouple')}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box selected"></span>
                  <span>{t('bookingSelected')}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box sold"></span>
                  <span>{t('bookingSold')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Summary panel */}
        <div className="booking-right">
          <div className="checkout-summary-card">
            <div className="movie-mini-info">
              <img
                src={currentMovie.image || '/favicon.svg'}
                alt={currentMovie.title}
                className="mini-poster"
              />
              <div className="mini-details">
                <span className="genre-tag">{currentMovie.genre}</span>
                <h3>{currentMovie.title}</h3>
                <span className="rating-tag">★ {currentMovie.rating}</span>
              </div>
            </div>

            <hr className="summary-divider" />

            <div className="ticket-details-table">
              <div className="receipt-item">
                <span className="label">{t('bookingCinema')}:</span>
                <span className="value">{selectedCinema}</span>
              </div>
              <div className="receipt-item">
                <span className="label">{t('bookingShowtime')}:</span>
                <span className="value highlight">
                  {dates.find(d => d.isoString === selectedDate)?.label || selectedDate} @ {selectedTime}
                </span>
              </div>
              <div className="receipt-item">
                <span className="label">{t('bookingSeatsSelected')}:</span>
                <span className="value highlight">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : t('bookingNoSeats')}
                </span>
              </div>
            </div>

            <hr className="summary-divider" />

            <div className="pricing-summary">
              <div className="price-row">
                <span>{t('bookingPricePerTicket')}</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              
              {billing.vipSurcharge > 0 && (
                <div className="price-row">
                  <span>{t('bookingSurcharges')}</span>
                  <span>+ ${billing.vipSurcharge.toFixed(2)}</span>
                </div>
              )}

              <hr className="summary-divider sub" />

              <div className="price-row grand-total font-outfit">
                <span>{t('bookingTotal')}</span>
                <span>${billing.total.toFixed(2)}</span>
              </div>
            </div>

            <hr className="summary-divider" />

            <div className="customer-contact-form">
              <h4 className="contact-form-title">Thông Tin Liên Hệ</h4>
              <div className="contact-input-group">
                <label htmlFor="customer-name">Họ và tên *</label>
                <input 
                  type="text" 
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div className="contact-input-group">
                <label htmlFor="customer-phone">Số điện thoại *</label>
                <input 
                  type="tel" 
                  id="customer-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                />
              </div>
              <div className="contact-input-group">
                <label htmlFor="customer-email">Email *</label>
                <input 
                  type="email" 
                  id="customer-email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              disabled={
                selectedSeats.length === 0 || 
                bookingSaving || 
                !customerName.trim() || 
                !customerPhone.trim() || 
                !customerEmail.trim()
              }
              onClick={handleBookTickets}
              className={`btn btn-primary checkout-btn ${bookingSaving ? 'loading' : ''}`}
            >
              {bookingSaving ? t('formBtnSaving') : t('bookingConfirmBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
