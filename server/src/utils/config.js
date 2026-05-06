/**
 * Configuration Management
 * Centralized environment variables and config
 */

const parseTelegramChatId = () => {
  if (process.env.TELEGRAM_CHAT_ID) {
    return process.env.TELEGRAM_CHAT_ID.trim();
  }

  // Backward compatibility: if TELEGRAM_CHAT_IDS is present, use only the first ID.
  const rawChatIds = process.env.TELEGRAM_CHAT_IDS || '';
  return rawChatIds
    .split(',')
    .map((id) => id.trim())
    .find(Boolean);
};

export const getConfig = () => ({
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Email Configuration
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'notifications@airquality.com',
  },
  
  // Telegram Configuration
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: parseTelegramChatId(),
  },
});
