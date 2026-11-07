// server-mvc.js - PART 3 complete (MVC entry point)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const taskRoutes = require('./src/routes/taskRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files (index.html, script.js, style.css)
app.use(express.static(path.join(__dirname)));

app.use(express.json());
app.use(cors({
  origin: [
    'https://05230131jnec-svg.github.io',
    'http://127.0.0.1:5500',
    'http://localhost:3000'
  ]
}));

// Root endpoint serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`MVC server running at http://localhost:${PORT}`);
});