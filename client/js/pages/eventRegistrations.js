// Event Registrations page — admin only, shows students registered for a specific event

async function renderEventRegistrationsPage(eventId) {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="loading">Loading registrations...</div>';

  try {
    const data = await apiFetch(`/events/${eventId}/registrations`);

    let rows = '';
    if (data.registrations.length === 0) {
      rows = '<tr><td colspan="3" class="empty-cell">No students have registered for this event yet.</td></tr>';
    } else {
      rows = data.registrations.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${r.studentName}</td>
          <td>${r.studentUsername}</td>
          <td>${new Date(r.registeredAt).toLocaleString('en-IN')}</td>
        </tr>
      `).join('');
    }

    const pct = data.event.capacity > 0 ? Math.round((data.event.registeredCount / data.event.capacity) * 100) : 0;
    const fillClass = getFillClass(data.event.registeredCount, data.event.capacity);

    app.innerHTML = `
      <div class="page-container">
        <div class="page-header">
          <h1>Registrations: ${data.event.name}</h1>
          <a href="#/events" class="btn btn-secondary">← Back to Dashboard</a>
        </div>
        <div class="event-details-bar">
          <span>📅 ${formatDate(data.event.date)}</span>
          <span>📍 ${data.event.venue}</span>
          <span>👥 ${data.event.registeredCount} / ${data.event.capacity} registered</span>
          <span class="fill-badge ${fillClass}">${pct}%</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    app.innerHTML = `
      <div class="error-state">
        <h2>Error loading registrations</h2>
        <p>${err.message}</p>
        <a href="#/events" class="btn btn-secondary">← Back to Dashboard</a>
      </div>
    `;
  }
}
