import { google } from "googleapis";

export async function POST(req) {
  try {
    const { name, phone, city } = await req.json();

    if (!name || !phone) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    /* 🔍 CHECK DUPLICATE PHONE (Column B) */
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!B:B",
    });

    const phones = existing.data.values?.flat() || [];
    if (phones.includes(phone)) {
      return Response.json(
        { error: "This phone number is already registered" },
        { status: 409 }
      );
    }

    /* ✅ ADD NEW ROW */
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          name,
          phone,
          city || "",
          new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        ]],
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("GOOGLE ERROR:", err);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}
