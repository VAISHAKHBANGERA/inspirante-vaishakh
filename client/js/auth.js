// Auth module — token + user management (JWT-based, NOT boolean flag)

const Auth = {
  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  async login(username, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
  },

  // Verify token is still valid on page load
  async verify() {
    try {
      const user = await apiFetch('/auth/me');
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      // Token invalid/expired — clear and redirect
      this.logout();
      return null;
    }
  }
};
