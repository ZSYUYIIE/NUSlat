"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";

export default function AccountPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="duo-shell min-h-screen">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-4xl">
          Account
        </h1>
        <p className="mt-2 text-sm text-[#4d6b3a]">
          Manage your identity and session for daily learning.
        </p>

        <section className="duo-card mt-6 p-6">
          <h2 className="text-lg font-extrabold text-[#2c5015]">Profile</h2>
          <div className="mt-4 space-y-2 text-sm text-[#4d6b3a]">
            <p>
              <strong>Name:</strong> {session?.user?.name ?? "Guest User"}
            </p>
            <p>
              <strong>Email:</strong> {session?.user?.email ?? "Not signed in"}
            </p>
          </div>
        </section>

        <section className="duo-card mt-5 p-6">
          <h2 className="text-lg font-extrabold text-[#2c5015]">Session Actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {session?.user ? (
              <>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className="duo-btn-secondary px-4 py-2 text-sm"
                >
                  Sign Out
                </button>
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl: `/auth/signin?email=${encodeURIComponent(session?.user?.email ?? "")}`,
                    })
                  }
                  className="duo-btn-primary px-4 py-2 text-sm"
                >
                  Switch Account
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/auth/signin")}
                className="duo-btn-primary px-4 py-2 text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
