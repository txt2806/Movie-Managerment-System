import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function useAuthController() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => authService.getCurrentSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const activeSession = await authService.login(username, password);
      setSession(activeSession);
      navigate('/movies', { replace: true });
      return activeSession;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const checkAuthentication = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  const hasRole = useCallback((role) => {
    const current = authService.getCurrentSession();
    return current?.role === role;
  }, []);

  return {
    session,
    loading,
    error,
    login,
    logout,
    checkAuthentication,
    hasRole,
    isAdmin: session?.role === 'admin'
  };
}
