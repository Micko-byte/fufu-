import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5427;

// Middleware
app.use(cors());
// Use raw body for webhook verification if needed, but express.json is usually fine if signature verification is handled carefully
app.use(express.json());

// Paystack Configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  console.error("CRITICAL: PAYSTACK_SECRET_KEY is missing in .env!");
}

// Store pending transactions (in production, use a database)
const pendingTransactions = new Map();

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Initiate Payment via Paystack
app.post('/api/payment/initiate', async (req: Request, res: Response) => {
  try {
    const { phone, amount, limitAmount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate phone number (Kenya format)
    // Paystack expects proper format, but we'll focus on getting the email/user right
    // const phoneRegex = /^254\d{9}$|^07\d{8}$/;

    const email = `${phone}@mpesa.local`; // Paystack needs an email

    // Paystack amount is in kobo/cents (multiply by 100)
    const paystackAmount = Math.round(Number(amount) * 100);

    const orderId = `FULIZA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store transaction locally
    pendingTransactions.set(orderId, {
      orderId,
      phone,
      amount,
      limitAmount,
      status: 'pending',
      createdAt: new Date(),
    });

    // Paystack Initialize Request
    const paystackResponse = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: paystackAmount,
        currency: 'KES',
        reference: orderId,
        callback_url: `${process.env.APP_URL || 'http://localhost:5173'}/payment/callback`, // Frontend callback
        metadata: {
          custom_fields: [
            {
              display_name: "Mobile Number",
              variable_name: "mobile_number",
              value: phone
            },
            {
              display_name: "Limit Amount",
              variable_name: "limit_amount",
              value: limitAmount
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (paystackResponse.data.status) {
      console.log('Paystack Init Success:', paystackResponse.data.data);
      return res.json({
        success: true,
        message: 'Payment initiated successfully',
        orderId,
        authorization_url: paystackResponse.data.data.authorization_url,
        access_code: paystackResponse.data.data.access_code,
        reference: paystackResponse.data.data.reference
      });
    } else {
      console.error('Paystack Init Failed:', paystackResponse.data);
      return res.status(400).json({ success: false, message: 'Paystack rejected initialization' });
    }

  } catch (error: any) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
});

// Paystack Webhook
app.post('/api/payment/webhook', (req: Request, res: Response) => {
  // Validate event
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    console.log('Paystack Webhook received:', event.event);

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      console.log(`✓ Payment successful for ref: ${reference}`);

      const transaction = pendingTransactions.get(reference);
      if (transaction) {
        transaction.status = 'success';
        // Logic to actually boost limit would go here
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Check payment status (Polling support for frontend if needed)
app.get('/api/payment/status/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const transaction = pendingTransactions.get(orderId);
  if (!transaction) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, status: transaction.status, data: transaction });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Fuliza Backend (Paystack) running on port ${PORT}`);
  console.log(`📍 API Health: http://localhost:${PORT}/api/health`);
});
