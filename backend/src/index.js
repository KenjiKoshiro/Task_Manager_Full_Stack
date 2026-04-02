const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const distPath = path.resolve(__dirname, '../../dist');
const hasDist = fs.existsSync(distPath);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (hasDist) {
  app.use(express.static(distPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  });
