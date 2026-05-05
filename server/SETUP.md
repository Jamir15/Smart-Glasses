# 🚀 Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
```

**Required Configuration:**
- `SMTP_HOST` - Gmail SMTP: `smtp.gmail.com`
- `SMTP_PORT` - Gmail port: `587`
- `SMTP_USER` - Your Gmail address
- `SMTP_PASS` - Gmail app password (16 characters)
- `TELEGRAM_BOT_TOKEN` - Get from @BotFather on Telegram
- `TELEGRAM_CHAT_ID` - Your Telegram user ID

### 3. Start Development Server
```bash
npm run dev
```

Server runs on: **http://localhost:5000**

---

## Project Structure

```
server/src/
├── index.js                          # Main server file
├── routes/
│   ├── dataRoutes.js                # POST/GET /api/data endpoints
│   └── notificationRoutes.js        # Email & Telegram endpoints
├── services/
│   ├── emailService.js              # Nodemailer integration
│   └── telegramService.js           # Telegram Bot API
└── utils/
    ├── config.js                    # Environment configuration
    ├── dataStore.js                 # In-memory data storage
    └── qualityClassification.js     # Air quality logic
```

---

## API Endpoints

### Data Ingestion
- **POST /api/data** - Receive sensor data from ESP32
  ```bash
  curl -X POST http://localhost:5000/api/data \
    -H "Content-Type: application/json" \
    -d '{"eco2": 450, "tvoc": 120}'
  ```

### Data Retrieval
- **GET /api/data** - Get latest readings
  ```bash
  curl http://localhost:5000/api/data
  ```

### Notifications
- **POST /api/send-email** - Send test email
  ```bash
  curl -X POST http://localhost:5000/api/send-email \
    -H "Content-Type: application/json" \
    -d '{"recipientEmail": "user@example.com"}'
  ```

- **POST /api/send-telegram** - Send test Telegram
  ```bash
  curl -X POST http://localhost:5000/api/send-telegram
  ```

---

## Features

✅ **Air Quality Classification**
- eCO2: Good (<800), Moderate (800-1500), Bad (>1500)
- TVOC: Good (<220), Moderate (220-660), Bad (>660)

✅ **Smart Notifications**
- 5-minute cooldown to prevent spam
- Email alerts via Gmail
- Telegram instant messages

✅ **Error Handling**
- Input validation
- Graceful error responses
- Detailed logging in development mode

---

## Dependency Details

| Package | Purpose |
|---------|---------|
| `express` | Web server framework |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |
| `nodemailer` | Email notifications |
| `axios` | HTTP client for Telegram |
| `nodemon` | Auto-reload in development |

---

## Environment Variables Explained

```env
# Server Configuration
PORT=5000                              # Server port
NODE_ENV=development                   # Environment
FRONTEND_URL=http://localhost:5173    # CORS origin

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com              # Gmail SMTP server
SMTP_PORT=587                          # TLS port
SMTP_USER=your_email@gmail.com        # Gmail address
SMTP_PASS=xxxx xxxx xxxx xxxx         # 16-char app password
SMTP_FROM=notifications@airquality.com # From address

# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456:ABC...      # Bot token from @BotFather
TELEGRAM_CHAT_ID=987654321            # Your Telegram user ID
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### SMTP Authentication Failed
1. Enable 2FA on Google Account
2. Create app password: myaccount.google.com/security
3. Use 16-character password (without spaces)
4. Allow "Less secure app access" if needed

### Telegram Token Invalid
1. Message @BotFather on Telegram
2. Create new bot with `/newbot`
3. Copy token exactly (case-sensitive)
4. Start conversation with bot first

### CORS Errors in Browser
- Ensure `FRONTEND_URL` matches your frontend URL
- Check frontend is sending requests to correct backend URL

---

## Development Tips

### Debug Mode
Set in terminal:
```bash
NODE_ENV=development npm run dev
```

### Test Data
```bash
# Send bad quality reading
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{"eco2": 2000, "tvoc": 800}'
```

### Monitor Requests
```bash
# Watch request logs in terminal
npm run dev
```

---

## Next Steps

1. ✅ Start backend: `npm run dev`
2. ⏭️ [Set up frontend](../client/SETUP.md)
3. 🧪 Test API endpoints with curl
4. 🔌 Configure ESP32 to send data

---

## Need Help?

- Check [main README](../README.md) for complete documentation
- Review error messages in terminal (very descriptive!)
- Test endpoints manually before integration
