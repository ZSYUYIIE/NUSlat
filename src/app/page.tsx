import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🦜</span>
          <span className="text-2xl font-extrabold text-green-600">NUSlat</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="rounded-xl px-5 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-green-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-green-600"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-10 text-center sm:px-10">
        <div className="mb-6 text-7xl">🦜</div>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Learn vocabulary{" "}
          <span className="text-green-600">the fun way</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
          Master 3,000 essential words through a gamified, step-by-step learning
          path. Unlock modules as you progress, earn XP, and build fluency.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="rounded-2xl bg-green-500 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-green-600 hover:shadow-xl active:scale-95"
          >
            Start Learning for Free →
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-2xl border-2 border-green-500 px-8 py-4 text-base font-bold text-green-600 transition hover:bg-green-50"
          >
            I Already Have an Account
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: "🌱",
              title: "1,000 Words",
              desc: "Build a solid foundation with 1,000 essential words",
            },
            {
              icon: "🌿",
              title: "2,000 Words",
              desc: "Expand your vocabulary with intermediate content",
            },
            {
              icon: "🌳",
              title: "3,000 Words",
              desc: "Achieve fluency with advanced vocabulary mastery",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 font-bold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>© 2024 NUSlat · Built for learners everywhere 🌍</p>
      </footer>
    </div>
  );
}
