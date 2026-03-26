const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS — allow local dev + Netlify production frontend
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  /\.netlify\.app$/,       // any Netlify preview URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests (Postman, seeder)
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    allowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/upload',   require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'The Vault is operational.', env: process.env.NODE_ENV })
);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✦ The Vault is connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`✦ Sovranty Gems Server running on port ${PORT}`)
    );
  })
  .catch(err => { console.error(err); process.exit(1); });