const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./Controller/Routes/auth');
const bugsRoutes = require('./Controller/Routes/bugs');
require('dotenv').config();

const app = express();

mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 3500;
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/bug-tracker';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api/bugs', bugsRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
  }
}

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
