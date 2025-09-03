export const dynamic = "force-dynamic";

function getBaseUrl() {
  // For production, always use the www domain to avoid redirects
  if (process.env.VERCEL_URL || process.env.NODE_ENV === 'production') {
    return "https://www.summitchronicles.com";
  }
  return "http://localhost:3000";
}

async function getStravaActivities() {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/strava/recent`;
    console.log("Training page fetching from:", url);
    
    const res = await fetch(url, { cache: "no-store" });
    
    console.log("Training response status:", res.status);
    console.log("Training response ok:", res.ok);
    
    if (!res.ok) {
      const text = await res.text();
      console.log("Training error response:", text.slice(0, 200));
      throw new Error(`Failed to fetch recent activities: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Training activities received:", data?.activities?.length || 0);
    return data;
  } catch (err) {
    console.error("Strava training fetch failed", err);
    return null;
  }
}

export default async function TrainingPage() {
  const data = await getStravaActivities();
  const activities = data?.activities || []; // ✅ unwrap the array safely

  return (
    <main className="min-h-screen bg-lightGray py-16 px-6">
      <h1 className="text-3xl font-extrabold text-charcoal mb-8">Training Notes</h1>
      <h2 className="text-xl font-semibold mb-6">Recent Strava activities (last 20)</h2>
      {activities.length > 0 ? (
        <div className="grid gap-6">
          {activities.slice(0, 20).map((act: any) => (
            <div
              key={act.id}
              className="card flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition"
            >
              <div>
                <h3 className="font-semibold text-lg text-charcoal">{act.name}</h3>
                <p className="text-sm text-charcoal/60">
                  {new Date(act.start_date).toLocaleDateString()} · {act.type}
                </p>
              </div>
              <div className="flex gap-6 text-sm mt-4 md:mt-0">
                <div>
                  <span className="font-bold text-charcoal">
                    {(act.distance / 1000).toFixed(1)} km
                  </span>
                  <p className="text-charcoal/60">Distance</p>
                </div>
                <div>
                  <span className="font-bold text-charcoal">
                    {(act.moving_time / 60).toFixed(0)} min
                  </span>
                  <p className="text-charcoal/60">Time</p>
                </div>
                <div>
                  <span className="font-bold text-charcoal">
                    {act.average_speed ? (act.average_speed * 3.6).toFixed(1) : "–"} km/h
                  </span>
                  <p className="text-charcoal/60">Avg Speed</p>
                </div>
                <div>
                  <span className="font-bold text-charcoal">
                    {act.total_elevation_gain || 0} m
                  </span>
                  <p className="text-charcoal/60">Elevation</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-charcoal/70">No recent activities found.</p>
      )}
    </main>
  );
}