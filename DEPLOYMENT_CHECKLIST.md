# ✅ Complete Setup & Deployment Checklist

## 🎯 Phase 1: Local Development Setup (15 minutes)

### Backend Setup
- [ ] Navigate to `server` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add Gmail SMTP credentials to `.env`:
  - [ ] SMTP_HOST: smtp.gmail.com
  - [ ] SMTP_PORT: 587
  - [ ] SMTP_USER: your_email@gmail.com
  - [ ] SMTP_PASS: 16-character app password
- [ ] Add Telegram credentials to `.env`:
  - [ ] TELEGRAM_BOT_TOKEN: from @BotFather
  - [ ] TELEGRAM_CHAT_ID: your chat ID
- [ ] Run `npm run dev`
- [ ] Verify server starts on http://localhost:5000
- [ ] See "🚀 Server running on..." message in terminal

### Frontend Setup
- [ ] Open new terminal
- [ ] Navigate to `client` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env` (defaults are usually fine)
- [ ] Run `npm run dev`
- [ ] Verify frontend starts on http://localhost:5173
- [ ] Open browser and see the app load

---

## 🧪 Phase 2: Testing (10 minutes)

### Backend API Testing
- [ ] Test health endpoint: `curl http://localhost:5000/health`
- [ ] Test empty data: `curl http://localhost:5000/api/data`
- [ ] Send test data: 
  ```bash
  curl -X POST http://localhost:5000/api/data \
    -H "Content-Type: application/json" \
    -d '{"eco2": 450, "tvoc": 120}'
  ```
- [ ] Verify data is stored: `curl http://localhost:5000/api/data`

### Frontend Display Testing
- [ ] Open http://localhost:5173 in browser
- [ ] Verify huge numbers display
- [ ] Verify data updates every 5 seconds
- [ ] Click label to toggle eCO2 ↔ TVOC
- [ ] Verify smooth animation on toggle
- [ ] Check status color (Green = Good)

### Notification Testing
- [ ] In email input, type test email
- [ ] Click "Send Test Email"
- [ ] Verify email received in inbox
- [ ] Click "Send Telegram Test"
- [ ] Verify Telegram message received

### Data Quality Testing
- [ ] Send "Bad" eCO2 (>1500):
  ```bash
  curl -X POST http://localhost:5000/api/data \
    -H "Content-Type: application/json" \
    -d '{"eco2": 2000, "tvoc": 120}'
  ```
- [ ] Verify status changed to "Bad"
- [ ] Verify color changed to Red
- [ ] Send "Moderate" TVOC (220-660):
  ```bash
  curl -X POST http://localhost:5000/api/data \
    -H "Content-Type: application/json" \
    -d '{"eco2": 450, "tvoc": 500}'
  ```
- [ ] Verify status shows "Moderate"
- [ ] Verify color changed to Yellow

---

## 📱 Phase 3: Mobile Testing (5 minutes)

- [ ] Get your computer's IP address:
  - [ ] Windows: `ipconfig` → IPv4 Address
  - [ ] macOS: `ifconfig` → inet (on WiFi)
  - [ ] Linux: `hostname -I`
- [ ] On mobile device, connect to same WiFi
- [ ] Open browser to `http://<your_ip>:5173`
- [ ] Verify app loads and displays correctly
- [ ] Test on portrait and landscape modes
- [ ] Verify numbers are readable and touchable
- [ ] Test toggle button works on mobile

---

## 🔌 Phase 4: ESP32 Integration (Optional)

- [ ] Download Arduino IDE
- [ ] Add ESP32 board package
- [ ] Install Adafruit SGP30 library
- [ ] Copy code from [ESP32_INTEGRATION.md](ESP32_INTEGRATION.md)
- [ ] Update WiFi SSID and password
- [ ] Update SERVER_URL to your computer's IP
- [ ] Connect SGP30 sensor via I2C:
  - [ ] VCC → 3.3V
  - [ ] GND → GND
  - [ ] SDA → GPIO 21
  - [ ] SCL → GPIO 22
- [ ] Upload sketch to ESP32
- [ ] Check Serial Monitor for readings
- [ ] Verify data appears in frontend

---

## 🚀 Phase 5: Production Build

### Frontend Build
- [ ] In `client` folder, run `npm run build`
- [ ] Verify `dist/` folder is created
- [ ] Verify no build errors
- [ ] Run `npm run preview` to test build locally

### Backend Production Readiness
- [ ] Verify all dependencies in package.json
- [ ] Test with `NODE_ENV=production npm start`
- [ ] No console errors or warnings

---

## 🌐 Phase 6: Deployment to Render

### Deploy Backend

**Prerequisites:**
- [ ] GitHub account created
- [ ] Repository created (or fork this project)
- [ ] Code pushed to GitHub main branch
- [ ] Render.com account created

