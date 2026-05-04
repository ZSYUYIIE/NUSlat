"use client";

import { type AktLesson } from "@/data/aanKhianThaiData";
import { type PtChapter } from "@/data/phuutThaiData";

interface LessonViewerProps {
  aktLesson?: AktLesson | null;
  ptChapter?: PtChapter | null;
  onStartQuiz: () => void;
}

export default function LessonViewer({
  aktLesson,
  ptChapter,
  onStartQuiz,
}: LessonViewerProps) {
  if (aktLesson) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-[#2c5015] sm:text-2xl">
            {aktLesson.title}
          </h2>
          <p className="mt-1 text-xs font-bold text-[#87a66f]">
            อ่านเขียนไทย · Aan Khian Thai
          </p>
        </div>

        {aktLesson.sections.map((section, i) => (
          <div key={i} className="duo-card p-5">
            {section.title && (
              <h3 className="mb-3 text-base font-extrabold text-[#2c5015]">
                {section.title}
              </h3>
            )}

            {section.type === "text" && (
              <p className="text-sm leading-relaxed text-[#4d6b3a]">
                {section.content}
              </p>
            )}

            {section.type === "table" && section.tableData && (
              <div className="overflow-x-auto">
                <table className="thai-table w-full text-sm">
                  <thead>
                    <tr>
                      {section.tableData[0]?.map((header, j) => (
                        <th
                          key={j}
                          className="border-b-2 border-[#d8ecd3] bg-[#f8ffef] px-3 py-2 text-left text-xs font-extrabold uppercase tracking-wide text-[#6a8a55]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.tableData.slice(1).map((row, ri) => (
                      <tr key={ri} className="border-b border-[#e8f2e3]">
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-3 py-2 text-[#2c5015] ${
                              ci === 0 ? "thai-char text-lg font-bold" : ""
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.type === "note" && (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                {section.content}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={onStartQuiz}
          className="duo-btn-primary w-full px-6 py-3 text-sm"
        >
          ✍️ Take Quiz for This Lesson
        </button>
      </div>
    );
  }

  if (ptChapter) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-[#2c5015] sm:text-2xl">
            {ptChapter.title}
          </h2>
          <p className="mt-1 text-xs font-bold text-[#87a66f]">
            พูดไทย · Phuut Thai · {ptChapter.titleThai}
          </p>
        </div>

        {/* Conversations */}
        {ptChapter.conversations.map((conv, ci) => (
          <div key={ci} className="duo-card p-5">
            <h3 className="mb-4 text-base font-extrabold text-[#2c5015]">
              {conv.title}
            </h3>
            <div className="space-y-3">
              {conv.dialogues.map((d, di) => (
                <div
                  key={di}
                  className="flex gap-3 rounded-xl border border-[#e8f2e3] bg-[#fbfff8] p-3"
                >
                  <span className="shrink-0 rounded-full bg-[#58cc02] px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {d.speaker}
                  </span>
                  <div>
                    <p className="thai-char text-base font-bold text-[#2c5015]">
                      {d.thai}
                    </p>
                    <p className="mt-0.5 text-xs italic text-[#6f8f58]">
                      {d.phonetic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Vocabulary */}
        {ptChapter.vocabulary.length > 0 && (
          <div className="duo-card p-5">
            <h3 className="mb-4 text-base font-extrabold text-[#2c5015]">
              คำศัพท์ Vocabulary
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {ptChapter.vocabulary.map((v, vi) => (
                <div
                  key={vi}
                  className="flex items-center gap-3 rounded-xl border border-[#e8f2e3] bg-[#fbfff8] p-3"
                >
                  <span className="thai-char text-lg font-bold text-[#2c5015]">
                    {v.thai}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs italic text-[#6f8f58]">
                      {v.phonetic}
                    </p>
                    <p className="text-xs font-bold text-[#4d6b3a]">
                      {v.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onStartQuiz}
          className="duo-btn-primary w-full px-6 py-3 text-sm"
        >
          ✍️ Take Quiz for This Chapter
        </button>
      </div>
    );
  }

  return (
    <div className="duo-card p-6 text-center">
      <p className="text-sm text-[#4d6b3a]">No content found for this section.</p>
    </div>
  );
}
