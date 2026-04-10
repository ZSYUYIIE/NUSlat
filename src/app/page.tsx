import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="duo-shell flex min-h-screen flex-col">
      <nav className="sticky top-0 z-10 border-b-2 border-[#d7f4c9] bg-[#f6ffef]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <span className="text-lg font-extrabold tracking-tight text-[#2c5015]">
              NUSlat
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="duo-btn-secondary px-5 py-2 text-sm"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="duo-btn-primary px-5 py-2 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-16 text-center sm:px-10">
        <div className="mb-4 inline-flex items-center rounded-full border-2 border-[#d7f4c9] bg-white px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#46a302]">
          Build Thai Daily
        </div>
        <div className="mb-6 text-7xl">🦜</div>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#2c5015] sm:text-5xl lg:text-6xl">
          Learn vocabulary
          <br />
          <span className="text-[#58cc02]">the fun way</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-[#4d6b3a]">
          Master 3,000 essential words through a step-by-step learning path.
          Unlock modules as you progress and build real fluency.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/auth/signup"
            className="duo-btn-primary px-8 py-3.5 text-sm"
          >
            Start Learning for Free →
          </Link>
          <Link
            href="/auth/signin"
            className="duo-btn-secondary px-8 py-3.5 text-sm"
          >
            Sign In
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="mt-4 text-xs font-bold text-[#4d6b3a] transition-colors hover:text-[#2c5015]"
        >
          Continue as Guest →
        </Link>

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
              className="duo-card p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-1.5 text-sm font-extrabold tracking-tight text-[#2c5015]">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#4d6b3a]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t-2 border-[#d7f4c9] py-6 text-center text-xs text-[#7f9f69]">
        <p>© 2024 NUSlat · Built for learners everywhere 🌍</p>
      </footer>
    </div>
  );
}
