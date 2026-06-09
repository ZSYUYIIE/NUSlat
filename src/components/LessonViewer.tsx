"use client";

import { type AktLesson } from "@/data/aanKhianThaiData";
import { type PtSection } from "@/data/phuutThaiData";

interface LessonViewerProps {
  aktLesson?: AktLesson | null;
  ptSection?: PtSection | null;
  onStartQuiz: () => void;
}

export default function LessonViewer({
  aktLesson,
  ptSection,
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

        {aktLesson.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="duo-card p-5">
            {section.title ? (
              <h3 className="mb-3 text-base font-extrabold text-[#2c5015]">
                {section.title}
              </h3>
            ) : null}

            {section.type === "text" ? (
              <p className="text-sm leading-relaxed text-[#4d6b3a]">
                {section.content}
              </p>
            ) : null}

            {section.type === "table" && section.tableData ? (
              <div className="overflow-x-auto">
                <table className="thai-table w-full text-sm">
                  <thead>
                    <tr>
                      {section.tableData[0]?.map((header) => (
                        <th
                          key={header}
                          className="border-b-2 border-[#d8ecd3] bg-[#f8ffef] px-3 py-2 text-left text-xs font-extrabold uppercase tracking-wide text-[#6a8a55]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.tableData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-[#e8f2e3]">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${cell}-${cellIndex}`}
                            className={`px-3 py-2 text-[#2c5015] ${
                              cellIndex === 0 ? "thai-char text-lg font-bold" : ""
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
            ) : null}

            {section.type === "note" ? (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                {section.content}
              </div>
            ) : null}
          </div>
        ))}

        <button
          onClick={onStartQuiz}
          className="duo-btn-primary w-full px-6 py-3 text-sm"
        >
          Take Quiz for This Lesson
        </button>
      </div>
    );
  }

  if (ptSection) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#d8ecd3] bg-[#f8ffef] p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest">
            <span className="rounded-full bg-[#58cc02] px-2.5 py-1 text-white">
              Chapter {ptSection.chapterNumber}{ptSection.letter}
            </span>
            <span className="text-[#6f8f58]">PDF pages {ptSection.pdfPages}</span>
            <span className="text-[#6f8f58]">{ptSection.contentType}</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2c5015] sm:text-2xl">
            {ptSection.title}
          </h2>
          <p className="mt-1 text-sm font-bold text-[#4d6b3a]">
            Chapter {ptSection.chapterNumber}: {ptSection.chapterTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#4d6b3a]">
            {ptSection.overview}
          </p>
        </div>

        {ptSection.conversations.map((conversation) => (
          <div key={conversation.title} className="duo-card p-5">
            <h3 className="mb-4 text-base font-extrabold text-[#2c5015]">
              {conversation.title}
            </h3>
            <div className="space-y-3">
              {conversation.dialogues.map((line, index) => (
                <div
                  key={`${line.speaker}-${index}`}
                  className="flex gap-3 rounded-xl border border-[#e8f2e3] bg-[#fbfff8] p-3"
                >
                  <span className="h-fit shrink-0 rounded-full bg-[#58cc02] px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {line.speaker}
                  </span>
                  <div>
                    <p className="thai-char text-base font-bold text-[#2c5015]">
                      {line.thai}
                    </p>
                    <p className="mt-0.5 text-xs italic text-[#6f8f58]">
                      {line.phonetic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {ptSection.notes.length > 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-amber-700">
              Language notes
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-amber-900">
              {ptSection.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {ptSection.vocabulary.length > 0 ? (
          <div className="duo-card p-5">
            <h3 className="mb-4 text-base font-extrabold text-[#2c5015]">
              Vocabulary
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {ptSection.vocabulary.map((item) => (
                <div
                  key={`${item.thai}-${item.phonetic}`}
                  className="flex items-center gap-3 rounded-xl border border-[#e8f2e3] bg-[#fbfff8] p-3"
                >
                  <span className="thai-char text-lg font-bold text-[#2c5015]">
                    {item.thai}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs italic text-[#6f8f58]">{item.phonetic}</p>
                    <p className="text-xs font-bold text-[#4d6b3a]">{item.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <button
          onClick={onStartQuiz}
          className="duo-btn-primary w-full px-6 py-3 text-sm"
        >
          Continue to Section {ptSection.letter} Exercises
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
