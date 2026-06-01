// Login page

function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <h1>College Event Portal</h1>
        <p class="login-subtitle">Sign in to your account</p>
        <form id="loginForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" required autocomplete="username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password">
          </div>
          <div id="loginError" class="error-message" style="display:none;"></div>
          <button type="submit" class="btn btn-primary btn-full" id="loginSubmitBtn">Sign In</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('loginError');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    errorEl.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      await Auth.login(username, password);
      window.location.hash = '#/events';
    } catch (err) {
      errorEl.textContent = err.message || 'Login failed. Please try again.';
      errorEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}
