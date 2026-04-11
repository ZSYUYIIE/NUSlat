"use client";

import { useState } from "react";

export default function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    try {
      localStorage.setItem("nuslat_newsletter_email", email.trim().toLowerCase());
    } catch {
      // Ignore storage failures gracefully.
    }

    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="duo-card p-6">
      <h3 className="text-xl font-extrabold text-[#2c5015]">Newsletter</h3>
      <p className="mt-2 text-sm text-[#4d6b3a]">
        Get updates on new Thai chapters, pronunciation packs, and writing drills.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-[#d7f4c9] bg-white px-3 py-2 text-sm font-medium text-[#2c5015] outline-none focus:border-[#8cdb4d]"
          required
        />
        <button type="submit" className="duo-btn-primary w-full px-4 py-2.5 text-sm">
          Subscribe
        </button>
      </form>
      {submitted ? (
        <p className="mt-3 text-xs font-bold text-[#46a302]">
          Thanks. You are subscribed to the NUSlat newsletter.
        </p>
      ) : null}
    </div>
  );
}
