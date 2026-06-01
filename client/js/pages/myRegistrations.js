// My Registrations page — student only

async function renderMyRegistrationsPage() {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="loading">Loading your registrations...</div>';

  try {
    const registrations = await apiFetch('/registrations/my');

    if (registrations.length === 0) {
      app.innerHTML = `
        <div class="page-container">
          <div class="page-header"><h1>My Registrations</h1></div>
          <div class="empty-state">
            <h2>No registrations yet</h2>
            <p>You haven't registered for any events yet.</p>
            <a href="#/events" class="btn btn-primary">Browse Events</a>
          </div>
        </div>
      `;
      return;
    }

    let rows = registrations.map(r => `
      <tr>
        <td>${r.event.name}</td>
        <td>${formatDate(r.event.date)}</td>
        <td>${r.event.venue}</td>
        <td>${new Date(r.registeredAt).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    app.innerHTML = `
      <div class="page-container">
        <div class="page-header"><h1>My Registrations</h1></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Registered On</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    app.innerHTML = `<div class="error-state"><h2>Error loading registrations</h2><p>${err.message}</p></div>`;
  }
}
