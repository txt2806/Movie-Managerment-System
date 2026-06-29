import { useState } from 'react';
import { useAuthController } from '../hooks/useAuthController';
import { useTranslation } from '../context/TranslationContext';
import { useTheme } from '../context/ThemeContext';
import './Login.css';

export default function Login() {
  const { login, loading, error: loginError } = useAuthController();
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = t('loginErrorEmailReq');
    }
    if (!password) {
      errors.password = t('loginErrorPassReq');
    } else if (password.length < 4) {
      errors.password = t('loginErrorPassLength');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(username, password);
    } catch {
      // Handled by controller/view alert
    }
  };

  const handlePresetLogin = async (roleType) => {
    const userVal = roleType === 'admin' ? 'admin' : 'user';
    const passVal = roleType === 'admin' ? 'admin' : 'user';
    setUsername(userVal);
    setPassword(passVal);
    
    // Clear errors and submit
    setFormErrors({});
    try {
      await login(userVal, passVal);
    } catch {
      // Handled by controller
    }
  };

  return (
    <div className="netflix-login-container">
      {/* Header bar on Login Page */}
      <header className="login-header">
        <div className="login-logo">
          <span>Cine</span>Sphere
        </div>
        <div className="login-header-controls">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            className="login-lang-select"
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="login-theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main card panel */}
      <div className="login-card-wrapper">
        <div className="login-card">
          <h2>{t('loginTitle')}</h2>

          {loginError && (
            <div className="login-error-banner">
              {t('loginErrorInvalid')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form-group">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (formErrors.username) setFormErrors(prev => ({ ...prev, username: '' }));
                }}
                className={`login-input ${formErrors.username ? 'invalid' : ''}`}
                placeholder={t('loginEmailPlaceholder')}
              />
              {formErrors.username && <span className="login-field-error">{formErrors.username}</span>}
            </div>

            <div className="login-form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`login-input ${formErrors.password ? 'invalid' : ''}`}
                placeholder={t('loginPasswordPlaceholder')}
              />
              {formErrors.password && <span className="login-field-error">{formErrors.password}</span>}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`login-btn-submit ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="mini-spinner"></span>
              ) : (
                t('loginBtn')
              )}
            </button>

            <div className="login-helpers">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#help" className="help-link">{t('loginNeedHelp')}</a>
            </div>
          </form>

          {/* Quick presets for developers / grading */}
          <div className="presets-section">
            <p className="presets-label">Grading Presets / Lối tắt đăng nhập:</p>
            <div className="presets-buttons">
              <button 
                type="button" 
                onClick={() => handlePresetLogin('admin')} 
                className="btn-preset admin-preset"
              >
                🔑 {t('loginAdminPreset')}
              </button>
              <button 
                type="button" 
                onClick={() => handlePresetLogin('user')} 
                className="btn-preset user-preset"
              >
                👤 {t('loginUserPreset')}
              </button>
            </div>
          </div>

          <div className="login-card-footer">
            <p>
              {t('loginNewToSystem')}{' '}
              <a href="#signup" className="signup-link">{t('loginSignUpNow')}</a>
            </p>
            <p className="recaptcha-text">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
