"use client";

import { useRef, useState, useEffect, useCallback, useId } from "react";
import { evaluateWritingCanvas, type WritingResult } from "@/lib/writing-evaluator";

interface Props {
  thaiWord: string;
  phonetic: string;
  meaning: string;
  onClose: () => void;
}

export default function WriteModal({ thaiWord, phonetic, meaning, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [writingResult, setWritingResult] = useState<WritingResult | null>(null);
  const defaultFontSize = Math.max(2, 10 / thaiWord.length);
  const [fontSize, setFontSize] = useState(defaultFontSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * ratio);
    canvas.height = Math.floor(rect.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#eef8d8";
  }, []);

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = getCanvasPoint(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    setIsDrawing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = getCanvasPoint(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hasInk) {
      setHasInk(true);
    }
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    setWritingResult(null);
  }, []);

  const checkWriting = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setWritingResult(
      evaluateWritingCanvas({
        canvas,
        hasInk,
        targetText: thaiWord,
      })
    );
  }, [hasInk, thaiWord]);

  // Close on backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  // Close on Escape key + focus management
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key !== "Tab") return;
      const modal = modalRef.current;
      if (!modal) return;

      const focusables = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#d7f4c9] bg-white px-5 py-4">
          <div>
            <h2 id={titleId} className="text-sm font-extrabold tracking-tight text-[#2c5015]">
              Practice Writing
            </h2>
            <p className="mt-0.5 text-xs text-[#6a8a55]">
              {thaiWord}
              {phonetic ? ` · ${phonetic}` : ""}
              {meaning ? ` · ${meaning}` : ""}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-full p-1.5 text-[#6a8a55] hover:bg-[#f0fce8] hover:text-[#2c5015]"
            aria-label="Close"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div>
          {/* Canvas panel */}
          <div className="bg-[#184f2b] p-5 sm:rounded-b-3xl">
            {/* Drawing area */}
            <div className="relative mb-3 h-72 w-full overflow-hidden rounded-2xl border-2 border-[#3c8d52] bg-[#0f3f22]">
              {/* Watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
                <span
                  className="select-none whitespace-nowrap font-extrabold text-[#2c7c40]/60"
                  style={{ fontSize: `${fontSize}rem` }}
                >
                  {thaiWord}
                </span>
              </div>
              <canvas
                ref={canvasRef}
                onPointerDown={beginDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="absolute inset-0 h-full w-full touch-none"
              />
            </div>

            {/* Controls */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                onClick={clearCanvas}
                className="rounded-full border border-[#3f9155] bg-[#0f3f22] px-3 py-1.5 text-xs font-bold text-[#d7f8cd]"
              >
                Clear
              </button>
              <button
                onClick={checkWriting}
                disabled={!hasInk}
                className="rounded-full border border-[#97de9f] bg-[#c6f7b8] px-3 py-1.5 text-xs font-extrabold text-[#1a582d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check Accuracy
              </button>

              <div className="ml-auto flex items-center gap-1">
                <span className="text-[10px] font-bold text-[#b9e8c0]">Size</span>
                <button
                  onClick={() => setFontSize((s) => Math.max(1, parseFloat((s - 0.5).toFixed(1))))}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3f9155] bg-[#0f3f22] text-sm font-bold text-[#d7f8cd] hover:bg-[#1a5c32]"
                  aria-label="Decrease font size"
                >
                  −
                </button>
                <button
                  onClick={() => setFontSize((s) => Math.min(10, parseFloat((s + 0.5).toFixed(1))))}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-[#97de9f] bg-[#c6f7b8] text-sm font-extrabold text-[#1a582d] hover:bg-[#b3f0a0]"
                  aria-label="Increase font size"
                >
                  +
                </button>
              </div>
            </div>

            {/* Result */}
            {writingResult ? (
              <div
                className={`rounded-xl border px-3 py-2 text-xs ${
                  writingResult.passed
                    ? "border-[#8fe1a0] bg-[#0f5b2d] text-[#ddffe7]"
                    : "border-[#f1c37d] bg-[#6d4a1f] text-[#fff4db]"
                }`}
              >
                <p className="font-extrabold">
                  {writingResult.passed
                    ? "Readable — great job!"
                    : "Keep practising — follow the stroke order."}
                </p>
                <p className="mt-1 text-[11px] opacity-80">
                  Score {Math.round(writingResult.score * 100)}% &bull;{" "}
                  Coverage {Math.round(writingResult.coverage * 100)}% &bull;{" "}
                  Precision {Math.round(writingResult.precision * 100)}%
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#b9e8c0]">
                Trace the character above, then tap Check Accuracy.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
