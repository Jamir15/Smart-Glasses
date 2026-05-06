/**
 * Telegram Notification Service
 * Sends Telegram messages when air quality is bad
 * Real-time alerts - no cooldown
 */

import axios from 'axios';
import { getConfig } from '../utils/config.js';

const config = getConfig();


/**
 * Send alert via Telegram to one configured user
 */
export const sendTelegramAlert = async (eco2, tvoc, eco2Status, tvocStatus) => {
  // Check if bot is configured
  if (!config.telegram.botToken || !config.telegram.chatId) {
    console.log('Telegram not configured. Skipping notification.');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const message = `
🚨 *Air Quality Alert*

*eCO2 Level:*
• Value: ${eco2} ppm
• Status: ${eco2Status}

*TVOC Level:*
• Value: ${tvoc} ppb
• Status: ${tvocStatus}

⏰ Timestamp: ${new Date().toISOString()}
    `.trim();

    const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: config.telegram.chatId,
      text: message,
      parse_mode: 'Markdown',
    });

    if (response.data.ok) {
      console.log(`Telegram message sent to ${config.telegram.chatId}`);
      return { success: true, message: 'Message sent successfully' };
    }

    const errorMessage = response.data.description || 'Telegram API request failed';
    console.error(`Telegram API error: ${errorMessage}`);
    return { success: false, error: errorMessage };
  } catch (error) {
    console.error('Error in sendTelegramAlert:', error.message);
    return { success: false, error: error.message };
  }
};


