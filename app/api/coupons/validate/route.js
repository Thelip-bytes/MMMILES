import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Coupon code is required' 
      }, { status: 400 });
    }

    // Query active_coupons table
    const { data: coupon, error } = await supabase
      .from('active_coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !coupon) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid coupon code' 
      }, { status: 400 });
    }

    // 1. Check if status is Active (or not Expired) based on user data
    // The user data shows "status": "Expired" for invalid ones. We assume "Active" for valid ones.
    if (coupon.status === 'Expired') {
      return NextResponse.json({ 
        valid: false, 
        message: 'This coupon has expired' 
      }, { status: 400 });
    }

    // 2. Date validation
    const now = new Date();
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

    if (validFrom && now < validFrom) {
       return NextResponse.json({ 
        valid: false, 
        message: 'Coupon is not yet active' 
      }, { status: 400 });
    }

    if (validUntil && now > validUntil) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Coupon has expired' 
      }, { status: 400 });
    }

    // 3. Minimum amount validation
    const minAmount = parseFloat(coupon.min_amount || 0);
    if (subtotal < minAmount) {
      return NextResponse.json({ 
        valid: false, 
        message: `Minimum order amount of ₹${minAmount} required to use this coupon` 
      }, { status: 400 });
    }

    // 4. Usage limit validation
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Coupon usage limit exceeded' 
      }, { status: 400 });
    }

    // 5. Calculate discount
    let discount = 0;
    const discountValue = parseFloat(coupon.discount_value || 0);

    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * discountValue) / 100;
      // Apply max discount cap if it exists
      if (coupon.max_discount !== null) {
        discount = Math.min(discount, parseFloat(coupon.max_discount));
      }
    } else {
      // Fixed discount
      discount = discountValue;
    }

    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);
    // Round to 2 decimal places
    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({ 
      valid: true, 
      message: 'Coupon applied successfully',
      discount: discount,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: discountValue,
        description: coupon.description
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ 
      valid: false, 
      message: 'Internal server error during validation' 
    }, { status: 500 });
  }
}