**Steps:**
- [ ] Log into Render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select `server` directory:
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] PORT: 5000
  - [ ] NODE_ENV: production
  - [ ] FRONTEND_URL: (will update after frontend deployed)
  - [ ] SMTP_HOST: smtp.gmail.com
  - [ ] SMTP_PORT: 587
  - [ ] SMTP_USER: (your email)
  - [ ] SMTP_PASS: (app password)
  - [ ] TELEGRAM_BOT_TOKEN: (your token)
  - [ ] TELEGRAM_CHAT_ID: (your chat ID)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Copy backend URL (e.g., https://air-quality-api.onrender.com)

### Deploy Frontend

**Steps:**
- [ ] Log into Render.com
- [ ] Click "New +" → "Static Site"
- [ ] Connect GitHub repository
- [ ] Select `client` directory:
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Publish Directory: `dist`
- [ ] Add Environment Variables:
  - [ ] VITE_API_URL: (your backend URL from above)
- [ ] Click "Create Static Site"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy frontend URL (e.g., https://air-quality-monitor.onrender.com)

### Update Backend CORS

- [ ] Go back to backend service on Render
- [ ] Edit Environment Variables
- [ ] Update FRONTEND_URL to your frontend URL
- [ ] Save and auto-redeploy

### Verify Deployment

- [ ] Open frontend URL in browser
- [ ] Verify data loads
- [ ] Send test email from production
- [ ] Send test Telegram from production
- [ ] Check that everything works on deployed version

---

## 🔧 Phase 7: Maintenance & Monitoring

### Regular Checks
- [ ] Monitor Render dashboard for errors
- [ ] Check logs for unusual activity
- [ ] Test notifications periodically
- [ ] Monitor API response times
- [ ] Check database storage (if added later)

### Updates & Scaling
- [ ] Update dependencies quarterly: `npm update`
- [ ] Monitor Render usage (free tier limits)
- [ ] Plan upgrade if approaching limits
- [ ] Backup important data

---

## 📋 Troubleshooting Checklist

### Backend Won't Start
- [ ] Check .env file exists and is readable
- [ ] Verify all required env vars are set
- [ ] Check port 5000 isn't already in use
- [ ] Run `npm install` again
- [ ] Check Node.js version (v16+)

### Frontend Can't Connect to Backend
- [ ] Verify backend is running
- [ ] Check VITE_API_URL in frontend .env
- [ ] Open browser DevTools → Network tab
- [ ] Check CORS headers in response
- [ ] Verify backend FRONTEND_URL matches frontend domain

### Email Not Sending
- [ ] Verify Gmail app password (16 chars, no spaces)
- [ ] Enable 2FA on Gmail
- [ ] Check SMTP credentials in .env
- [ ] Look for error in server terminal
- [ ] Test with different email recipient

### Telegram Not Sending
- [ ] Verify bot token is correct
- [ ] Verify chat ID is numeric
- [ ] Start conversation with bot first
- [ ] Check Telegram API is accessible from your network
- [ ] Look for error in server terminal

### Data Not Appearing
- [ ] Send test data via curl
- [ ] Check GET /api/data returns data
- [ ] Refresh browser (Ctrl+R or Cmd+R)
- [ ] Check browser console for errors
- [ ] Verify poll interval is 5 seconds

---

## ✨ Optimization Checklist

### Frontend Performance
- [ ] Run `npm run build` and check bundle size
- [ ] Enable browser caching
- [ ] Minify CSS is automatic via Tailwind
- [ ] Test on slow network (DevTools → Throttle)

### Backend Performance
- [ ] Monitor memory usage on Render
- [ ] Check database query times (if using DB later)
- [ ] Review API response times
- [ ] Add caching for frequently accessed data

### Cost Optimization (Render Free Tier)
- [ ] Keep poll interval at 5 seconds or higher
- [ ] Limit notification cooldown to reduce DB writes
- [ ] Archive old data if stored
- [ ] Monitor bandwidth usage

---

## 🔐 Security Verification

- [ ] No .env files committed to GitHub
- [ ] .gitignore includes node_modules
- [ ] GitHub repo is private (if sensitive)
- [ ] No hardcoded credentials anywhere
- [ ] Email validation implemented
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced in production
- [ ] CORS origin is specific (not *)

---

## 📚 Documentation Verification

- [ ] README.md is complete and accurate
- [ ] All code is commented properly
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Setup instructions are clear
- [ ] Troubleshooting guide covers common issues
- [ ] ESP32 integration guide is complete

---

## 🎯 Final Verification

### Before Calling Complete:

**Functionality:**
- [ ] Data ingestion works (ESP32 → Backend)
- [ ] Data retrieval works (Backend → Frontend)
- [ ] Email notifications work
- [ ] Telegram notifications work
- [ ] UI displays all information correctly
- [ ] Mobile responsive works
- [ ] Toggle between eCO2/TVOC works
- [ ] Color changes based on status

**Quality:**
- [ ] No console errors
- [ ] No server errors
- [ ] Smooth animations
- [ ] Fast response times
- [ ] Clean code structure
- [ ] Proper error handling

**Deployment:**
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] Production works correctly
- [ ] URLs are accessible
- [ ] Environment variables configured
- [ ] Monitoring set up

---

## 📞 Support Resources

If you get stuck:
1. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. Review [README.md](README.md)
3. Check specific SETUP.md files
4. See [ESP32_INTEGRATION.md](ESP32_INTEGRATION.md)
5. Read troubleshooting sections

---

## 🎉 Deployment Complete Checklist

When this is done, you have:

- ✅ A running local development environment
- ✅ A tested mobile-responsive frontend
- ✅ A production-ready backend API
- ✅ Working email notifications
- ✅ Working Telegram notifications
- ✅ Deployed to Render (production)
- ✅ ESP32 integration ready
- ✅ Complete documentation
- ✅ Scalable, maintainable code

**Congratulations! Your air quality monitoring system is live! 🚀**

---

## 📊 Next Phase (Optional Enhancements)

- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Add user authentication
- [ ] Add data history & charts
- [ ] Add multiple locations
- [ ] Add mobile app (React Native)
- [ ] Add admin dashboard
- [ ] Add REST API documentation (Swagger)
- [ ] Add automated tests
- [ ] Add CI/CD pipeline
- [ ] Add metrics & analytics

---

**Track your progress with this checklist - Print it out and check off as you go!** ✅
