const API_URL = 'https://task-api-cv4k.onrender.com/tasks';
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// 1. Fetch & display tasks
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">
          ${task.title}
        </span>
        <button onclick="toggleTask(${task.id}, ${!task.completed})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
}

// 2. Add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  taskInput.value = '';
  fetchTasks();
});

// 3. Toggle task completion
async function toggleTask(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  fetchTasks();
}

// 4. Delete task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

// Load tasks on startup
fetchTasks();