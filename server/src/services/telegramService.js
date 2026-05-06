/**
 * Telegram Notification Service
 * Sends Telegram messages when air quality is bad
 * Real-time alerts - no cooldown
 */

import axios from 'axios';
import { getConfig } from '../utils/config.js';

const config = getConfig();


/**
 * Send alert via Telegram to all configured users
 */
export const sendTelegramAlert = async (eco2, tvoc, eco2Status, tvocStatus) => {
  // Check if bot is configured
  if (!config.telegram.botToken || !config.telegram.chatIds || config.telegram.chatIds.length === 0) {
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
    const results = [];

    // Send to all configured chat IDs
    for (const chatId of config.telegram.chatIds) {
      try {
        const response = await axios.post(url, {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        });

        if (response.data.ok) {
          console.log(`Telegram message sent to ${chatId}`);
          results.push({ chatId, success: true });
        } else {
          console.error(`Telegram API error for ${chatId}:`, response.data.description);
          results.push({ chatId, success: false, error: response.data.description });
        }
      } catch (error) {
        console.error(`Error sending to ${chatId}:`, error.message);
        results.push({ chatId, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    if (successCount > 0) {
      console.log(`Telegram alerts sent successfully to ${successCount}/${totalCount} recipients`);
      return { success: true, message: `Messages sent to ${successCount}/${totalCount} users`, results };
    } else {
      console.error('Failed to send Telegram alerts to any recipients');
      return { success: false, message: 'Failed to send to any recipients', results };
    }
  } catch (error) {
    console.error('Error in sendTelegramAlert:', error.message);
    return { success: false, error: error.message };
  }
};


