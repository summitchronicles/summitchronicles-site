"use client";
import { useState } from "react";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnswer("🤖 Placeholder: AI will answer based on expedition + training docs.");
  };

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">Ask the Site</h1>
      <p className="mb-4 text-gray-700">Ask anything about expeditions, training, or gear.</p>

      <form onSubmit={handleAsk} className="flex flex-col gap-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="px-4 py-2 border rounded"
          required
        />
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-400">
          Ask
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 border rounded bg-gray-50 shadow">
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}