# 🔌 ESP32 Integration Guide

This guide shows how to connect your ESP32 sensor (CO2/TVOC) to the Air Quality Monitoring System.

## Sensor Hardware

### Supported Sensors
- **SGP30** - eCO2 and TVOC sensor
- **SGP40** - VOC sensor
- **CCS811** - Air quality sensor
- **MH-Z19** - CO2 sensor

Example assumes SGP30 (most common).

---

## Arduino Code (C++)

### Required Libraries
```
- WiFi.h (built-in)
- HTTPClient.h (built-in)
- Adafruit_SGP30 (install via Arduino IDE)
- Wire.h (built-in for I2C)
```

### Installation
1. Arduino IDE → Sketch → Include Library → Manage Libraries
2. Search and install:
   - "Adafruit SGP30" by Adafruit
   - "Adafruit BusIO" by Adafruit

### Complete Example Code

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include "Adafruit_SGP30.h"

// ============= CONFIGURATION =============
const char* SSID = "your_wifi_ssid";
const char* PASSWORD = "your_wifi_password";
const char* SERVER_URL = "http://your_server_ip:5000/api/data";
const unsigned long SEND_INTERVAL = 5000;  // 5 seconds

// ============= GLOBALS =============
Adafruit_SGP30 sgp;
unsigned long lastSendTime = 0;

// ============= SETUP =============
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize I2C
  Wire.begin();
  
  // Initialize sensor
  if (!sgp.begin()) {
    Serial.println("❌ SGP30 sensor not found!");
    while (true);
  }
  
  Serial.println("✓ SGP30 initialized");
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi connection failed!");
  }
}

// ============= MAIN LOOP =============
void loop() {
  // Check if it's time to send data
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = millis();
    
    // Read sensor values
    if (!sgp.IAQmeasure()) {
      Serial.println("❌ Measurement failed");
      return;
    }
    
    uint16_t eco2 = sgp.eCO2;
    uint16_t tvoc = sgp.TVOC;
    
    Serial.print("eCO2: ");
    Serial.print(eco2);
    Serial.print(" ppm | TVOC: ");
    Serial.print(tvoc);
    Serial.println(" ppb");
    
    // Send to server
    sendData(eco2, tvoc);
  }
}

// ============= SEND DATA TO SERVER =============
void sendData(uint16_t eco2, uint16_t tvoc) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Create JSON payload
    String jsonPayload = "{\"eco2\":" + String(eco2) + ",\"tvoc\":" + String(tvoc) + "}";
    
    // Send POST request
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    
    int httpCode = http.POST(jsonPayload);
    
    // Check response
    if (httpCode == HTTP_CODE_OK) {
      String response = http.getString();
      Serial.println("✓ Data sent successfully");
      Serial.println(response);
    } else {
      Serial.print("❌ HTTP Error: ");
      Serial.println(httpCode);
    }
    
    http.end();
  } else {
    Serial.println("❌ WiFi not connected");
  }
}
```

---

## MicroPython Code (CircuitPython)

### Required Libraries
```
- adafruit_sgp30
- requests
- network
```

### Complete Example

```python
import board
import busio
import adafruit_sgp30
import network
import requests
import time

# ============= CONFIGURATION =============
SSID = "your_wifi_ssid"
PASSWORD = "your_wifi_password"
SERVER_URL = "http://your_server_ip:5000/api/data"
SEND_INTERVAL = 5  # seconds

# ============= INITIALIZE I2C & SENSOR =============
i2c = busio.I2C(board.SCL, board.SDA)
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c)

print("✓ SGP30 initialized")
print(f"Serial number: {sgp30.serial}")

# ============= CONNECT TO WIFI =============
wifi = network.WLAN(network.STA_IF)
wifi.active(True)
wifi.connect(SSID, PASSWORD)

print(f"Connecting to {SSID}...")
timeout = 20
while not wifi.isconnected() and timeout > 0:
    time.sleep(0.5)
    print(".", end="")
    timeout -= 1

if wifi.isconnected():
    print(f"\n✓ WiFi connected\nIP: {wifi.ifconfig()[0]}")
else:
    print("\n❌ WiFi connection failed")

# ============= MAIN LOOP =============
last_send = time.time()

while True:
    # Check if time to send
    if time.time() - last_send >= SEND_INTERVAL:
        last_send = time.time()
        
        # Read sensor
        eco2, tvoc = sgp30.iaq_measure()
        
        print(f"eCO2: {eco2} ppm | TVOC: {tvoc} ppb")
        
        # Send data
        try:
            payload = {"eco2": eco2, "tvoc": tvoc}
            response = requests.post(SERVER_URL, json=payload)
            print(f"✓ Response: {response.status_code}")
            response.close()
        except Exception as e:
            print(f"❌ Error: {e}")
    
    time.sleep(0.1)
