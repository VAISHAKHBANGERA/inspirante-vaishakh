// App — main entry point, hash-based SPA router

const App = {
  init() {
    window.addEventListener('hashchange', () => this.route());
    // Initial route
    this.route();
  },

  async route() {
    const hash = window.location.hash || '#/login';
    const user = Auth.getUser();
    const loggedIn = Auth.isLoggedIn();

    // If not logged in, force to login page
    if (!loggedIn && hash !== '#/login') {
      window.location.hash = '#/login';
      return;
    }

    // If logged in and on login page, redirect to events
    if (loggedIn && hash === '#/login') {
      window.location.hash = '#/events';
      return;
    }

    // Render navbar
    renderNavbar();

    // Route matching
    if (hash === '#/login') {
      renderLoginPage();
    } else if (hash === '#/events') {
      await renderEventsPage();
    } else if (hash === '#/my-registrations') {
      // Student only
      if (user && user.role !== 'student') {
        window.location.hash = '#/events';
        return;
      }
      await renderMyRegistrationsPage();
    } else if (hash === '#/admin/create-event') {
      // Admin only
      if (user && user.role !== 'admin') {
        window.location.hash = '#/events';
        return;
      }
      renderCreateEventPage();
    } else if (hash.startsWith('#/admin/events/') && hash.endsWith('/registrations')) {
      // Admin only — extract event ID
      if (user && user.role !== 'admin') {
        window.location.hash = '#/events';
        return;
      }
      const match = hash.match(/#\/admin\/events\/(.+)\/registrations/);
      if (match && match[1]) {
        await renderEventRegistrationsPage(match[1]);
      } else {
        window.location.hash = '#/events';
      }
    } else {
      // Unknown route → redirect to events
      window.location.hash = '#/events';
    }
  }
};

// On page load, verify token then start app
(async function bootstrap() {
  if (Auth.getToken()) {
    await Auth.verify();
  }
  App.init();
})();
