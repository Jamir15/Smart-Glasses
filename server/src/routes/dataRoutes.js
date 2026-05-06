/**
 * Air Quality Data Routes
 * Handles sensor data ingestion and retrieval
 */

import express from 'express';
import { classifyECO2, classifyTVOC, isBadStatus } from '../utils/qualityClassification.js';
import { getLatestData, setLatestData } from '../utils/dataStore.js';
import { sendAlertEmail, shouldSendAlert as shouldSendEmailAlert } from '../services/emailService.js';
import { sendTelegramAlert } from '../services/telegramService.js';

const router = express.Router();

/**
 * POST /api/data
 * Receive sensor data from ESP32
 * Body: { eco2: number, tvoc: number }
 */
router.post('/data', async (req, res) => {
  try {
    const { eco2, tvoc } = req.body;

    // Validate input
    if (typeof eco2 !== 'number' || typeof tvoc !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data. eco2 and tvoc must be numbers.',
      });
    }

    // Classify air quality
    const eco2Classification = classifyECO2(eco2);
    const tvocClassification = classifyTVOC(tvoc);

    // Store data
    const newData = {
      eco2,
      tvoc,
      timestamp: new Date().toISOString(),
      eco2Classification,
      tvocClassification,
    };

    setLatestData(newData);

    // Check if alert should be sent
    if (isBadStatus(eco2Classification, tvocClassification)) {
      await sendTelegramAlert(eco2, tvoc, eco2Classification.status, tvocClassification.status);
      // Note: Email alert would need a default recipient; for manual sending via POST /api/send-email
    }

    res.json({
      success: true,
      message: 'Data received and stored',
      data: newData,
    });
  } catch (error) {
    console.error('Error in POST /api/data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/data
 * Retrieve latest sensor data
 */
router.get('/data', (req, res) => {
  try {
    const data = getLatestData();

    if (data.eco2 === null || data.tvoc === null) {
      return res.json({
        success: true,
        data: null,
        message: 'No data available yet. Waiting for first sensor reading.',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in GET /api/data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
