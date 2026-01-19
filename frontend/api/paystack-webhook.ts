
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ error: "Missing Configuration" });
    }

    try {
        // Validation
        const signature = req.headers['x-paystack-signature'] as string;
        if (!signature) {
            return res.status(400).json({ error: "No signature provided" });
        }

        const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== signature) {
            return res.status(400).json({ error: "Invalid Signature" });
        }

        const event = req.body;
        console.log('Paystack Webhook received:', event.event);

        if (event.event === 'charge.success') {
            const reference = event.data.reference;
            console.log(`✓ Payment successful for ref: ${reference}`);
            // In a real app, update database here.
        }

        return res.status(200).send('OK');

    } catch (error) {
        console.error("Webhook Error", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
