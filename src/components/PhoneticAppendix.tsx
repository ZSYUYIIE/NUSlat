"use client";

import TableA from "./phonetic-appendix/TableA";
import TableB from "./phonetic-appendix/TableB";
import TableC from "./phonetic-appendix/TableC";
import TableD from "./phonetic-appendix/TableD";
import TableE from "./phonetic-appendix/TableE";
import TableF from "./phonetic-appendix/TableF";

export type PhoneticAppendixSection = {
  id: string;
  shortcut: string;
  label: string;
};

export const PHONETIC_APPENDIX_SECTIONS: PhoneticAppendixSection[] = [
  { id: "appendix-table-a", shortcut: "A", label: "Simple vowels" },
  { id: "appendix-table-b", shortcut: "B", label: "Short & long" },
  { id: "appendix-table-c", shortcut: "C", label: "Diphthongs" },
  { id: "appendix-table-d", shortcut: "D", label: "Final w & y" },
  { id: "appendix-table-e", shortcut: "E", label: "Consonants" },
  { id: "appendix-table-f", shortcut: "F", label: "Tones" },
];

export default function PhoneticAppendixContent() {
  return (
    <article className="thai-char space-y-10 text-[15px] leading-relaxed text-[#36522b]">
      <div className="rounded-2xl border border-[#d8e9ce] bg-[#f5faef] p-4">
        <p>
          This phonetic transcription follows the system adopted by J. Marvin
          Brown in the A.U.A. Thai Course series. The explanation is adapted
          from A.U.A. Thai Course Book 1, pages xxii-xxiii.
        </p>
      </div>
      <TableA />
      <TableB />
      <TableC />
      <TableD />
      <TableE />
      <TableF />
    </article>
  );
}
