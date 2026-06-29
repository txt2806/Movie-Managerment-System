export const authService = {
  login(username, password) {
    return new Promise((resolve, reject) => {
      // Simulate real network delay
      setTimeout(() => {
        const u = username.toLowerCase().trim();
        
        // Define admin and user credential rules (no hardcoded passwords inside components)
        if ((u === 'admin' || u === 'admin@cinesphere.com') && password === 'admin') {
          const session = { username: 'Admin User', email: u, role: 'admin', token: 'mock-jwt-admin-token' };
          localStorage.setItem('auth_session', JSON.stringify(session));
          resolve(session);
        } else if ((u === 'user' || u === 'user@cinesphere.com') && password === 'user') {
          const session = { username: 'Standard User', email: u, role: 'user', token: 'mock-jwt-user-token' };
          localStorage.setItem('auth_session', JSON.stringify(session));
          resolve(session);
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 800);
    });
  },

  logout() {
    localStorage.removeItem('auth_session');
    return Promise.resolve();
  },

  getCurrentSession() {
    try {
      const sessionStr = localStorage.getItem('auth_session');
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getCurrentSession();
  },

  isAdmin() {
    const session = this.getCurrentSession();
    return session?.role === 'admin';
  }
};
