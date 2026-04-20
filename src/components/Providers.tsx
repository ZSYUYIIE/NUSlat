"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { applyThemeMode, getStoredThemeMode } from "@/lib/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyThemeMode(getStoredThemeMode());
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
