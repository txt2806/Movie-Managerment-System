import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMovieController } from '../hooks/useMovieController';
import { useBookingController } from '../hooks/useBookingController';
import { useTranslation } from '../context/TranslationContext';
import './Management.css';

export default function Management() {
  const navigate = useNavigate();
  const { movies, fetchAllMovies, removeMovie } = useMovieController();
  const { bookings, fetchAllBookings } = useBookingController();
  const { t } = useTranslation();

  // Tab State: 'movies' or 'bookings'
  const [activeTab, setActiveTab] = useState('movies');

  // Pagination states
  const [moviePage, setMoviePage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllMovies();
    fetchAllBookings();
  }, [fetchAllMovies, fetchAllBookings]);

  // Reset page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteMovie = async (id, title) => {
    if (window.confirm(t('deleteConfirm', { title }))) {
      try {
        await removeMovie(id);
        // Adjust page if last item on page is deleted
        const remainingMoviesCount = movies.length - 1;
        const maxPage = Math.max(1, Math.ceil(remainingMoviesCount / itemsPerPage));
        if (moviePage > maxPage) {
          setMoviePage(maxPage);
        }
      } catch (err) {
        alert(err.message || 'Failed to delete movie');
      }
    }
  };

  // Stats calculation
  const stats = {
    totalMovies: movies.length,
    bookingsCount: bookings.length,
    totalRevenue: bookings.reduce((sum, item) => sum + item.totalPrice, 0)
  };

  // Pagination Calculations - Movies
  const totalMoviePages = Math.max(1, Math.ceil(movies.length / itemsPerPage));
  const indexOfLastMovie = moviePage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Pagination Calculations - Bookings
  const totalBookingPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage));
  const indexOfLastBooking = bookingPage * itemsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  return (
    <div className="management-page">
      <div className="management-header">
        <h1 className="dashboard-title">Bảng Quản Trị Hệ Thống</h1>
        <Link to="/add" className="btn btn-primary btn-add-movie">
          + Thêm Phim Mới
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">🎬</div>
          <div className="stat-details">
            <span className="stat-label">Tổng Số Phim</span>
            <span className="stat-value">{stats.totalMovies}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">🎫</div>
          <div className="stat-details">
            <span className="stat-label">Số Vé Đã Đặt</span>
            <span className="stat-value">{stats.bookingsCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper gold">💰</div>
          <div className="stat-details">
            <span className="stat-label">Ước Tính Doanh Thu</span>
            <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      <div className="management-tabs">
        <button 
          onClick={() => handleTabChange('movies')}
          className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
        >
          🎬 Quản Lý Danh Sách Phim ({stats.totalMovies})
        </button>
        <button 
          onClick={() => handleTabChange('bookings')}
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
        >
          🎫 Lịch Sử Đơn Đặt Vé ({stats.bookingsCount})
        </button>
      </div>

      {/* Tab Contents View */}
      <div className="dashboard-sections">
        
        {activeTab === 'movies' && (
          <div className="dashboard-card table-section-card animate-fade-in">
            <h2 className="section-title">Danh Sách Quản Lý Phim</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên Phim</th>
                    <th>Thể Loại</th>
                    <th>Năm</th>
                    <th>Giá Vé</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMovies.map((movie) => (
                    <tr key={movie.id}>
                      <td className="movie-title-cell">
                        <img 
                          src={movie.image || '/favicon.svg'} 
                          alt={movie.title} 
                          className="table-poster-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';
                          }}
                        />
                        <span>{movie.title}</span>
                      </td>
                      <td>{movie.genre}</td>
                      <td>{movie.releaseYear}</td>
                      <td className="price-cell">${movie.currentPrice.toFixed(2)}</td>
                      <td>
                        <span className="status-badge active">Đang Chiếu</span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          onClick={() => navigate(`/edit/${movie.id}`)}
                          className="action-btn-icon edit"
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteMovie(movie.id, movie.title)}
                          className="action-btn-icon delete"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentMovies.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">Không có bộ phim nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Movies */}
            {totalMoviePages > 1 && (
              <div className="pagination-controls">
                <button 
                  disabled={moviePage === 1}
                  onClick={() => setMoviePage(prev => Math.max(1, prev - 1))}
                  className="page-nav-btn"
                >
                  ◀ Trước
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalMoviePages }, (_, idx) => idx + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setMoviePage(pageNum)}
                      className={`page-num-btn ${moviePage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={moviePage === totalMoviePages}
                  onClick={() => setMoviePage(prev => Math.min(totalMoviePages, prev + 1))}
                  className="page-nav-btn"
                >
                  Sau ▶
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="dashboard-card table-section-card animate-fade-in">
            <h2 className="section-title">Lịch Sử Các Đơn Đặt Vé</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Phim</th>
                    <th>Rạp Chiếu</th>
                    <th>Suất Chiếu</th>
                    <th>Danh Sách Ghế</th>
                    <th>Khách Hàng</th>
                    <th>Doanh Thu</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="code-cell">{booking.bookingCode}</td>
                      <td className="bold">{booking.movieTitle}</td>
                      <td>{booking.cinema}</td>
                      <td>{booking.date} @ {booking.showtime}</td>
                      <td className="seats-cell">{booking.seats.join(', ')}</td>
                      <td className="customer-cell">
                        <span className="name">{booking.customerName || 'Standard User'}</span>
                        <span className="email">{booking.customerEmail || booking.userId}</span>
                      </td>
                      <td className="price-cell bold success-color">${booking.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                  {currentBookings.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4">Chưa có đơn đặt vé nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Bookings */}
            {totalBookingPages > 1 && (
              <div className="pagination-controls">
                <button 
                  disabled={bookingPage === 1}
                  onClick={() => setBookingPage(prev => Math.max(1, prev - 1))}
                  className="page-nav-btn"
                >
                  ◀ Trước
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalBookingPages }, (_, idx) => idx + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setBookingPage(pageNum)}
                      className={`page-num-btn ${bookingPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={bookingPage === totalBookingPages}
                  onClick={() => setBookingPage(prev => Math.min(totalBookingPages, prev + 1))}
                  className="page-nav-btn"
                >
                  Sau ▶
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
