"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerifyState = "idle" | "verifying" | "verified" | "error";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [state, setState] = useState<VerifyState>(token ? "verifying" : "idle");
  const [message, setMessage] = useState(
    token
      ? "Verifying your email..."
      : "We sent a verification link to your email."
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const query = new URLSearchParams({ email, token });
        const res = await fetch(`/api/auth/verify-email?${query.toString()}`);
        const data: { verified?: boolean; message?: string; error?: string } =
          await res.json();

        if (cancelled) {
          return;
        }

        if (!res.ok || !data.verified) {
          setState("error");
          setMessage(data.error || "Verification link is invalid or expired.");
          return;
        }

        setState("verified");
        setMessage(data.message || "Your email has been verified. You can sign in now.");
      } catch {
        if (cancelled) {
          return;
        }
        setState("error");
        setMessage("Unable to verify email at the moment.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email, token]);

  const resendVerification = async () => {
    if (!email) {
      setState("error");
      setMessage("Missing email address. Please sign up again.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { message?: string; error?: string } = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Could not resend verification email.");
        return;
      }

      setState("idle");
      setMessage(data.message || "A new verification link has been sent.");
    } catch {
      setState("error");
      setMessage("Could not resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="duo-shell flex min-h-screen items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md lg:max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <span className="text-5xl">✉️</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2c5015]">
            Verify your email
          </h1>
          <p className="mt-1 text-sm font-bold text-[#5a7c45]">NUSlat account security</p>
        </div>

        <div className="duo-card p-5 sm:p-8">
          <p
            className={`mb-5 rounded-xl border p-3 text-sm ${
              state === "verified"
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : state === "error"
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-neutral-200/60 bg-neutral-50 text-neutral-600"
            }`}
          >
            {message}
          </p>

          {email && (
            <p className="mb-5 text-xs text-neutral-500">
              Email: <span className="font-medium text-neutral-700">{email}</span>
            </p>
          )}

          <div className="space-y-3">
            {state !== "verified" && (
              <>
                {state === "error" && (
                  <p className="text-center text-xs text-red-500">
                    Link expired or invalid? Request a new one below.
                  </p>
                )}
                <button
                  type="button"
                  onClick={resendVerification}
                  disabled={resending}
                  className={`w-full px-4 py-3 text-sm disabled:opacity-60 ${
                    state === "error"
                      ? "duo-btn-primary"
                      : "duo-btn-secondary"
                  }`}
                >
                  {resending ? "Sending link..." : "Resend verification email"}
                </button>
              </>
            )}

            <Link
              href="/auth/signin"
              className="duo-btn-primary block w-full px-4 py-3 text-center text-sm"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
