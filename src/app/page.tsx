import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import HomeNewsletter from "@/components/HomeNewsletter";
import AppHeader from "@/components/AppHeader";

export default async function Home() {
  const session = await auth();

  return (
    <div className="duo-shell flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-16 text-center sm:px-10">
        <div className="mb-4 inline-flex items-center rounded-full border-2 border-[#d7f4c9] bg-white px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#46a302]">
          Build Thai Daily
        </div>
        <div className="mb-6">
          <Image
            src="/Logo.png"
            alt="NUSlat logo"
            width={120}
            height={120}
            className="mx-auto h-24 w-24 rounded-2xl object-contain sm:h-28 sm:w-28"
            priority
          />
        </div>
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
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="duo-btn-primary px-8 py-3.5 text-sm"
              >
                Go to Dashboard →
              </Link>
              <Link
                href="/vocabulary"
                className="duo-btn-secondary px-8 py-3.5 text-sm"
              >
                Open Vocabulary
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        {!session?.user ? (
          <Link
            href="/dashboard"
            className="mt-4 text-xs font-bold text-[#4d6b3a] transition-colors hover:text-[#2c5015]"
          >
            Continue as Guest →
          </Link>
        ) : null}

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

        <section className="mt-16 w-full max-w-5xl text-left">
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-[#2c5015] sm:text-3xl">
            How To Use NUSlat
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="duo-card p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">Step 1</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#2c5015]">Choose Thai Level</h3>
              <p className="mt-2 text-sm text-[#4d6b3a]">Open Dashboard, choose Thai Level 1/2/3, then select a chapter path.</p>
            </div>
            <div className="duo-card p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">Step 2</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#2c5015]">Practice Modes</h3>
              <p className="mt-2 text-sm text-[#4d6b3a]">Use quiz mode for recall, writing mode for stroke follow, and vocabulary page for review.</p>
            </div>
            <div className="duo-card p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">Step 3</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#2c5015]">Track Progress</h3>
              <p className="mt-2 text-sm text-[#4d6b3a]">Complete chapters in order and monitor your chapter milestones from the dashboard.</p>
            </div>
          </div>
        </section>

        <section className="mt-12 grid w-full max-w-5xl gap-4 text-left sm:grid-cols-2">
          <div className="duo-card p-6">
            <h3 className="text-xl font-extrabold text-[#2c5015]">Contact</h3>
            <p className="mt-2 text-sm text-[#4d6b3a]">Need support, bug fixes, or chapter updates? Reach out anytime.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#4d6b3a]">
              <li><strong>Email:</strong> support@nuslat.app</li>
              <li><strong>WhatsApp:</strong> +66 90 000 0000</li>
              <li><strong>Office Hours:</strong> Mon-Fri, 9:00-18:00 ICT</li>
            </ul>
          </div>
          <HomeNewsletter />
        </section>
      </main>

      <footer className="border-t-2 border-[#d7f4c9] py-6 text-center text-xs text-[#7f9f69]">
        <p>© 2024 NUSlat · Built for learners everywhere 🌍</p>
      </footer>
    </div>
  );
}
