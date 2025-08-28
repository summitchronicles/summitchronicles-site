import Link from "next/link";
export const dynamic = "force-dynamic"; // This is to force the page to be dynamic, so that it is not cached
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gray-50">
      {/* HERO SECTION */}
      <section className="w-full h-[80vh] bg-cover bg-center flex flex-col items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('/hero-mountain.jpg')" }}>
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
        Stories from the World&apos;s Peaks
        </h1>
        <p className="mt-4 text-lg md:text-2xl drop-shadow">
          Summit Chronicles – Documenting the Seven Summits journey
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/expeditions" className="px-6 py-3 bg-yellow-500 text-black rounded-lg shadow hover:bg-yellow-400">Expeditions</Link>
          <Link href="/training" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-400">Training</Link>
          <Link href="/ask" className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-400">Ask the Site</Link>
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
          <p>Weekly mileage synced from Strava.</p>
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

      {/* NEWSLETTER SIGNUP */}
      <section className="w-full bg-gray-900 text-white py-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Join the Journey</h2>
        <form action="https://buttondown.email/api/emails/embed-subscribe/YOUR_BUTTONDOWN_ID"
              method="post"
              target="popupwindow"
              onSubmit={() => window.open('https://buttondown.email/YOUR_BUTTONDOWN_ID', 'popupwindow')}
              className="flex gap-2">
          <input type="email" name="email" placeholder="Your email" className="px-4 py-2 rounded text-black" required />
          <button type="submit" className="px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400">Subscribe</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-gray-800 text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Summit Chronicles · About · Contact · Social Links
      </footer>
    </main>
  );
}