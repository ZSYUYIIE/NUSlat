import { Suspense } from "react";
import VerifyEmailClient from "./verify-email-client";

function VerifyFallback() {
  return (
    <div className="duo-shell flex min-h-screen items-center justify-center px-4 py-6 sm:py-12">
      <div className="duo-card w-full max-w-md p-6 text-center">
        <p className="text-sm font-bold text-[#5a7c45]">Loading verification...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
