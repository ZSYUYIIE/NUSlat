"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors sm:text-sm ${
        active ? "bg-[#58cc02] text-white" : "bg-white text-[#4d6b3a] hover:text-[#2c5015]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name?.split(" ")[0] ?? "Guest";

  return (
    <header className="sticky top-0 z-30 border-b-2 border-[#d7f4c9] bg-[#f6ffef]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="NUSlat logo"
            width={30}
            height={30}
            className="h-7 w-7 rounded-md object-contain"
            priority
          />
          <span className="text-base font-extrabold tracking-tight text-[#2c5015] sm:text-lg">NUSlat</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <NavItem href="/" label="Home" active={pathname === "/"} />
          <NavItem href="/dashboard" label="Quiz" active={pathname.startsWith("/dashboard")} />
          <NavItem href="/vocabulary" label="Vocabulary" active={pathname.startsWith("/vocabulary")} />
          <NavItem href="/account" label="Account" active={pathname.startsWith("/account")} />
        </nav>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-bold text-[#4d6b3a]">{userName}</span>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="duo-btn-secondary px-3 py-1.5 text-xs sm:text-sm"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="duo-btn-secondary px-3 py-1.5 text-xs sm:text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
