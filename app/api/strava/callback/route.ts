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

  // Exchange code for token
  const r = await fetch(OAUTH_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.STRAVA_REDIRECT_URI,
    }),
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