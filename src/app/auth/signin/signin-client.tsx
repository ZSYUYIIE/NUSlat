"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authError = searchParams.get("error");
    const authEmail = searchParams.get("email") || "";

    if (authEmail) {
      setEmail(authEmail);
    }

    if (authError === "AccessDenied") {
      setError(
        "Google sign-in could not be completed. Please try again or use email/password."
      );
      setInfo(null);
    }

    if (authError === "EmailNotVerified") {
      setError("Please verify your email before signing in.");
      setInfo("We can send you a new verification link below.");
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const providers = await getProviders();
        if (mounted) {
          setGoogleEnabled(Boolean(providers?.google));
        }
      } catch {
        if (mounted) {
          setGoogleEnabled(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCredentialsSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (result?.url?.includes("error=EmailNotVerified")) {
        setError("Please verify your email before signing in.");
        setInfo("We can send you a new verification link below.");
      } else if (result?.error) {
        if (result.error.includes("CredentialsSignin")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError("Unable to sign in right now. Please try again shortly.");
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfo(null);
    if (!googleEnabled) {
      setError("Google sign-in is not configured in this environment yet.");
      return;
    }
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleResendVerification = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email first to resend a verification link.");
      return;
    }

    setResendingVerification(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data: { message?: string; error?: string } = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend verification email.");
        return;
      }

      setInfo(data.message || "Verification email sent.");
    } catch {
      setError("Failed to resend verification email.");
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="duo-shell flex min-h-screen items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md lg:max-w-lg">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#5a7c45] hover:text-[#2c5015]"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <Image
              src="/Logo.png"
              alt="NUSlat logo"
              width={72}
              height={72}
              className="h-16 w-16 rounded-xl object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2c5015]">
            NUSlat
          </h1>
          <p className="mt-1 text-sm font-bold text-[#5a7c45]">Welcome back</p>
        </div>

        <div className="duo-card p-5 sm:p-8">
          <h2 className="mb-2 text-center text-base font-extrabold tracking-tight text-[#2c5015]">
            Sign in to your account
          </h2>
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-wide text-[#8cad73]">
            Keep your streak going
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={!googleEnabled}
            className="duo-btn-secondary mb-4 flex w-full items-center justify-center gap-3 px-4 py-3 text-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {!googleEnabled && (
            <p className="-mt-2 mb-3 text-center text-xs text-neutral-500">
              Google sign-in is currently unavailable.
            </p>
          )}

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-neutral-400">or</span>
            </div>
          </div>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-neutral-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="duo-input w-full px-4 py-3 text-sm text-[#2c5015]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-neutral-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="duo-input w-full px-4 py-3 text-sm text-[#2c5015]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {info && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="duo-btn-primary w-full px-4 py-3 text-sm disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            {(error?.includes("verify") || info?.includes("verification")) && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="duo-btn-secondary w-full px-4 py-3 text-sm disabled:opacity-60"
              >
                {resendingVerification
                  ? "Sending link..."
                  : "Resend verification email"}
              </button>
            )}
          </form>

          <p className="mt-5 text-center text-xs text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-extrabold text-[#58cc02] hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
