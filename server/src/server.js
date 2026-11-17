import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { connectDB } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend files if built
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // In development, if dist doesn't exist yet, return helpful JSON
      res.status(200).json({
        message: 'Humanity AI Email Platform API Server is running.',
        apiEndpoint: '/api',
        clientDevUrl: 'http://localhost:5173'
      });
    }
  });
});

// Start DB connection check
connectDB();

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌟 Humanity AI Email Management API Server`);
  console.log(`📍 Listening on: http://localhost:${PORT}`);
  console.log(`🔌 API Health:    http://localhost:${PORT}/api/health`);
  console.log(`✉️ Emails API:   http://localhost:${PORT}/api/emails`);
  console.log(`======================================================\n`);
});
