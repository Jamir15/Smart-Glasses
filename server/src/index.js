/**
 * Smart Glasses Air Quality API
 * Main Express Server
 */

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getConfig } from './utils/config.js';
import dataRoutes from './routes/dataRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const config = getConfig();

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Routes
app.use('/api', dataRoutes);
app.use('/api', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Glasses Air Quality Monitor API',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check',
      'GET /api/data': 'Get latest air quality data',
      'POST /api/data': 'Receive sensor data from ESP32',
      'POST /api/send-email': 'Send test email alert',
      'POST /api/send-telegram': 'Send test Telegram alert',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
});
