"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type DockPoint = {
  x: number;
  y: number;
};

type DockSize = {
  width: number;
  height: number;
};

interface PhoneticAppendixContextValue {
  isOpen: boolean;
  isMinimized: boolean;
  position: DockPoint;
  size: DockSize;
  openAppendix: () => void;
  closeAppendix: () => void;
  toggleAppendix: () => void;
  setIsMinimized: (minimized: boolean) => void;
  setPosition: (position: DockPoint) => void;
  setSize: (size: DockSize) => void;
}

const STORAGE_KEY = "nuslat-phonetic-appendix-dock";

const defaultState = {
  isOpen: false,
  isMinimized: false,
  position: { x: 28, y: 96 },
  size: { width: 860, height: 740 },
};

const PhoneticAppendixContext = createContext<PhoneticAppendixContextValue | null>(null);

export function PhoneticAppendixProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultState.isOpen);
  const [isMinimized, setIsMinimized] = useState(defaultState.isMinimized);
  const [position, setPosition] = useState(defaultState.position);
  const [size, setSize] = useState(defaultState.size);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<typeof defaultState>;
        if (typeof parsed.isMinimized === "boolean") setIsMinimized(parsed.isMinimized);
        if (parsed.position && typeof parsed.position.x === "number" && typeof parsed.position.y === "number") {
          setPosition(parsed.position);
        }
        if (parsed.size && typeof parsed.size.width === "number" && typeof parsed.size.height === "number") {
          setSize(parsed.size);
        }
      }
    } catch {
      // Ignore storage parse issues and fall back to defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isMinimized, position, size })
      );
    } catch {
      // The appendix remains usable when storage is unavailable.
    }
  }, [hydrated, isMinimized, position, size]);

  const openAppendix = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeAppendix = useCallback(() => setIsOpen(false), []);

  const toggleAppendix = useCallback(() => {
    setIsOpen((current) => {
      if (!current) setIsMinimized(false);
      return !current;
    });
  }, []);

  const value = useMemo<PhoneticAppendixContextValue>(
    () => ({
      isOpen,
      isMinimized,
      position,
      size,
      openAppendix,
      closeAppendix,
      toggleAppendix,
      setIsMinimized,
      setPosition,
      setSize,
    }),
    [
      closeAppendix,
      isMinimized,
      isOpen,
      openAppendix,
      position,
      size,
      toggleAppendix,
    ]
  );

  return <PhoneticAppendixContext.Provider value={value}>{children}</PhoneticAppendixContext.Provider>;
}

export function usePhoneticAppendix() {
  const context = useContext(PhoneticAppendixContext);

  if (!context) {
    throw new Error("usePhoneticAppendix must be used within PhoneticAppendixProvider");
  }

  return context;
}
