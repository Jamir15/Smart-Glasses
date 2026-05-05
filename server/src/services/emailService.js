/**
 * Email Notification Service
 * Sends email notifications when air quality is bad
 * Includes cooldown to prevent spam
 */

import nodemailer from 'nodemailer';
import { getConfig } from '../utils/config.js';

const config = getConfig();

// Cooldown tracking (5 minutes = 300000 ms)
const COOLDOWN_MS = 5 * 60 * 1000;
let lastNotificationTime = 0;

// Initialize transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465, // true for 465, false for other ports
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

/**
 * Check if enough time has passed since last notification
 */
const canSendNotification = () => {
  const now = Date.now();
  return now - lastNotificationTime >= COOLDOWN_MS;
};

/**
 * Send alert email
 */
export const sendAlertEmail = async (recipientEmail, eco2, tvoc, eco2Status, tvocStatus) => {
  // Check cooldown
  if (!canSendNotification()) {
    console.log('Email notification on cooldown. Skipping...');
    return { success: false, reason: 'cooldown' };
  }

  try {
    const transporter = getTransporter();

    const htmlContent = `
      <h2>⚠️ Air Quality Alert</h2>
      <p>Timestamp: ${new Date().toISOString()}</p>
      
      <h3>eCO2 Level</h3>
      <p><strong>Value:</strong> ${eco2} ppm</p>
      <p><strong>Status:</strong> <span style="color: ${getStatusColor(eco2Status)}">${eco2Status}</span></p>
      
      <h3>TVOC Level</h3>
      <p><strong>Value:</strong> ${tvoc} ppb</p>
      <p><strong>Status:</strong> <span style="color: ${getStatusColor(tvocStatus)}">${tvocStatus}</span></p>
      
      <p style="margin-top: 20px; color: #666;">
        Please check your air quality monitor for more details.
      </p>
    `;

    const mailOptions = {
      from: config.smtp.from,
      to: recipientEmail,
      subject: '⚠️ Air Quality Alert - Smart Glasses Monitor',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    lastNotificationTime = Date.now();
    console.log(`Email sent to ${recipientEmail}`);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get color code for status
 */
const getStatusColor = (status) => {
  const colors = {
    Good: '#10B981',
    Moderate: '#F59E0B',
    Bad: '#EF4444',
  };
  return colors[status] || '#000000';
};

/**
 * Check if should send alert (based on cooldown)
 */
export const shouldSendAlert = () => canSendNotification();

/**
 * Get time until next alert can be sent (in seconds)
 */
export const getTimeUntilNextAlert = () => {
  const now = Date.now();
  const timePassed = now - lastNotificationTime;
  const timeRemaining = Math.max(0, COOLDOWN_MS - timePassed);
  return Math.ceil(timeRemaining / 1000);
};
