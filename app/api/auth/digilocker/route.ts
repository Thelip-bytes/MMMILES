import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clientId = process.env.DIGILOCKER_CLIENT_ID;
    const redirectUri = process.env.DIGILOCKER_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("DigiLocker environment variables missing in environment configurations");
      return NextResponse.json(
        { error: "DigiLocker auth is currently misconfigured." },
        { status: 500 }
      );
    }

    // Generate secure CSRF state token to prevent CSRF attacks
    const state = crypto.randomBytes(16).toString("hex");

    // Construct DigiLocker authorize URL
    const authUrl = new URL("https://api.digitallocker.gov.in/public/oauth2/1/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authUrl.toString());

    // Store state in a secure, HttpOnly cookie to validate upon callback redirection
    response.cookies.set("digilocker_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 300, // 5 minutes validity
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Failed to initiate DigiLocker Auth:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
