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
            <span>Cine</span>Sphere
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
            {isAdmin && (
              <li className="nav-item">
                <NavLink 
                  to="/add" 
                  className={({ isActive }) => `nav-links ${isActive ? 'active' : ''}`}
                >
                  {t('navAdd')}
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
              <div className="profile-info">
                <span className="profile-welcome">{t('navWelcome')}</span>
                <span className="profile-name">{session.email}</span>
                <span className={`role-badge ${session.role}`}>
                  {session.role === 'admin' ? t('navRoleAdmin') : t('navRoleUser')}
                </span>
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
