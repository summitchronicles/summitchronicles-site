// app/api/strava/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OAUTH_TOKEN = "https://www.strava.com/oauth/token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing ?code from Strava" }, { status: 400 });
  }

  // Log what we're sending (without secret)
  console.log('OAuth request:', {
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: process.env.STRAVA_REDIRECT_URI,
    grant_type: "authorization_code",
    code_length: code?.length
  });

  // Exchange code for token - exactly mirror the working curl request
  const formData = `client_id=172794&client_secret=f58933ff81ff645699212050ce2a0e379f7fc886&code=${code}&grant_type=authorization_code&redirect_uri=https://summitchronicles.com/api/strava/callback`;

  const r = await fetch(OAUTH_TOKEN, {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: formData,
  });

  if (!r.ok) {
    const err = await r.text();
    return NextResponse.json({ error: `Token exchange failed: ${err}` }, { status: 500 });
  }

  const json = await r.json();

  // Store in Supabase
  await supabase.from("strava_tokens").upsert({
    id: 1,
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: json.expires_at,
  });

  // Redirect to success page
  return NextResponse.redirect(new URL('/admin/strava?success=true', req.url));
}