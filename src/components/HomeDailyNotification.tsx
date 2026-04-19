"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HomeDailyNotificationProps = {
  isSignedIn: boolean;
};

export default function HomeDailyNotification({
  isSignedIn,
}: HomeDailyNotificationProps) {
  const [optedIn, setOptedIn] = useState(false);
  const [loading, setLoading] = useState(isSignedIn);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadPreference = async () => {
      try {
        const response = await fetch("/api/notifications/preferences", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load daily reminder preference");
        }

        const data = (await response.json()) as {
          dailyNotificationOptIn?: boolean;
        };

        if (!active) return;
        setOptedIn(Boolean(data.dailyNotificationOptIn));
      } catch {
        if (!active) return;
        setError("Could not load your reminder setting. Try refreshing.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPreference();

    return () => {
      active = false;
    };
  }, [isSignedIn]);

  const togglePreference = async (nextValue: boolean) => {
    if (!isSignedIn) return;

    const previous = optedIn;
    setOptedIn(nextValue);
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dailyNotificationOptIn: nextValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to save daily reminder preference");
      }

      setMessage(
        nextValue
          ? "Daily reminders are enabled."
          : "Daily reminders are disabled."
      );
    } catch {
      setOptedIn(previous);
      setError("Could not save your reminder setting. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="duo-card p-6">
      <h3 className="text-xl font-extrabold text-[#2c5015]">Daily Notifications</h3>
      <p className="mt-2 text-sm text-[#4d6b3a]">
        Get one daily email reminder to complete a quiz and earn daily points.
        Learn mode and Daily Quiz reminders are ready to plug in as those features ship.
      </p>

      <div className="mt-4 rounded-xl border border-[#d7f4c9] bg-[#f8fff1] p-4">
        <label className="flex items-start gap-3 text-sm text-[#2c5015]">
          <input
            type="checkbox"
            checked={optedIn}
            onChange={(event) => togglePreference(event.target.checked)}
            disabled={!isSignedIn || loading || saving}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#9bc47a] text-[#58cc02] focus:ring-[#58cc02]"
          />
          <span className="font-semibold">
            Tick to opt in for daily reminder emails. Untick to opt out.
          </span>
        </label>

        {!isSignedIn ? (
          <p className="mt-2 text-xs text-[#5c7d46]">
            Sign in to enable reminders for your email address. {" "}
            <Link
              href="/auth/signin"
              className="font-bold text-[#2c5015] underline underline-offset-2"
            >
              Go to Sign In
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-xs text-[#5c7d46]">
            You can change this anytime from Home.
          </p>
        )}

        {loading ? (
          <p className="mt-3 text-xs font-bold text-[#7f9f69]">
            Loading your preference...
          </p>
        ) : null}
        {saving ? (
          <p className="mt-3 text-xs font-bold text-[#7f9f69]">
            Saving...
          </p>
        ) : null}
        {message ? (
          <p className="mt-3 text-xs font-bold text-[#46a302]">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-3 text-xs font-bold text-red-500">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
