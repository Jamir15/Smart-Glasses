/**
 * Notification Routes
 * Handles manual notification sending for testing
 */

import express from 'express';
import { sendAlertEmail } from '../services/emailService.js';
import { sendTelegramAlert } from '../services/telegramService.js';
import { getLatestData } from '../utils/dataStore.js';

const router = express.Router();

/**
 * POST /api/send-email
 * Send test email alert
 * Body: { recipientEmail: string }
 */
router.post('/send-email', async (req, res) => {
  try {
    const { recipientEmail } = req.body;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid recipient email required',
      });
    }

    const currentData = getLatestData();

    if (!currentData.eco2 || !currentData.tvoc) {
      return res.status(400).json({
        success: false,
        error: 'No sensor data available. Please ensure the ESP32 is sending data.',
      });
    }

    const result = await sendAlertEmail(
      recipientEmail,
      currentData.eco2,
      currentData.tvoc,
      currentData.eco2Classification.status,
      currentData.tvocClassification.status
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || result.reason,
      });
    }
  } catch (error) {
    console.error('Error in POST /api/send-email:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/send-telegram
 * Send test Telegram alert
 */
router.post('/send-telegram', async (req, res) => {
  try {
    const currentData = getLatestData();

    if (!currentData.eco2 || !currentData.tvoc) {
      return res.status(400).json({
        success: false,
        error: 'No sensor data available. Please ensure the ESP32 is sending data.',
      });
    }

    const result = await sendTelegramAlert(
      currentData.eco2,
      currentData.tvoc,
      currentData.eco2Classification.status,
      currentData.tvocClassification.status
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Telegram message sent successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || result.reason,
      });
    }
  } catch (error) {
    console.error('Error in POST /api/send-telegram:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
