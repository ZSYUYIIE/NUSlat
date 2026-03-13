import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      {/* Glassmorphism nav */}
      <nav className="sticky top-0 z-10 border-b border-white/20 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <span className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
              NUSlat
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="rounded-full px-5 py-2 text-sm font-medium text-neutral-600 transition-transform duration-300 hover:scale-[1.02] hover:bg-white/80"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full bg-[#1D1D1F] px-5 py-2 text-sm font-medium text-white shadow-[0_4px_14px_rgb(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02] hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-16 text-center sm:px-10">
        <div className="mb-6 text-7xl">🦜</div>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-6xl">
          Learn vocabulary
          <br />
          <span className="text-neutral-400">the smart way</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-500">
          Master 3,000 essential words through a step-by-step learning path.
          Unlock modules as you progress and build real fluency.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="rounded-full bg-[#1D1D1F] px-8 py-3.5 text-sm font-medium text-white shadow-[0_4px_14px_rgb(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02] hover:opacity-90"
          >
            Start Learning for Free →
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-full border border-neutral-200/60 bg-white px-8 py-3.5 text-sm font-medium text-[#1D1D1F] shadow-[0_4px_14px_rgb(0,0,0,0.04)] transition-transform duration-300 hover:scale-[1.02]"
          >
            Sign In
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🌱",
              title: "1,000 Words",
              desc: "Build a solid foundation with essential vocabulary",
            },
            {
              icon: "🌿",
              title: "2,000 Words",
              desc: "Expand into intermediate topics and expressions",
            },
            {
              icon: "🌳",
              title: "3,000 Words",
              desc: "Achieve advanced fluency and mastery",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-neutral-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-1.5 text-sm font-semibold tracking-tight text-[#1D1D1F]">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/60 py-6 text-center text-xs text-neutral-400">
        <p>© 2024 NUSlat · Built for learners everywhere 🌍</p>
      </footer>
    </div>
  );
}
