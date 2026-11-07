// server-mvc.js - PART 3 complete (MVC entry point)
require('dotenv').config();
const express = require('express');
const taskRoutes = require('./src/routes/taskRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.json({ message: 'Task API (MVC version) is ready!' });
});

app.use('/tasks', taskRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`MVC server running at http://localhost:${PORT}`);
});