// Events page — role-aware (student: browse+register, admin: dashboard with fill indicators)

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getFillClass(registeredCount, capacity) {
  const pct = (registeredCount / capacity) * 100;
  if (pct >= 80) return 'fill-red';
  if (pct >= 50) return 'fill-amber';
  return 'fill-green';
}

async function renderEventsPage() {
  const app = document.getElementById('app');
  const user = Auth.getUser();

  app.innerHTML = '<div class="loading">Loading events...</div>';

  try {
    let events = [];
    let registeredEventIds = new Set();
    
    if (user.role === 'admin') {
      events = await apiFetch('/events');
    } else {
      const [fetchedEvents, myRegs] = await Promise.all([
        apiFetch('/events'),
        apiFetch('/registrations/my').catch(() => [])
      ]);
      events = fetchedEvents;
      registeredEventIds = new Set(myRegs.map(r => r.event.id));
    }

    if (events.length === 0) {
      app.innerHTML = '<div class="empty-state"><h2>No events available</h2><p>Check back later for upcoming events.</p></div>';
      return;
    }

    if (user.role === 'admin') {
      renderAdminDashboard(app, events);
    } else {
      renderStudentEvents(app, events, registeredEventIds);
    }
  } catch (err) {
    app.innerHTML = `<div class="error-state"><h2>Error loading events</h2><p>${err.message}</p></div>`;
  }
}

function renderAdminDashboard(app, events) {
  let rows = events.map(event => {
    const pct = event.capacity > 0 ? Math.round((event.registeredCount / event.capacity) * 100) : 0;
    const fillClass = getFillClass(event.registeredCount, event.capacity);

    return `
      <tr>
        <td>${event.name}</td>
        <td>${formatDate(event.date)}</td>
        <td>${event.venue}</td>
        <td>
          <div class="fill-info">
            <span>${event.registeredCount} / ${event.capacity}</span>
            <span class="fill-badge ${fillClass}">${pct}%</span>
          </div>
          <div class="fill-bar">
            <div class="fill-bar-inner ${fillClass}" style="width: ${pct}%"></div>
          </div>
        </td>
        <td>
          <a href="#/admin/events/${event._id}/registrations" class="btn btn-sm btn-secondary">View Registrations</a>
        </td>
      </tr>
    `;
  }).join('');

  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <a href="#/admin/create-event" class="btn btn-primary">+ Create Event</a>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderStudentEvents(app, events, registeredEventIds = new Set()) {
  let cards = events.map(event => {
    const spotsLeft = event.capacity - event.registeredCount;
    const isFull = spotsLeft <= 0;
    const isRegistered = registeredEventIds.has(event._id);

    return `
      <div class="event-card ${isFull ? 'event-full' : ''}">
        <div class="event-card-header">
          <h3>${event.name}</h3>
          ${isFull ? '<span class="badge badge-full">Full</span>' : `<span class="badge badge-open">${spotsLeft} spots left</span>`}
        </div>
        <div class="event-card-body">
          <p class="event-detail"><span class="detail-icon">📅</span> ${formatDate(event.date)}</p>
          <p class="event-detail"><span class="detail-icon">📍</span> ${event.venue}</p>
          <p class="event-detail"><span class="detail-icon">👥</span> ${event.registeredCount} / ${event.capacity} registered</p>
        </div>
        <div class="event-card-footer">
          <div class="event-message ${isRegistered ? 'success-message' : ''}" id="msg-${event._id}" style="display:${isRegistered ? 'block' : 'none'}; margin-bottom: 8px;">
            ${isRegistered ? '✅ Registered' : ''}
          </div>
          <button class="btn btn-primary btn-register"
                  data-event-id="${event._id}"
                  ${isFull ? 'disabled' : ''}>
            ${isFull ? 'Full' : 'Register'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1>Upcoming Events</h1>
      </div>
      <div class="event-grid">${cards}</div>
    </div>
  `;

  // Attach register handlers
  document.querySelectorAll('.btn-register:not([disabled])').forEach(btn => {
    btn.addEventListener('click', async () => {
      const eventId = btn.dataset.eventId;
      const msgEl = document.getElementById(`msg-${eventId}`);

      btn.disabled = true;
      btn.textContent = 'Registering...';

      try {
        await apiFetch('/register', {
          method: 'POST',
          body: JSON.stringify({ eventId })
        });
        msgEl.textContent = '✅ Successfully registered!';
        msgEl.className = 'event-message success-message';
        msgEl.style.display = 'block';
        // Refresh event list after short delay
        setTimeout(() => renderEventsPage(), 1000);
      } catch (err) {
        msgEl.textContent = `❌ ${err.message}`;
        msgEl.className = 'event-message error-message';
        msgEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Register';
      }
    });
  });
}
