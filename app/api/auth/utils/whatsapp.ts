// app/api/auth/utils/whatsapp.ts
import axios from "axios";

export async function sendWhatsAppOTP(phone: string, otp: string) {
  try {
    const { GUPSHUP_API_KEY, GUPSHUP_SOURCE, GUPSHUP_APP_NAME, GUPSHUP_TEMPLATE_ID } = process.env;

    if (!GUPSHUP_API_KEY || !GUPSHUP_SOURCE || !GUPSHUP_APP_NAME || !GUPSHUP_TEMPLATE_ID) {
      throw new Error("Missing Gupshup environment variables");
    }

    // ✅ Build template message for Authentication (with Copy Code button)
    const templateMessage = JSON.stringify({
      id: GUPSHUP_TEMPLATE_ID,      // "39b1ca1e-d647-4a93-8e26-f87b12b882b8"
      params: [otp],                 // {{1}} = OTP code in message body
      buttons: {
        copy_code: {
          code: otp,                 // OTP code for copy button
        },
      },
    });

    // ✅ Form data for template API
    const payload = new URLSearchParams({
      channel: "whatsapp",
      source: GUPSHUP_SOURCE,           // "15558132724"
      destination: phone,               // target phone number
      "src.name": GUPSHUP_APP_NAME,     // "MMMiles"
      template: templateMessage,        // Template object (not message!)
    });

    // ✅ Use the TEMPLATE endpoint (not /wa/api/v1/msg)
    const response = await axios.post(
      "https://api.gupshup.io/wa/api/v1/template/msg",
      payload.toString(),
      {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
          apikey: GUPSHUP_API_KEY,
        },
      }
    );

    console.log("📨 Gupshup Response:", JSON.stringify(response.data, null, 2));

    if (response.data?.status === "submitted" || response.data?.status === "success") {
      console.log(`✅ WhatsApp OTP sent successfully to ${phone}`);
      return true;
    } else {
      console.error("❌ Gupshup response:", response.data);
      return false;
    }
  } catch (error: any) {
    console.error("❌ Failed to send WhatsApp OTP:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}