// app/api/create-order/route.js
import { NextRequest } from 'next/server';
import { getUserFromAuthHeader } from '../../../lib/auth.js';
import { calculatePricing } from '../../../lib/pricing.js';

// Razorpay SDK imports
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(request) {
    try {
        // Authentication check
        const user = getUserFromAuthHeader(request.headers.get('authorization'));
        if (!user) {
            return Response.json({ error: 'Invalid or missing authentication' }, { status: 401 });
        }

        const { carId, pickupTime, returnTime, discount = 0 } = await request.json();

        // Validate required parameters
        if (!carId || !pickupTime || !returnTime) {
            return Response.json({
                error: 'carId, pickupTime, and returnTime are required'
            }, { status: 400 });
        }

        // Validate discount parameter
        const discountAmount = parseFloat(discount) || 0;
        if (discountAmount < 0 || discountAmount > 50000) { // Max 50k discount
            return Response.json({ error: 'Invalid discount amount' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // 1. Fetch vehicle details and pricing from database
        const vehicleResponse = await fetch(
            `${supabaseUrl}/rest/v1/vehicles?id=eq.${carId}&select=*`,
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': request.headers.get('authorization'),
                },
            }
        );

        if (!vehicleResponse.ok) {
            throw new Error('Failed to fetch vehicle details');
        }

        const vehicles = await vehicleResponse.json();
        if (vehicles.length === 0) {
            return Response.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        const vehicle = vehicles[0];

        // 2. Parse and validate dates
        const startDate = new Date(pickupTime);
        const endDate = new Date(returnTime);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return Response.json({ error: 'Invalid date format' }, { status: 400 });
        }

        if (endDate <= startDate) {
            return Response.json({ error: 'Return time must be after pickup time' }, { status: 400 });
        }

        // 3. Get base daily rate from database
        const baseDailyRate = parseFloat(vehicle.base_daily_rate) || 0;

        if (baseDailyRate <= 0) {
            return Response.json({ error: 'Invalid base rate configuration' }, { status: 400 });
        }

        // 4. Calculate pricing using the centralized pricing engine
        const pricing = calculatePricing({
            baseDailyRate,
            pickupTime: startDate,
            returnTime: endDate,
            discount: discountAmount,
        });

        // 5. Validate calculated prices (sanity checks)
        if (pricing.total <= 0 || pricing.total > 100000) { // Max 1 lakh INR
            return Response.json({ error: 'Invalid calculated price' }, { status: 400 });
        }

        // 6. Create Razorpay order with server-calculated amount
        const orderOptions = {
            amount: Math.round(pricing.total * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `booking_${carId}_${Date.now()}`,
            notes: {
                vehicle_id: carId.toString(),
                user_id: user.sub,
                tier: pricing.tier.name,
                hours: pricing.hours.toString(),
                pickup_time: pickupTime,
                return_time: returnTime,
                discount: pricing.discount.toString(),
                calculated_total: pricing.total.toString()
            }
        };

        const razorpayOrder = await razorpay.orders.create(orderOptions);

        // 7. Return order details to client
        return Response.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: pricing.total,
            currency: 'INR',
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            pricing: {
                hours: pricing.hours,
                tier: pricing.tier,
                rates: pricing.rates,
                costs: pricing.costs,
                discount: pricing.discount,
                total: pricing.total,
            },
            vehicle: {
                id: vehicle.id,
                make: vehicle.make,
                model: vehicle.model,
                model_year: vehicle.model_year
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return Response.json({
            error: 'Failed to create payment order',
            details: error.message
        }, { status: 500 });
    }
}