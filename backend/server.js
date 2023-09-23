const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./Controller/Routes/auth');
const bugsRoutes = require('./Controller/Routes/bugs');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3500',
};

app.use(cors(corsOptions));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL, (err) => {
  if (!err) {
    console.log('Connected to MongoDB');
  } else {
    console.log('MongoDB Connection Error:', err);
  }
});

const PORT = process.env.PORT || 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api/bugs', bugsRoutes); // Add this line to include bugsRoutes

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
