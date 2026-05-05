# 🌍 Smart Glasses Air Quality Monitoring System

A scalable, mobile-first web application for real-time air quality monitoring with ESP32 sensor integration, email alerts, and Telegram notifications.

## 🎯 Features

✅ **Real-time Air Quality Monitoring**
- eCO2 (CO2 equivalent) measurement
- TVOC (Total Volatile Organic Compounds) tracking
- Live status classification (Good/Moderate/Bad)

✅ **Mobile-First Design**
- Responsive UI optimized for smart glasses and mobile devices
- Large, easy-to-read numbers with color-coded status
- Smooth animations and transitions

✅ **Smart Notifications**
- Email alerts via Nodemailer (with 5-minute cooldown to prevent spam)
- Telegram bot integration for instant messaging
- Manual test email sending for demo purposes

✅ **ESP32 Integration**
- REST API endpoint for sensor data ingestion
- Timestamp tracking for all readings
- In-memory data storage (upgrade to database for production)

✅ **Scalable Architecture**
- Modular code structure (routes, services, utils)
- Clean separation of concerns
- Easy to extend with additional features

✅ **Optimized for Render Free Tier**
- Lightweight Node.js backend
- Minimal dependencies
- Low memory footprint

---

## 📁 Project Structure

```
Smart Glasses/
├── server/                    # Node.js + Express API
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   │   ├── dataRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── services/         # Business logic
│   │   │   ├── emailService.js
│   │   │   └── telegramService.js
│   │   ├── utils/            # Helper functions
│   │   │   ├── qualityClassification.js
│   │   │   ├── config.js
│   │   │   └── dataStore.js
│   │   └── index.js          # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── client/                    # React + Vite frontend
    ├── src/
    │   ├── components/       # React components
    │   │   ├── AirQualityDisplay.jsx
    │   │   └── EmailControl.jsx
    │   ├── services/         # API communication
    │   │   └── apiService.js
    │   ├── utils/            # Utilities & helpers
    │   │   └── helpers.js
    │   ├── App.jsx           # Root component
    │   ├── main.jsx          # Entry point
    │   └── index.css         # Global styles
    ├── public/               # Static assets
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    ├── .env.example
    └── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ and **npm** (or yarn)
- **Gmail account** with app password (for email notifications)
- **Telegram Bot Token** and Chat ID (for Telegram notifications)

### Step 1: Set Up Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials
# - SMTP credentials for Gmail
# - Telegram bot token and chat ID
```

