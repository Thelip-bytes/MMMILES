require('dotenv').config({ path: '.env.local' });
const jwt = require('jsonwebtoken');

function generateAuthUrl() {
  const clientId = process.env.DIGILOCKER_CLIENT_ID;
  const redirectUri = process.env.DIGILOCKER_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error("Error: DIGILOCKER_CLIENT_ID or DIGILOCKER_REDIRECT_URI is missing in .env.local");
    return null;
  }

  // Construct DigiLocker authorize URL
  // We include scopes: openid, profile, files.issueddocs, partners.PANCR, partners.DRVLC
  const authUrl = new URL("https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", "test_csrf_token_state_12345");
  authUrl.searchParams.set("scope", "openid profile files.issueddocs");
  authUrl.searchParams.set("purpose", "kyc");
  authUrl.searchParams.set("acr", "aadhaar"); // request Aadhaar verification

  return authUrl.toString();
}

async function simulateTokenExchange(code) {
  const tokenUrl = "https://digilocker.meripehchaan.gov.in/public/oauth2/2/token";
  const clientId = process.env.DIGILOCKER_CLIENT_ID;
  const clientSecret = process.env.DIGILOCKER_CLIENT_SECRET;
  const redirectUri = process.env.DIGILOCKER_REDIRECT_URI;

  console.log(`Sending token exchange request to: ${tokenUrl}`);
  console.log(`Payload:`);
  console.log(`  grant_type: authorization_code`);
  console.log(`  code: ${code}`);
  console.log(`  client_id: ${clientId}`);
  console.log(`  client_secret: ${clientSecret.substring(0, 4)}... (masked)`);
  console.log(`  redirect_uri: ${redirectUri}`);

  const tokenParams = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });

    console.log(`Status Code: ${response.status} ${response.statusText}`);
    const textOutput = await response.text();
    console.log("Raw Response:");
    console.log(textOutput);

    try {
      const data = JSON.parse(textOutput);
      if (data.id_token) {
        console.log("\nDecoded ID Token (JWT Claims):");
        const decoded = jwt.decode(data.id_token);
        console.log(JSON.stringify(decoded, null, 2));
      }
    } catch (e) {
      console.log("Response is not JSON.");
    }
  } catch (err) {
    console.error("Network error during exchange:", err);
  }
}

// Main execution
console.log("==================================================");
console.log("DIGILOCKER / MERIPEHCHAAN INTEGRATION TEST RUNNER");
console.log("==================================================");

const url = generateAuthUrl();
if (url) {
  console.log("\nGenerated Authorization Redirect URL:");
  console.log(url);
}

// If an auth code is passed as a command line argument, run the token exchange simulation
const args = process.argv.slice(2);
if (args.length > 0) {
  const code = args[0];
  console.log(`\nStarting token exchange simulation for code: ${code}`);
  simulateTokenExchange(code);
} else {
  console.log("\nUsage to test token exchange: node scratch/test_digilocker.js <auth_code>");
}
