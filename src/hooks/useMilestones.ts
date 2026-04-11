"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { getChapterSequence, normalizeProgressIds } from "@/lib/modules";

const GUEST_STORAGE_KEY = "nuslat_guest_progress";
const VALID_MILESTONES = getChapterSequence();

export interface UseMilestonesReturn {
  completedMilestones: string[];
  completeModule: (moduleId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  /** true while session status is resolving or initial data is being loaded */
  loading: boolean;
}

// useSyncExternalStore-based hydration flag — avoids extra renders compared to
// a useEffect/useState pattern and prevents SSR/client mismatch.
const subscribe = () => () => {};
function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

/** Reads milestone progress from localStorage as a Promise (always async). */
function readGuestProgress(): Promise<string[]> {
  return Promise.resolve().then(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every((v) => typeof v === "string")
        ) {
          return normalizeProgressIds(parsed as string[]);
        }
      }
    } catch {
      // Malformed storage — start fresh
    }
    return [];
  });
}

/**
 * Auth-aware milestones hook.
 *
 * - **Authenticated** users: reads/writes via `/api/milestones` (MongoDB).
 * - **Guest** users: reads/writes via `localStorage` under `nuslat_guest_progress`.
 *
 * localStorage is only accessed after hydration to avoid SSR/client mismatches.
 */
export function useMilestones(): UseMilestonesReturn {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isSessionLoading = status === "loading";
  const hydrated = useIsHydrated();

  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  // dataLoading starts true; only ever set to false to avoid synchronous
  // setState inside effects.
  const [dataLoading, setDataLoading] = useState(true);

  // Load initial progress once hydrated and session is resolved
  useEffect(() => {
    if (!hydrated || isSessionLoading) return;

    if (isAuthenticated) {
      fetch("/api/milestones")
        .then((res) => res.json())
        .then((data) => {
          const progress = Array.isArray(data.completedChapters)
            ? data.completedChapters
            : data.completedMilestones;
          if (Array.isArray(progress)) {
            setCompletedMilestones(normalizeProgressIds(progress));
          }
        })
        .catch(() =>
          setError("Failed to load your progress. Please refresh.")
        )
        .finally(() => setDataLoading(false));
    } else {
      readGuestProgress()
        .then((milestones) => setCompletedMilestones(milestones))
        .finally(() => setDataLoading(false));
    }
  }, [hydrated, isAuthenticated, isSessionLoading]);

  const completeModule = useCallback(
    async (moduleId: string) => {
      if (!VALID_MILESTONES.includes(moduleId)) return;
      setError(null);

      if (isAuthenticated) {
        // Authenticated path: persist to MongoDB via API
        try {
          const res = await fetch("/api/milestones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chapter: moduleId }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error ?? "Failed to complete milestone.");
            return;
          }
          const progress = Array.isArray(data.completedChapters)
            ? data.completedChapters
            : data.completedMilestones;
          if (Array.isArray(progress)) {
            setCompletedMilestones(normalizeProgressIds(progress));
          }
        } catch {
          setError("Network error. Please try again.");
        }
      } else {
        // Guest path: validate prerequisite then persist to localStorage
        setCompletedMilestones((prev) => {
          if (prev.includes(moduleId)) return prev;

          const idx = VALID_MILESTONES.indexOf(moduleId);
          if (idx > 0 && !prev.includes(VALID_MILESTONES[idx - 1])) {
            setError("Complete the previous chapter first.");
            return prev;
          }

          const next = [...prev, moduleId];
          try {
            localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next));
          } catch {
            // Quota exceeded or private browsing — ignore
          }
          return next;
        });
      }
    },
    [isAuthenticated]
  );

  const clearError = useCallback(() => setError(null), []);

  const resetProgress = useCallback(async () => {
    setError(null);
    if (isAuthenticated) {
      try {
        const res = await fetch("/api/milestones", { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Failed to reset progress.");
          return;
        }
      } catch {
        setError("Network error. Please try again.");
        return;
      }
    } else {
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    setCompletedMilestones([]);
  }, [isAuthenticated]);

  return {
    completedMilestones,
    completeModule,
    resetProgress,
    error,
    clearError,
    loading: !hydrated || isSessionLoading || dataLoading,
  };
}
