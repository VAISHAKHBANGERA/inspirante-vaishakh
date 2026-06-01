// Create Event page — admin only

function renderCreateEventPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1>Create New Event</h1>
        <a href="#/events" class="btn btn-secondary">← Back to Dashboard</a>
      </div>
      <div class="form-card">
        <form id="createEventForm">
          <div class="form-group">
            <label for="eventName">Event Name</label>
            <input type="text" id="eventName" placeholder="e.g. Tech Symposium 2026" required>
          </div>
          <div class="form-group">
            <label for="eventDate">Date</label>
            <input type="date" id="eventDate" required>
          </div>
          <div class="form-group">
            <label for="eventVenue">Venue</label>
            <input type="text" id="eventVenue" placeholder="e.g. Main Auditorium" required>
          </div>
          <div class="form-group">
            <label for="eventCapacity">Maximum Capacity</label>
            <input type="number" id="eventCapacity" min="1" placeholder="e.g. 100" required>
          </div>
          <div id="createEventMsg" class="event-message" style="display:none;"></div>
          <button type="submit" class="btn btn-primary btn-full" id="createEventBtn">Create Event</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('createEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('createEventMsg');
    const submitBtn = document.getElementById('createEventBtn');

    const name = document.getElementById('eventName').value.trim();
    const date = document.getElementById('eventDate').value;
    const venue = document.getElementById('eventVenue').value.trim();
    const capacity = parseInt(document.getElementById('eventCapacity').value, 10);

    // Client-side validation
    if (!name || !date || !venue || !capacity) {
      msgEl.textContent = 'All fields are required.';
      msgEl.className = 'event-message error-message';
      msgEl.style.display = 'block';
      return;
    }

    if (capacity < 1 || isNaN(capacity)) {
      msgEl.textContent = 'Capacity must be a positive number.';
      msgEl.className = 'event-message error-message';
      msgEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
    msgEl.style.display = 'none';

    try {
      await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify({ name, date, venue, capacity })
      });
      msgEl.textContent = '✅ Event created successfully!';
      msgEl.className = 'event-message success-message';
      msgEl.style.display = 'block';
      setTimeout(() => { window.location.hash = '#/events'; }, 1000);
    } catch (err) {
      msgEl.textContent = `❌ ${err.message}`;
      msgEl.className = 'event-message error-message';
      msgEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Event';
    }
  });
}
