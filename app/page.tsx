export const dynamic = "force-dynamic";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'production') {
    return "https://www.summitchronicles.com";
  }
  return "http://localhost:3000";
}

async function getStravaActivities() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/strava/recent`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch recent activities");
    return res.json();
  } catch (err) {
    console.error("Strava fetch failed", err);
    return { activities: [] };
  }
}

export default async function HomePage() {
  const data = await getStravaActivities();
  const activities = data?.activities || [];

  return (
    <main className="min-h-screen bg-lightGray">
      {/* Hero / Intro */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-3xl font-extrabold text-charcoal mb-6">
          Stories from the World&apos;s Peaks
        </h1>
        <p className="text-charcoal/70 mb-12">
          Summit Chronicles – Documenting the Seven Summits journey
        </p>
      </section>

      {/* Expedition Highlight */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Expedition Highlight</h2>
        <p className="text-charcoal">
          Kilimanjaro 2023 – My first of the Seven Summits.
        </p>
      </section>

      {/* Training Snapshot */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Training Snapshot</h2>
        <p className="text-charcoal">Weekly Mileage: 2086.5 km</p>
        <p className="text-charcoal">Weekly Elevation: 81363 m</p>
        <p className="text-charcoal">
          Last Activity: Day 18 – 171.3 km out of 300k – 0.4 km in 3 mins
        </p>
      </section>

      {/* Gear Review */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Gear Review</h2>
        <p className="text-charcoal">La Sportiva boots tested on Elbrus.</p>
      </section>

      {/* Blog */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Blog</h2>
        <p className="text-charcoal">
          Reflections from Aconcagua&apos;s high camps.
        </p>
      </section>

      {/* Recent Activities */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-6">Recent Activities</h2>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 5).map((act: any) => (
              <div
                key={act.id}
                className="border-b border-lightGray pb-4 hover:bg-snowWhite transition"
              >
                <h3 className="font-semibold text-lg text-charcoal">
                  {act.name}
                </h3>
                <p className="text-sm text-charcoal/60">
                  {new Date(act.start_date).toLocaleDateString()} · {act.type} ·{" "}
                  {(act.distance / 1000).toFixed(1)} km
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-charcoal/70">No activities found this week.</p>
        )}
      </section>
    </main>
  );
}