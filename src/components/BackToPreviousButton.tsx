"use client";

import { useRouter } from "next/navigation";

interface BackToPreviousButtonProps {
  fallbackHref: string;
  label?: string;
  className?: string;
}

export default function BackToPreviousButton({
  fallbackHref,
  label = "Back to Previous Page",
  className = "",
}: BackToPreviousButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1 rounded-full border border-[#d7f4c9] bg-white px-3 py-1.5 text-xs font-extrabold text-[#4d6b3a] transition-colors hover:text-[#2c5015] ${className}`}
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
}
