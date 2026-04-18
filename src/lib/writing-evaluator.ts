export const WRITING_THRESHOLDS = {
  coverage: 0.24,
  precision: 0.2,
  legibility: 0.45,
  score: 0.32,
} as const;

const WRITING_SCORE_WEIGHTS = {
  coverage: 0.64,
  precision: 0.26,
  legibility: 0.1,
} as const;

const INK_ALPHA_CUTOFF = 24;

export interface WritingResult {
  score: number;
  coverage: number;
  precision: number;
  legibility: number;
  passed: boolean;
}

interface WritingEvaluatorOptions {
  canvas: HTMLCanvasElement;
  hasInk: boolean;
  targetText: string;
  getFontSizePx?: (logicalWidth: number, logicalHeight: number, targetText: string) => number;
}

const EMPTY_WRITING_RESULT: WritingResult = {
  score: 0,
  coverage: 0,
  precision: 0,
  legibility: 0,
  passed: false,
};

const getDefaultFontSizePx = (logicalWidth: number, logicalHeight: number, targetText: string) =>
  Math.min(logicalWidth / (targetText.length * 0.9 + 0.2), logicalHeight * 0.52);

export const evaluateWritingCanvas = ({
  canvas,
  hasInk,
  targetText,
  getFontSizePx = getDefaultFontSizePx,
}: WritingEvaluatorOptions): WritingResult => {
  if (!hasInk) {
    return EMPTY_WRITING_RESULT;
  }

  const userCtx = canvas.getContext("2d");
  if (!userCtx) return EMPTY_WRITING_RESULT;

  const width = canvas.width;
  const height = canvas.height;
  const userData = userCtx.getImageData(0, 0, width, height).data;

  const templateCanvas = document.createElement("canvas");
  templateCanvas.width = width;
  templateCanvas.height = height;
  const templateCtx = templateCanvas.getContext("2d");
  if (!templateCtx) return EMPTY_WRITING_RESULT;

  const ratio = window.devicePixelRatio || 1;
  const logicalWidth = width / ratio;
  const logicalHeight = height / ratio;

  templateCtx.scale(ratio, ratio);
  templateCtx.clearRect(0, 0, logicalWidth, logicalHeight);
  templateCtx.fillStyle = "#0b2f18";
  templateCtx.textAlign = "center";
  templateCtx.textBaseline = "middle";
  const fontSizePx = getFontSizePx(logicalWidth, logicalHeight, targetText);
  templateCtx.font = `700 ${fontSizePx}px "Noto Sans Thai", "Sarabun", sans-serif`;
  templateCtx.fillText(targetText, logicalWidth / 2, logicalHeight / 2);

  const templateData = templateCtx.getImageData(0, 0, width, height).data;

  let targetPixels = 0;
  let userPixels = 0;
  let overlapPixels = 0;
  for (let i = 3; i < userData.length; i += 4) {
    const userInk = userData[i] > INK_ALPHA_CUTOFF;
    const targetInk = templateData[i] > INK_ALPHA_CUTOFF;
    if (targetInk) targetPixels++;
    if (userInk) userPixels++;
    if (userInk && targetInk) overlapPixels++;
  }

  const coverage = targetPixels > 0 ? overlapPixels / targetPixels : 0;
  const precision = userPixels > 0 ? overlapPixels / userPixels : 0;
  const density = targetPixels > 0 ? userPixels / targetPixels : 0;
  const legibility = Math.max(0, 1 - Math.abs(1 - density));
  const score =
    coverage * WRITING_SCORE_WEIGHTS.coverage +
    precision * WRITING_SCORE_WEIGHTS.precision +
    legibility * WRITING_SCORE_WEIGHTS.legibility;
  const passed =
    coverage >= WRITING_THRESHOLDS.coverage &&
    precision >= WRITING_THRESHOLDS.precision &&
    legibility >= WRITING_THRESHOLDS.legibility &&
    score >= WRITING_THRESHOLDS.score;

  return { score, coverage, precision, legibility, passed };
};
