import { Link, NavLink } from 'react-router-dom';
import { useAuthController } from '../hooks/useAuthController';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { session, logout, isAdmin } = useAuthController();
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#FACC15"/>
              <polygon points="10,8 16,12 10,16" fill="#09090b"/>
            </svg>
            <span>Movie</span>Management
          </Link>
          <ul className="navbar-menu">
            <li className="nav-item">
              <NavLink 
                to="/movies" 
                className={({ isActive }) => `nav-links ${isActive ? 'active' : ''}`}
                end
              >
                {t('navBrowse')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/bookings" 
                className={({ isActive }) => `nav-links ${isActive ? 'active' : ''}`}
              >
                {t('navBookings')}
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink 
                  to="/management" 
                  className={({ isActive }) => `nav-links ${isActive ? 'active' : ''}`}
                >
                  {t('navManagement')}
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        <div className="navbar-right">
          {/* Language Selector */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            className="navbar-lang-select"
            aria-label="Language Selector"
          >
            <option value="en">EN</option>
            <option value="vi">VI</option>
          </select>

          {/* Theme Toggle */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="navbar-theme-toggle"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Profile details */}
          {session && (
            <div className="navbar-profile">
              <div className="profile-pill">
                <svg className="profile-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="profile-info">
                  <span className="profile-name">{session.username || session.email}</span>
                  <span className={`role-badge ${session.role}`}>
                    {session.role === 'admin' ? t('navRoleAdmin') : t('navRoleUser')}
                  </span>
                </div>
              </div>
              <button onClick={logout} className="btn-logout" title={t('navLogout')}>
                {t('navLogout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