**Configure .env file:**
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Gmail SMTP (enable 2FA, create App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=notifications@airquality.com

# Telegram Bot (get token from @BotFather)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

**Start the backend:**
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Server will be available at: `http://localhost:5000`

---

### Step 2: Set Up Frontend

```bash
# Open new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# .env should contain (usually defaults are fine):
# VITE_API_URL=http://localhost:5000
```

**Start the frontend:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📡 API Endpoints

### **Data Endpoints**

#### `GET /api/data`
Retrieve the latest sensor readings.

**Response:**
```json
{
  "success": true,
  "data": {
    "eco2": 450,
    "tvoc": 120,
    "timestamp": "2026-05-04T12:30:45.123Z",
    "eco2Classification": {
      "status": "Good",
      "color": "#10B981",
      "label": "GOOD"
    },
    "tvocClassification": {
      "status": "Good",
      "color": "#10B981",
      "label": "GOOD"
    }
  }
}
```

---

#### `POST /api/data`
Submit sensor data from ESP32.

**Request Body:**
```json
{
  "eco2": 450,
  "tvoc": 120
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data received and stored",
  "data": { ... }
}
```

---

### **Notification Endpoints**

#### `POST /api/send-email`
Manually send a test email alert.

**Request Body:**
```json
{
  "recipientEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

#### `POST /api/send-telegram`
Manually send a test Telegram alert.

**Response:**
```json
{
  "success": true,
  "message": "Telegram message sent successfully"
}
```

---

### **Health Check**

#### `GET /health`
Check server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-04T12:30:45.123Z"
}
```

---

## 🔌 ESP32 Integration

### Simple Example Code (Arduino/MicroPython)

**Arduino (C++):**
```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* SSID = "your_wifi_ssid";
const char* PASSWORD = "your_wifi_password";
const char* SERVER_URL = "http://your-server:5000/api/data";

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
}

void loop() {
  if (WiFi.connected()) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    
    // Read from your CO2/TVOC sensor
    int eco2 = readECO2();  // Your sensor reading
    int tvoc = readTVOC();  // Your sensor reading
    
    String payload = "{\"eco2\":" + String(eco2) + ",\"tvoc\":" + String(tvoc) + "}";
    
    int httpCode = http.POST(payload);
    Serial.println("HTTP Response: " + String(httpCode));
    
    http.end();
  }
  
  delay(5000);  // Send every 5 seconds
}
```

---

## 🎨 Air Quality Classifications

### eCO2 Levels (ppm)
| Status | Range | Color |
|--------|-------|-------|
| Good | < 800 | 🟢 Green |
| Moderate | 800–1500 | 🟡 Yellow |
| Bad | > 1500 | 🔴 Red |

### TVOC Levels (ppb)
| Status | Range | Color |
|--------|-------|-------|
| Good | < 220 | 🟢 Green |
| Moderate | 220–660 | 🟡 Yellow |
| Bad | > 660 | 🔴 Red |

---

## ⚙️ Configuration Guide

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication** in your Google Account
2. **Generate App Password:**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Navigate to "App passwords"
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
3. **Add to .env:**
   ```env
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   ```

### Telegram Bot Setup

1. **Create a Bot:**
   - Open Telegram and search for `@BotFather`
   - Follow instructions to create a new bot
   - Copy the Bot Token
2. **Get Chat ID:**
   - Start a chat with your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your user ID in the response
3. **Add to .env:**
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```

---

## 📦 Deployment to Render

### Backend Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Create Render Web Service:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
   - Add Environment Variables from your `.env` file
   - Deploy!

### Frontend Deployment

1. **Build the app:**
   ```bash
   cd client
   npm run build
   ```

2. **Create Render Static Site:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Set Build Command: `npm install && npm run build`
   - Set Publish Directory: `dist`
   - Deploy!

3. **Update Backend CORS:**
   After deploying frontend, update `FRONTEND_URL` in backend's `.env`:
   ```env
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

---

## 🧪 Testing

### Test Data Submission

```bash
# Send test data to backend
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{"eco2": 1600, "tvoc": 700}'
```

### Fetch Latest Data

```bash
curl http://localhost:5000/api/data
```

### Send Test Email

```bash
curl -X POST http://localhost:5000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"recipientEmail": "your_email@example.com"}'
```

### Send Test Telegram

```bash
curl -X POST http://localhost:5000/api/send-telegram \
  -H "Content-Type: application/json"
```

---

## 🔧 Troubleshooting

### Email Not Sending
- ✓ Check Gmail app password is correct (16 chars)
- ✓ Verify 2FA is enabled on Google Account
- ✓ Ensure `SMTP_USER` and `SMTP_PASS` are in `.env`
- ✓ Check server logs for error messages

### Telegram Not Sending
- ✓ Verify bot token is correct
- ✓ Ensure chat ID is valid (should be a number)
- ✓ Test bot connection: `https://api.telegram.org/bot<TOKEN>/getMe`

### Frontend Can't Connect to Backend
- ✓ Ensure backend is running (`npm run dev`)
- ✓ Check `VITE_API_URL` in client `.env`
- ✓ Verify CORS settings in backend `index.js`
- ✓ Check browser console for error messages

### Data Not Appearing
- ✓ Send test data: `curl -X POST http://localhost:5000/api/data -H "Content-Type: application/json" -d '{"eco2": 450, "tvoc": 120}'`
- ✓ Check GET `/api/data` returns data
- ✓ Ensure frontend is polling every 5 seconds (check Network tab)

---

## 🎯 Performance Optimization Tips (Render Free Tier)

1. **Code Minification:** Frontend is auto-minified by Vite
2. **Lazy Loading:** Components load on demand
3. **API Polling:** 5-second intervals balance responsiveness and server load
4. **Memory Storage:** In-memory data store prevents database overhead
5. **Small Payload:** Minimal JSON response size
6. **Cooldown Mechanism:** Prevents notification spam and reduces workload

---

## 📝 Environment Variables Reference

### Server (.env)
```env
# Server Config
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=notifications@airquality.com

# Telegram
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📚 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **Styling** | Tailwind CSS | Mobile-first design |
| **Build Tool** | Vite | Fast development & production builds |
| **Backend** | Node.js + Express | RESTful API server |
| **Email** | Nodemailer | SMTP-based notifications |
| **Messaging** | Telegram Bot API | Real-time alerts |
| **Hosting** | Render | Cost-effective deployment |

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🤝 Contributing

Found a bug or have a feature request? Feel free to contribute!

---

## 📧 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review API endpoint documentation
3. Check server logs: `npm run dev` shows detailed output

---

**Built with ❤️ for smart glasses and IoT air quality monitoring**
