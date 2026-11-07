const API_URL = 'https://task-api-cv4k.onrender.com';
let isLoginMode = true;

// Toggle Login / Register UI
document.getElementById('toggle-auth')?.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  document.getElementById('auth-title').innerText = isLoginMode ? 'Login' : 'Register';
  document.getElementById('auth-submit-btn').innerText = isLoginMode ? 'Login' : 'Register';
  document.getElementById('toggle-auth').innerText = isLoginMode ? 'Need an account? Register' : 'Have an account? Login';
});

// Submit Login / Register Form
document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  const endpoint = isLoginMode ? '/auth/login' : '/auth/register';

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');

    if (isLoginMode) {
      localStorage.setItem('token', data.token);
      checkAuthStatus();
    } else {
      alert('Registration successful! Please log in.');
      document.getElementById('toggle-auth').click();
    }
  } catch (err) {
    alert(err.message);
  }
});

// Helper for JWT Headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Show/Hide forms based on token
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const authContainer = document.getElementById('auth-container');
  const taskAppContainer = document.getElementById('task-app-container');

  if (token) {
    if (authContainer) authContainer.style.display = 'none';
    if (taskAppContainer) taskAppContainer.style.display = 'block';
    fetchTasks();
  } else {
    if (authContainer) authContainer.style.display = 'block';
    if (taskAppContainer) taskAppContainer.style.display = 'none';
  }
}

// Logout Listener
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  checkAuthStatus();
});

// Fetch tasks with Auth header attached
async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() });
    if (res.status === 401 || res.status === 400) {
      localStorage.removeItem('token');
      checkAuthStatus();
      return;
    }
    const tasks = await res.json();
    if (typeof renderTasks === 'function') {
      renderTasks(tasks);
    }
  } catch (err) {
    console.error(err);
  }
}

// Run auth check on page load
checkAuthStatus();