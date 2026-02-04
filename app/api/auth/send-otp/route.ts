// app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppOTP } from "../utils/whatsapp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Rate limiting configuration
const MAX_OTP_REQUESTS_PER_HOUR = 5;

function hashOTP(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function generateOTP() {
  const length = Number(process.env.OTP_LENGTH || 4);
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  // SECURITY: Use cryptographically secure random number
  return crypto.randomInt(min, max).toString();
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

    // Validate phone format (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
    }

    // SECURITY: Rate limiting - check recent OTP requests
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("otp_events")
      .select("*", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", oneHourAgo);

    if (!countError && count !== null && count >= MAX_OTP_REQUESTS_PER_HOUR) {
      console.warn(`Rate limit exceeded for phone: ${phone.slice(-4)}`);
      return NextResponse.json({
        error: "Too many OTP requests. Please try again in an hour."
      }, { status: 429 });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    // Create user if not exists
    await supabase.from("users").upsert({ phone }, { onConflict: "phone" });

    // Store OTP
    await supabase.from("otp_events").insert({
      phone,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    // ✅ Send via WhatsApp
    const sent = await sendWhatsAppOTP(phone, otp);

    if (!sent) {
      return NextResponse.json({ error: "Failed to send WhatsApp OTP" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}