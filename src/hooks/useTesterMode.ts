"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nuslat_tester_mode";

export function useTesterMode() {
  const [isTester, setIsTester] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setIsTester(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleTester = useCallback(() => {
    setIsTester((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  return { isTester, toggleTester };
}