```

---

## Hardware Connections

### ESP32 to SGP30 Sensor

| ESP32 Pin | SGP30 Pin | Color (Typical) |
|-----------|-----------|-----------------|
| 3V3 | VCC | Red |
| GND | GND | Black |
| GPIO 21 (SDA) | SDA | Yellow |
| GPIO 22 (SCL) | SCL | Green |

### Wiring Diagram
```
ESP32          SGP30
----          -----
3V3  ------+  VCC
           |
GND  ------+  GND
           |
GPIO21 ----+  SDA
   (SDA)    |
           |
GPIO22 ----+  SCL
   (SCL)
```

---

## Board Setup

### Arduino IDE Configuration

1. **Install ESP32 Board Package:**
   - File → Preferences
   - Add: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Board Manager → Install "esp32 by Espressif Systems"

2. **Select Board:**
   - Tools → Board → ESP32 → "ESP32 Dev Module"

3. **Configure Settings:**
   - Tools → Port → Select your COM port
   - Tools → Upload Speed → 115200
   - Tools → Flash Frequency → 80 MHz

### Upload Sketch
1. Copy code above
2. Paste into Arduino IDE
3. Modify WiFi SSID, PASSWORD, and SERVER_URL
4. Upload (Ctrl+U)
5. Open Serial Monitor (Ctrl+Shift+M) to see output

---

## Configuration

### Update Credentials
```cpp
const char* SSID = "your_wifi_ssid";
const char* PASSWORD = "your_wifi_password";
const char* SERVER_URL = "http://192.168.1.100:5000/api/data";  // Change IP!
```

### Network Address

**Find your computer's IP:**

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (something like 192.168.1.100)

**macOS/Linux:**
```bash
ifconfig
```
Look for "inet" address on WiFi interface

---

## Testing

### Check Serial Output
```
✓ SGP30 initialized
Connecting to wifi.
✓ WiFi connected
IP: 192.168.1.50
eCO2: 450 ppm | TVOC: 120 ppb
✓ Data sent successfully
```

### Test Backend Receives Data
```bash
# In another terminal
curl http://localhost:5000/api/data
```

You should see:
```json
{
  "eco2": 450,
  "tvoc": 120,
  "timestamp": "2026-05-04T...",
  ...
}
```

---

## Troubleshooting

### Sensor Not Found
```
❌ SGP30 sensor not found!
```

**Fix:**
- Check I2C connections (SDA/SCL)
- Verify 3.3V power
- Check I2C address (default 0x58)
- Try I2C scanner to verify

### WiFi Connection Fails
```
❌ WiFi connection failed
```

**Fix:**
- Verify SSID and password
- Check ESP32 is in range
- Try simpler SSID (no special characters)
- Ensure 2.4GHz network (not 5GHz)

### Data Not Reaching Server
```
❌ HTTP Error: 111
```

**Fix:**
- Verify server is running
- Check IP address in SERVER_URL
- Ensure no firewall blocking port 5000
- Test connectivity: `ping <server_ip>`

### Serial Monitor Shows Garbage
```
v'Ȱ÷e€Ὑ7∆©jԁŶՒ▄
```

**Fix:**
- Set baud rate to **115200**
- Correct USB driver installed
- Try different USB cable

---

## Power Consumption

### Normal Operation
- WiFi active: ~80-100 mA
- Sensor reading: ~10 mA
- Sleep mode: ~10 µA

### Tips for Battery
- Use deep sleep between readings
- Increase send interval from 5s to 30s
- Disable WiFi when not transmitting

---

## Data Format

### Request to Server
```json
{
  "eco2": 450,
  "tvoc": 120
}
```

### Server Response
```json
{
  "success": true,
  "message": "Data received and stored",
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

## Sensor Calibration

### Initial Warm-up
- SGP30 needs ~15 seconds warm-up time
- First readings may be inaccurate
- After ~1 hour readings stabilize

### Baseline Reset
```cpp
// Optional: Reset baseline after warm-up
sgp30.setIAQBaseline(0x8973, 0x8AAE);
```

---

## Production Deployment

### For Render Deployment

Update SERVER_URL:
```cpp
const char* SERVER_URL = "https://your-backend.onrender.com/api/data";
```

Note: Use `https://` for production!

### Security Considerations
- Use HTTPS only
- Consider adding API key authentication
- Sanitize data before storage
- Rate limit requests

---

## Additional Resources

- [Adafruit SGP30 Library](https://github.com/adafruit/Adafruit_SGP30)
- [ESP32 Arduino Reference](https://docs.espressif.com/projects/arduino-esp32/en/latest/)
- [WiFi Setup Guide](https://www.arduino.cc/reference/en/libraries/wifi/)
- [HTTP Client Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/protocols/esp_http_client.html)

---

## Quick Setup Checklist

- [ ] Install Arduino IDE
- [ ] Add ESP32 board package
- [ ] Install SGP30 library
- [ ] Connect sensor to ESP32
- [ ] Update WiFi credentials
- [ ] Update server URL
- [ ] Upload sketch
- [ ] Verify serial output
- [ ] Check data in GET /api/data
- [ ] Frontend displays readings

---

**Next Step:** Start your backend, upload this code, and watch the real-time data flow! 🚀
