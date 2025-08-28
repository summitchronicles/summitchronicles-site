import Link from "next/link";
export const dynamic = "force-dynamic"; // ensure no caching

async function getStravaStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/strava/stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  } catch (err) {
    console.error("Strava stats fetch failed", err);
    return null;
  }
}

async function getStravaRecent() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/strava/recent`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch recent activities");
    return res.json();
  } catch (err) {
    console.error("Strava recent fetch failed", err);
    return null;
  }
}

export default async function HomePage() {
  const stats = await getStravaStats();
  const recent = await getStravaRecent();

  const weeklyMileage = stats?.runs?.distance_km
    ? `${stats.runs.distance_km.toFixed(1)} km`
    : "N/A";

  const weeklyElevation = stats?.overall?.elevation_m
    ? `${stats.overall.elevation_m} m`
    : "N/A";

  const lastActivity = recent && Array.isArray(recent) && recent.length > 0
    ? `${recent[0].name} – ${(recent[0].distance / 1000).toFixed(1)} km in ${(
        recent[0].moving_time / 60
      ).toFixed(0)} mins`
    : "No recent activities found.";

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gray-50">
      {/* HERO SECTION */}
      <section
        className="w-full h-[80vh] bg-cover bg-center flex flex-col items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('/hero-mountain.jpg')" }}
      >
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Stories from the World&apos;s Peaks
        </h1>
        <p className="mt-4 text-lg md:text-2xl drop-shadow">
          Summit Chronicles – Documenting the Seven Summits journey
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/expeditions"
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg shadow hover:bg-yellow-400"
          >
            Expeditions
          </Link>
          <Link
            href="/training"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-400"
          >
            Training
          </Link>
          <Link
            href="/ask"
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-400"
          >
            Ask the Site
          </Link>
        </div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section className="max-w-5xl w-full py-16 px-6 grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Expedition Highlight</h2>
          <p>Kilimanjaro 2023 – My first of the Seven Summits.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Training Snapshot</h2>
          <p>Weekly Mileage: {weeklyMileage}</p>
          <p>Weekly Elevation: {weeklyElevation}</p>
          <p>Last Activity: {lastActivity}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Gear Review</h2>
          <p>La Sportiva boots tested on Elbrus.</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold text-xl mb-2">Blog</h2>
          <p>Reflections from Aconcagua&apos;s high camps.</p>
        </div>
      </section>

      {/* RECENT ACTIVITIES SECTION */}
      <section className="max-w-5xl w-full py-16 px-6">
        <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
        <div className="grid gap-6">
          {recent && Array.isArray(recent) && recent.length > 0 ? (
            recent.slice(0, 5).map((act: any) => (
              <div
                key={act.id}
                className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{act.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(act.start_date).toLocaleDateString()} · {act.type}
                  </p>
                </div>
                <div className="flex gap-6 text-sm mt-4 md:mt-0">
                  <div>
                    <span className="font-bold">{(act.distance / 1000).toFixed(1)} km</span>
                    <p className="text-gray-500">Distance</p>
                  </div>
                  <div>
                    <span className="font-bold">
                      {(act.moving_time / 60).toFixed(0)} min
                    </span>
                    <p className="text-gray-500">Time</p>
                  </div>
                  <div>
                    <span className="font-bold">
                      {act.average_speed ? (act.average_speed * 3.6).toFixed(1) : "–"} km/h
                    </span>
                    <p className="text-gray-500">Avg Speed</p>
                  </div>
                  <div>
                    <span className="font-bold">
                      {act.total_elevation_gain || 0} m
                    </span>
                    <p className="text-gray-500">Elevation</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No activities found this week.</p>
          )}
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="w-full bg-gray-900 text-white py-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Join the Journey</h2>
        <form
          action="https://buttondown.email/api/emails/embed-subscribe/YOUR_BUTTONDOWN_ID"
          method="post"
          target="popupwindow"
          onSubmit={() =>
            window.open("https://buttondown.email/YOUR_BUTTONDOWN_ID", "popupwindow")
          }
          className="flex gap-2"
        >
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="px-4 py-2 rounded text-black"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-gray-800 text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Summit Chronicles · About · Contact · Social Links
      </footer>
    </main>
  );
}