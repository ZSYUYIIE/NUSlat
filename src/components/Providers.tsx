"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { applyThemeMode, getStoredThemeMode } from "@/lib/theme";
import { PhoneticAppendixProvider } from "./PhoneticAppendixContext";
import PhoneticAppendix from "./PhoneticAppendixFallback";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyThemeMode(getStoredThemeMode());
  }, []);

  return (
    <SessionProvider>
      <PhoneticAppendixProvider>
        {children}
        <PhoneticAppendix />
      </PhoneticAppendixProvider>
    </SessionProvider>
  );
}
