"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PhoneticAppendixContent, {
  PHONETIC_APPENDIX_SECTIONS,
} from "./PhoneticAppendix";
import { usePhoneticAppendix } from "./PhoneticAppendixContext";

type DockPoint = {
  x: number;
  y: number;
};

type DockSize = {
  width: number;
  height: number;
};

const VIEWPORT_GAP = 8;
const MINIMUM_WIDTH = 360;
const MINIMUM_HEIGHT = 320;
const MINIMIZED_HEIGHT = 64;

function IconMinimize({ minimized }: { minimized: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {minimized ? (
        <>
          <path d="M7 7h10v10H7z" />
          <path d="M5 9V5h4" />
        </>
      ) : (
        <path d="M5 12h14" />
      )}
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function clampWindow(
  nextPosition: DockPoint,
  nextSize: DockSize,
  minimized: boolean
) {
  const availableWidth = Math.max(1, window.innerWidth - VIEWPORT_GAP * 2);
  const availableHeight = Math.max(1, window.innerHeight - VIEWPORT_GAP * 2);
  const minimumWidth = Math.min(MINIMUM_WIDTH, availableWidth);
  const minimumHeight = Math.min(MINIMUM_HEIGHT, availableHeight);
  const width = Math.min(Math.max(nextSize.width, minimumWidth), availableWidth);
  const height = Math.min(
    Math.max(nextSize.height, minimumHeight),
    availableHeight
  );
  const visibleHeight = minimized ? Math.min(MINIMIZED_HEIGHT, availableHeight) : height;

  return {
    position: {
      x: Math.min(
        Math.max(nextPosition.x, VIEWPORT_GAP),
        Math.max(VIEWPORT_GAP, window.innerWidth - width - VIEWPORT_GAP)
      ),
      y: Math.min(
        Math.max(nextPosition.y, VIEWPORT_GAP),
        Math.max(VIEWPORT_GAP, window.innerHeight - visibleHeight - VIEWPORT_GAP)
      ),
    },
    size: { width, height },
  };
}

export default function PhoneticAppendixFallback() {
  const {
    closeAppendix,
    isOpen,
    isMinimized,
    position,
    size,
    setIsMinimized,
    setPosition,
    setSize,
  } = usePhoneticAppendix();
  const contentRef = useRef<HTMLDivElement>(null);
  const interactionCleanupRef = useRef<(() => void) | null>(null);
  const [activeSectionId, setActiveSectionId] = useState(
    PHONETIC_APPENDIX_SECTIONS[0]?.id ?? ""
  );

  const stopInteraction = useCallback(() => {
    interactionCleanupRef.current?.();
    interactionCleanupRef.current = null;
  }, []);

  const jumpToTable = useCallback(
    (id: string) => {
      setIsMinimized(false);
      setActiveSectionId(id);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const scroller = contentRef.current;
          const target = document.getElementById(id);
          if (!scroller || !target) return;

          const top =
            target.getBoundingClientRect().top -
            scroller.getBoundingClientRect().top +
            scroller.scrollTop -
            16;
          scroller.scrollTo({ top, behavior: "smooth" });
        });
      });
    },
    [setIsMinimized]
  );

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, textarea, select")) return;

    stopInteraction();
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = position;
    document.body.style.userSelect = "none";

    const handlePointerMove = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) return;
      const clamped = clampWindow(
        {
          x: origin.x + pointerEvent.clientX - startX,
          y: origin.y + pointerEvent.clientY - startY,
        },
        size,
        isMinimized
      );
      setPosition(clamped.position);
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.style.userSelect = "";
    };

    const handlePointerUp = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) return;
      cleanup();
      interactionCleanupRef.current = null;
    };

    interactionCleanupRef.current = cleanup;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const beginResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    stopInteraction();

    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = size;
    const startPosition = position;
    document.body.style.userSelect = "none";

    const handlePointerMove = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) return;
      const clamped = clampWindow(
        startPosition,
        {
          width: startSize.width + pointerEvent.clientX - startX,
          height: startSize.height + pointerEvent.clientY - startY,
        },
        false
      );
      setPosition(clamped.position);
      setSize(clamped.size);
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.style.userSelect = "";
    };

    const handlePointerUp = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== pointerId) return;
      cleanup();
      interactionCleanupRef.current = null;
    };

    interactionCleanupRef.current = cleanup;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  useEffect(() => stopInteraction, [stopInteraction]);

  useEffect(() => {
    if (!isOpen) return;

    const keepInsideViewport = () => {
      const clamped = clampWindow(position, size, isMinimized);
      if (
        clamped.position.x !== position.x ||
        clamped.position.y !== position.y
      ) {
        setPosition(clamped.position);
      }
      if (
        clamped.size.width !== size.width ||
        clamped.size.height !== size.height
      ) {
        setSize(clamped.size);
      }
    };

    keepInsideViewport();
    window.addEventListener("resize", keepInsideViewport);
    return () => window.removeEventListener("resize", keepInsideViewport);
  }, [
    isMinimized,
    isOpen,
    position,
    setPosition,
    setSize,
    size,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeAppendix();
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const section = PHONETIC_APPENDIX_SECTIONS.find(
        (item) => item.shortcut.toLowerCase() === event.key.toLowerCase()
      );
      if (!section) return;

      event.preventDefault();
      jumpToTable(section.id);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAppendix, isOpen, jumpToTable]);

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const scroller = contentRef.current;
    if (!scroller) return;

    const updateActiveSection = () => {
      const scrollerTop = scroller.getBoundingClientRect().top;
      let closestId = PHONETIC_APPENDIX_SECTIONS[0]?.id ?? "";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const section of PHONETIC_APPENDIX_SECTIONS) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        const distance = Math.abs(element.getBoundingClientRect().top - scrollerTop - 16);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = section.id;
        }
      }

      setActiveSectionId(closestId);
    };

    updateActiveSection();
    scroller.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => scroller.removeEventListener("scroll", updateActiveSection);
  }, [isMinimized, isOpen]);

  const panelStyle = useMemo<React.CSSProperties>(
    () => ({
      left: position.x,
      top: position.y,
      width: size.width,
      height: isMinimized ? MINIMIZED_HEIGHT : size.height,
      maxWidth: `calc(100vw - ${VIEWPORT_GAP * 2}px)`,
      maxHeight: `calc(100vh - ${VIEWPORT_GAP * 2}px)`,
    }),
    [isMinimized, position.x, position.y, size.height, size.width]
  );

  if (!isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <section
        role="dialog"
        aria-label="Appendix: Phonetic Transcription"
        className="pointer-events-auto absolute flex min-w-[min(360px,calc(100vw-16px))] flex-col overflow-hidden rounded-2xl border border-[#c6dbb9] bg-[#fbfdf8] shadow-[0_24px_80px_rgba(28,58,20,0.3)]"
        style={panelStyle}
      >
        <div
          className="flex min-h-16 cursor-grab items-center justify-between gap-3 border-b border-[#d9e8cf] bg-gradient-to-r from-[#eff8e6] to-white px-4 py-2.5 active:cursor-grabbing"
          onDoubleClick={() => setIsMinimized(!isMinimized)}
          onPointerDown={beginDrag}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-extrabold tracking-tight text-[#24411a] sm:text-base">
                Phonetic Appendix
              </h3>
              <span className="hidden rounded-full bg-[#dff2cc] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#52743d] sm:inline">
                A-F
              </span>
            </div>
            {!isMinimized ? (
              <p className="mt-0.5 truncate text-[11px] text-[#6c8460] sm:text-xs">
                Drag to move. Resize from the corner. Press A-F to jump.
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d8ecd3] bg-white text-[#557244] shadow-sm transition hover:bg-[#f4faeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58cc02]"
              aria-label={isMinimized ? "Restore appendix" : "Minimize appendix"}
              title={isMinimized ? "Restore" : "Minimize"}
            >
              <IconMinimize minimized={isMinimized} />
            </button>
            <button
              type="button"
              onClick={closeAppendix}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d8ecd3] bg-white text-[#557244] shadow-sm transition hover:border-[#efcaca] hover:bg-[#fef2f2] hover:text-[#8f2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d45b5b]"
              aria-label="Close appendix"
              title="Close (Esc)"
            >
              <IconClose />
            </button>
          </div>
        </div>

        {!isMinimized ? (
          <>
            <nav
              aria-label="Phonetic appendix tables"
              className="shrink-0 overflow-x-auto border-b border-[#e1edd4] bg-white px-3 py-2.5"
            >
              <div className="flex min-w-max gap-2">
                {PHONETIC_APPENDIX_SECTIONS.map((section) => {
                  const isActive = activeSectionId === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => jumpToTable(section.id)}
                      aria-current={isActive ? "location" : undefined}
                      aria-keyshortcuts={section.shortcut}
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58cc02]",
                        isActive
                          ? "border-[#58cc02] bg-[#58cc02] text-white shadow-sm"
                          : "border-[#d9e8cf] bg-[#f7fbf2] text-[#496337] hover:bg-[#edf7df]",
                      ].join(" ")}
                    >
                      <kbd
                        className={[
                          "rounded px-1.5 py-0.5 font-mono text-[10px] font-black",
                          isActive ? "bg-white/20" : "bg-white text-[#5d7c49]",
                        ].join(" ")}
                      >
                        {section.shortcut}
                      </kbd>
                      <span className="whitespace-nowrap">{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div ref={contentRef} className="min-h-0 flex-1 overflow-auto px-4 py-5 sm:px-6">
              <PhoneticAppendixContent />
            </div>

            <button
              type="button"
              aria-label="Resize appendix"
              title="Drag to resize"
              onPointerDown={beginResize}
              className="absolute bottom-1.5 right-1.5 h-6 w-6 cursor-se-resize rounded-br-xl border-b-2 border-r-2 border-[#83a86d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58cc02]"
            />
          </>
        ) : null}
      </section>
    </div>
  );
}
