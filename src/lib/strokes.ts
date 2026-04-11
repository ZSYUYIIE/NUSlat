export const CHARACTER_STROKE_GUIDES: Record<string, string[]> = {
  "ส": [
    "Start at top-left, move right for the head line.",
    "Curve downward to form the body loop.",
    "Finish with a short tail to the right.",
  ],
  "ว": [
    "Draw the top arc from left to right.",
    "Drop into the middle dip.",
    "Lift and finish the right tail.",
  ],
  "ั": ["Place the short upper vowel mark above the main character."],
  "ด": [
    "Draw the top line from left to right.",
    "Curve down to form the lower body.",
  ],
  "ี": ["Draw the long upper vowel mark from top to bottom."],
  "ข": [
    "Start with the top horizontal line.",
    "Sweep down into the looping body.",
    "Close with a short rightward tail.",
  ],
  "อ": [
    "Draw the upper opening stroke from left to right.",
    "Continue down to form the rounded body.",
  ],
  "บ": [
    "Draw the top guideline first.",
    "Curve down into the body.",
    "Finish by closing the right side.",
  ],
  "ค": [
    "Write the top head stroke left to right.",
    "Pull down and curve through the body.",
    "End with a slight hook.",
  ],
  "ุ": ["Place the lower vowel mark under the character body."],
  "ณ": [
    "Draw the top stroke first.",
    "Bring the center body downward.",
    "Finish the right-side curve.",
  ],
  "ไ": ["Write the leading vowel mark from top to bottom before the consonant."],
  "ม": [
    "Draw the upper horizontal line.",
    "Curve down the left body.",
    "Complete the right body curve.",
  ],
};

export function getCharacterStrokeGuide(char: string) {
  return (
    CHARACTER_STROKE_GUIDES[char] ?? [
      "Start from the top of the character.",
      "Write the main body with one smooth downward motion.",
      "Keep spacing even so the character remains readable.",
    ]
  );
}
