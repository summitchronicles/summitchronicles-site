"use client"; // 👈 enables interactivity

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  return (
    <section className="w-full bg-gray-900 text-white py-12 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Join the Journey</h2>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/YOUR_BUTTONDOWN_ID"
        method="post"
        target="popupwindow"
        onSubmit={() =>
          window.open(
            "https://buttondown.email/YOUR_BUTTONDOWN_ID",
            "popupwindow"
          )
        }
        className="flex gap-2"
      >
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
  );
}