// Navbar component — role-aware navigation

function renderNavbar() {
  const navbar = document.getElementById('navbar');
  const user = Auth.getUser();

  if (!user) {
    navbar.innerHTML = '';
    return;
  }

  let links = '';

  if (user.role === 'student') {
    links = `
      <a href="#/events" class="nav-link">Events</a>
      <a href="#/my-registrations" class="nav-link">My Registrations</a>
    `;
  } else if (user.role === 'admin') {
    links = `
      <a href="#/events" class="nav-link">Dashboard</a>
      <a href="#/admin/create-event" class="nav-link">Create Event</a>
    `;
  }

  navbar.innerHTML = `
    <div class="nav-container">
      <a href="#/events" class="nav-brand">🎓 College Events</a>
      <div class="nav-links">
        ${links}
      </div>
      <div class="nav-user">
        <span class="nav-user-info">${user.name} <span class="nav-role-badge role-${user.role}">${user.role}</span></span>
        <button class="btn btn-logout" id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', () => {
    Auth.logout();
  });
}
