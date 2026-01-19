
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phone, amount, limitAmount } = req.body;
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ error: "Configuration Error: Missing Secret Key" });
    }

    if (!phone || !amount) {
        return res.status(400).json({ error: "Missing phone or amount" });
    }

    const email = `${phone}@mpesa.local`;
    const paystackAmount = Math.round(Number(amount) * 100);
    const orderId = `FULIZA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const baseURL = `https://${req.headers.host}`; // Auto-detect Vercel URL

    try {
        const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: paystackAmount,
                currency: 'KES',
                reference: orderId,
                callback_url: `${baseURL}/payment/callback`,
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
            }),
        });

        const data: any = await paystackResponse.json();

        if (data.status) {
            return res.status(200).json({
                success: true,
                message: 'Payment initiated successfully',
                orderId,
                authorization_url: data.data.authorization_url,
                access_code: data.data.access_code,
                reference: data.data.reference
            });
        } else {
            return res.status(400).json({ success: false, message: data.message || 'Paystack initialization failed' });
        }
    } catch (error: any) {
        console.error("Paystack Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
