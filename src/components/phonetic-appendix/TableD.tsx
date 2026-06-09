import { TableCaption, TableCell, TableFrame } from "./TableParts";

const rows = [
  ["uy", "khuy", "chat", "iw", "hǐw", "hungry"],
  ["ooy", "dooy", "with, by", "ew", "rew", "fast"],
  ["əəy", "nəəy", "butter", "eew", "leew", "bad"],
  ["ɔy", "thɔ̌y", "back up", "ɛw", "thɛ̌w", "row"],
  ["ɔɔy", "rɔ́ɔy", "100", "ɛɛw", "mɛɛw", "cat"],
  ["ay", "mây", "not", "aw", "khâw", "enter"],
  ["aay", "máay", "wood", "aaw", "khâaw", "rice"],
  ["iaw", "líaw", "turn", "ʉaj", "nʉ̀ay", "tired"],
  ["uaj", "ruay", "rich", "", "", ""],
];

export default function TableD() {
  return (
    <section id="appendix-table-d" className="scroll-mt-4 space-y-3">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#72a153]">Table D</p>
        <h4 className="mt-1 text-xl font-extrabold text-[#1d3214]">Words with final w and y</h4>
      </div>
      <p>These examples use the semivowels w and y as final consonants.</p>

      <TableFrame>
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <TableCaption>Words with final w and y</TableCaption>
          <thead>
            <tr>
              <TableCell header>Vowel</TableCell>
              <TableCell header>Thai</TableCell>
              <TableCell header>Meaning</TableCell>
              <TableCell header>Vowel</TableCell>
              <TableCell header>Thai</TableCell>
              <TableCell header>Meaning</TableCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <TableCell emphasized>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
                <TableCell>{row[2]}</TableCell>
                <TableCell emphasized>{row[3]}</TableCell>
                <TableCell>{row[4]}</TableCell>
                <TableCell>{row[5]}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
    </section>
  );
}
