import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import HomeDailyNotification from "@/components/HomeDailyNotification";
import AppHeader from "@/components/AppHeader";

export default async function Home() {
  const session = await auth();

  return (
    <div className="duo-shell duo-page-offset flex min-h-screen flex-col">
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
          Learn LAT
          <br />
          <span className="text-[#58cc02]">more efficiently</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-[#4d6b3a]">
          Learn LAT more efficiently with a guided path
          across quizzes, writing practice, and vocabulary review.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          {session?.user ? (
            <>
              <Link
                href="/learn"
                className="duo-btn-primary px-8 py-3.5 text-sm"
              >
                Go to Learn →
              </Link>
              <Link
                href="/dashboard"
                className="duo-btn-secondary px-8 py-3.5 text-sm"
              >
                Go to Quiz
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
            href="/learn"
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
              <h3 className="mt-1 text-lg font-extrabold text-[#2c5015]">Open Learn</h3>
              <p className="mt-2 text-sm text-[#4d6b3a]">Choose Thai Level 1/2/3 and follow the chapter order with lock progression.</p>
            </div>
            <div className="duo-card p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">Step 2</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#2c5015]">Guided Chapter Practice</h3>
              <p className="mt-2 text-sm text-[#4d6b3a]">Learn with listen-and-repeat, stroke follow writing, and chapter-by-chapter guidance.</p>
            </div>
            <div className="duo-card p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#7f9f69]">Step 3</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#2c5015]">Take Quizzes</h3>
              <p className="mt-2 text-sm text-[#4d6b3a]">After guided study, move to Quiz to check retention and earn progress milestones.</p>
            </div>
          </div>
        </section>

        <section className="mt-12 w-full max-w-5xl text-left">
          <HomeDailyNotification />
        </section>

        <section className="mt-8 w-full max-w-5xl text-left">
          <div className="duo-card p-6">
            <h3 className="text-xl font-extrabold text-[#2c5015]">Contact for enquiries</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              <a
                href="https://t.me/dotiiee"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#d7f4c9] bg-white px-3 py-3 text-left text-sm font-bold text-[#2c5015]"
              >
                <Image
                  src="/telegram.png"
                  alt="Telegram logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span>Telegram: @dotiiee</span>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-[#d7f4c9] bg-white px-3 py-3 text-left text-sm font-bold text-[#2c5015]">
                <Image
                  src="/wechat.png"
                  alt="WeChat logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span>WeChat: zuyi0605</span>
              </div>

              <a
                href="https://wa.me/6584898001"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#d7f4c9] bg-white px-3 py-3 text-left text-sm font-bold text-[#2c5015]"
              >
                <Image
                  src="/whatsapp.png"
                  alt="WhatsApp logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span>WhatsApp: +65 84898001</span>
              </a>

              <a
                href="mailto:dr.dotiiee@gmail.com"
                className="flex items-center gap-3 rounded-xl border border-[#d7f4c9] bg-white px-3 py-3 text-left text-sm font-bold text-[#2c5015]"
              >
                <Image
                  src="/gmail.png"
                  alt="Gmail logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="break-all">Gmail: dr.dotiiee@gmail.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
