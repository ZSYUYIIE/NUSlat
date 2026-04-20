"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}

function DesktopNavItem({ href, label, icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`duo-side-link ${
        active ? "duo-side-link-active" : "duo-side-link-idle"
      }`}
    >
      <span className="duo-side-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function MobileNavItem({ href, label, active }: Omit<NavItemProps, "icon">) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors ${
        active
          ? "bg-[#58cc02] text-white"
          : "border border-[#d8ecd3] bg-white text-[#527a40]"
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

  const isLearnHub = pathname === "/learn";
  const isQuizRoute =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/learn/") && pathname !== "/learn");
  const isVocabularyRoute = pathname.startsWith("/vocabulary");
  const isAccountRoute = pathname.startsWith("/account");

  const userName = session?.user?.name?.split(" ")[0] ?? "Guest";

  const navItems: NavItemProps[] = [
    { href: "/", label: "Home", icon: "H", active: pathname === "/" },
    { href: "/learn", label: "Learn", icon: "L", active: isLearnHub },
    { href: "/dashboard", label: "Quiz", icon: "Q", active: isQuizRoute },
    {
      href: "/vocabulary",
      label: "Vocabulary",
      icon: "V",
      active: isVocabularyRoute,
    },
    { href: "/account", label: "Account", icon: "A", active: isAccountRoute },
  ];

  return (
    <>
      <aside className="duo-sidebar hidden lg:flex">
        <Link href="/" className="flex items-center gap-2 px-1">
          <Image
            src="/Logo.png"
            alt="NUSlat logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain"
            priority
          />
          <span className="text-xl font-black tracking-tight text-[#2d4e21]">NUSlat</span>
        </Link>

        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <DesktopNavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-[#d8ecd3] bg-white/90 p-3 shadow-[0_6px_0_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#89a67a]">
            Profile
          </p>
          <p className="mt-1 truncate text-sm font-extrabold text-[#2d4e21]">{userName}</p>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="duo-btn-secondary mt-3 w-full px-3 py-2 text-xs"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="duo-btn-secondary mt-3 w-full px-3 py-2 text-xs"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-[#d9ecd5] bg-[#f7fff2]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo.png"
              alt="NUSlat logo"
              width={30}
              height={30}
              className="h-8 w-8 rounded-lg object-contain"
              priority
            />
            <span className="text-base font-black tracking-tight text-[#2d4e21]">NUSlat</span>
          </Link>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="duo-btn-secondary px-3 py-1.5 text-xs"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="duo-btn-secondary px-3 py-1.5 text-xs"
            >
              Sign In
            </button>
          )}
        </div>
        <nav className="mt-3 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <MobileNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={item.active}
            />
          ))}
        </nav>
      </header>
    </>
  );
}
