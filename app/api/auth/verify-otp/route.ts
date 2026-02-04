// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Service role key
);

// Rate limiting configuration
const MAX_VERIFY_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// In-memory store for rate limiting (use Redis in production)
const verifyAttempts = new Map<string, { count: number; firstAttempt: number }>();

function hashOTP(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function checkRateLimit(phone: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const lockoutMs = LOCKOUT_MINUTES * 60 * 1000;
  const attempts = verifyAttempts.get(phone);

  if (!attempts) {
    return { allowed: true, remaining: MAX_VERIFY_ATTEMPTS };
  }

  // Reset if lockout period has passed
  if (now - attempts.firstAttempt > lockoutMs) {
    verifyAttempts.delete(phone);
    return { allowed: true, remaining: MAX_VERIFY_ATTEMPTS };
  }

  if (attempts.count >= MAX_VERIFY_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_VERIFY_ATTEMPTS - attempts.count };
}

function recordFailedAttempt(phone: string) {
  const now = Date.now();
  const attempts = verifyAttempts.get(phone);

  if (!attempts) {
    verifyAttempts.set(phone, { count: 1, firstAttempt: now });
  } else {
    attempts.count++;
  }
}

function clearAttempts(phone: string) {
  verifyAttempts.delete(phone);
}

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 }
      );
    }

    // SECURITY: Validate OTP format (only digits, correct length)
    const otpLength = Number(process.env.OTP_LENGTH || 4);
    const otpRegex = new RegExp(`^[0-9]{${otpLength}}$`);
    if (!otpRegex.test(otp)) {
      return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 });
    }

    // SECURITY: Rate limiting check
    const rateLimitCheck = checkRateLimit(phone);
    if (!rateLimitCheck.allowed) {
      console.warn(`Rate limit exceeded for OTP verification: ${phone.slice(-4)}`);
      return NextResponse.json(
        { error: `Too many failed attempts. Please try again in ${LOCKOUT_MINUTES} minutes.` },
        { status: 429 }
      );
    }

    // 1️⃣ Fetch latest OTP record
    const { data: records, error: otpErr } = await supabase
      .from("otp_events")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpErr || !records?.length) {
      recordFailedAttempt(phone);
      return NextResponse.json({ error: "No OTP found" }, { status: 400 });
    }

    const record = records[0];

    // Validate OTP expiry
    if (new Date(record.expires_at) < new Date()) {
      recordFailedAttempt(phone);
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Validate OTP hash
    if (hashOTP(otp) !== record.otp_hash) {
      recordFailedAttempt(phone);
      const remaining = checkRateLimit(phone).remaining;
      return NextResponse.json({
        error: "Invalid OTP",
        attemptsRemaining: remaining
      }, { status: 400 });
    }

    // Success - clear rate limit tracking
    clearAttempts(phone);

    // Already used?
    if (record.consumed) {
      return NextResponse.json({ error: "OTP already used" }, { status: 400 });
    }

    // Mark consumed
    await supabase
      .from("otp_events")
      .update({ consumed: true })
      .eq("id", record.id);

    // 2️⃣ Fetch existing user
    let { data: user, error: userErr } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    // 3️⃣ Create user if not exists
    if (!user) {
      const { data: newUser, error: createErr } = await supabase
        .from("users")
        .insert([{ phone }])
        .select()
        .single();

      if (createErr) {
        console.error("User create error:", createErr);
        return NextResponse.json(
          { error: "Could not create user" },
          { status: 500 }
        );
      }

      user = newUser;
    }

    // 4️⃣ Update user row
    await supabase
      .from("users")
      .update({
        verified: true,
        last_login: new Date().toISOString(),
      })
      .eq("id", user.id);

    // 5️⃣ Construct correct Supabase-compatible JWT
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        aud: "authenticated",
        role: "authenticated",
        sub: user.id, // 🔥 MOST IMPORTANT — REAL UUID (enables auth.uid())
        phone_number: user.phone,
        iat: now, // Issued at timestamp (recommended by Supabase)
        exp: now + 7 * 24 * 60 * 60, // 7 days expiration
      },
      process.env.SUPABASE_JWT_SECRET!
    );

    return NextResponse.json({
      success: true,
      token,
      user_id: user.id,
      phone: user.phone,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
