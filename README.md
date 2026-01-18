# Fuliza Limit Boost - Complete Web App

A full-stack web application for boosting M-Pesa limits through Pesapal M-Pesa STK integration.

## 📁 Project Structure

```
fuliza-limit-boost/
├── frontend/                 # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main page (Index.tsx)
│   │   ├── index.css        # Tailwind + custom styles
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   ├── vite.config.ts       # Vite config with API proxy
│   └── tailwind.config.js
│
└── backend/                  # Node.js + Express + TypeScript
    ├── src/
    │   └── index.ts         # Server with Pesapal integration
    ├── package.json
    ├── tsconfig.json
    └── .env.example         # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Pesapal Account (https://pesapal.com)

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 2. Backend Setup

```bash
cd backend

# Copy .env.example to .env
cp .env.example .env

# Edit .env with your Pesapal credentials
# PESAPAL_API_KEY=your_key_here
# PESAPAL_SECRET_KEY=your_secret_here
# etc.

npm install
npm run dev
```

Backend runs on: **http://localhost:5427**

---

## 🛠️ Configuration

### Backend Environment Variables (.env)

Create `.backend/.env` file:

```env
PESAPAL_API_KEY=your_pesapal_api_key
PESAPAL_SECRET_KEY=your_pesapal_secret_key
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_BASE_URL=https://cybqa.pesapal.com  # Demo/Testing
# Or: https://api.pesapal.com  # Production
PESAPAL_CALLBACK_URL=http://localhost:5427/api/payment/callback
PORT=5427
NODE_ENV=development
```

---

## 📋 API Endpoints

### Health Check
```
GET /api/health
```
Response: `{ "status": "ok", "timestamp": "..." }`

### Initiate Payment
```
POST /api/payment/initiate
Content-Type: application/json

{
  "phone": "0700000000",        // or "254700000000"
  "amount": 204,                 // Fee in KES
  "limitAmount": 5000            // Limit being boosted
}
```

Response:
```json
{
  "success": true,
  "orderId": "FULIZA_1234567890_abc123",
  "redirectUrl": "https://..."
}
```

### Payment Callback
```
POST /api/payment/callback
```
Pesapal sends payment status updates here.

### Check Payment Status
```
GET /api/payment/status/:orderId
```
Response:
```json
{
  "success": true,
  "status": "pending|success|failed",
  "data": { ... }
}
```

### Test Endpoint (Development)
```
POST /api/payment/test/success
{
  "orderId": "FULIZA_..."
}
```
Marks a test transaction as successful.

---

## 🎨 Frontend Components

| Component | Purpose |
|-----------|---------|
| `LimitCard` | Displays limit options |
| `ProgressBar` | Shows payment progress |
| `RecentIncrease` | Shows recent boosts |
| `FulizaHeader` | App title/branding |
| `SecurityBadges` | Trust indicators |
| `BackgroundBlobs` | Animated backgrounds |
| `InfoBanner` | Informational messages |

---

## 💳 Payment Flow

```
1. User enters phone number
2. Selects desired limit amount
3. Clicks "Get Limit Now"
4. Backend initiates Pesapal STK push
5. M-Pesa prompt appears on user's phone
6. User enters PIN to complete payment
7. Payment callback updates status
8. Success/failure screen displayed
```

---

## 🔌 Pesapal Integration Details

### STK Push Flow
1. **Initiate**: Backend calls Pesapal API with phone & amount
2. **STK Prompt**: M-Pesa STK push sent to phone
3. **Callback**: Pesapal POSTs payment status to callback URL
4. **Confirmation**: Frontend polls status or receives update

### Important Notes
- Phone number must be in **254700000000** format or **07XXXXXXXX** format
- Amount should match the fee in the LIMIT_OPTIONS array
- In production, use `https://api.pesapal.com`
- In testing, use `https://cybqa.pesapal.com`

---

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
# Output: dist/ folder
```

### Backend
```bash
cd backend
npm run build
# Output: dist/ folder
npm start
```

---

## 🧪 Testing

### Test Payment Success
```bash
curl -X POST http://localhost:5427/api/payment/test/success \
  -H "Content-Type: application/json" \
  -d '{"orderId":"FULIZA_..."}'
```

### Check API Health
```bash
curl http://localhost:5427/api/health
```

---

## 🐛 Troubleshooting

**Frontend won't connect to backend?**
- Check Vite config proxy: `vite.config.ts`
- Ensure backend is running on port 5427

**Pesapal credentials error?**
- Verify `.env` file exists in backend folder
- Check credentials are correct
- Restart backend after changing `.env`

**Phone number format issues?**
- Use: `0700000000` or `254700000000`
- Must be 10-11 digits

---

## 📝 Limit Options

| Limit Amount | Fee |
|---|---|
| Ksh 5,000 | Ksh 204 |
| Ksh 10,000 | Ksh 408 |
| Ksh 15,000 | Ksh 612 |
| ... | ... |
| Ksh 70,000 | Ksh 2,856 |

---

## 🔐 Security Notes

- ✅ Phone numbers validated
- ✅ Pesapal signatures verified
- ✅ CORS enabled for local testing
- ⚠️ Add authentication for production
- ⚠️ Enable HTTPS in production
- ⚠️ Store transactions in database

---

## 📞 Support

For Pesapal API documentation: https://developer.pesapal.com

---

**Happy boosting! 🚀**
