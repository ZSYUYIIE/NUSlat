import { TableCaption, TableCell, TableFrame } from "./TableParts";

const rows = [
  ["i", "sìp", "ten", "ii", "thii", "time"],
  ["e", "phèt", "hot, spicy", "ee", "lêek", "number 3"],
  ["ɛ", "mɛ̀m", "Ma'am", "ɛɛ", "khěen", "arm"],
  ["ʉ", "nʉ̀ŋ", "one", "ʉʉ", "mʉʉ", "hand"],
  ["ə", "ŋən", "money", "əə", "sə̂ə", "stupid"],
  ["a", "fan", "teeth", "aa", "paa", "throw"],
  ["u", "lúk", "rise", "uu", "hǔu", "ear"],
  ["o", "khon", "person", "oo", "soo", "starve"],
  ["ɔ", "lɔ̀n", "she", "ɔɔ", "phɔ̂ɔ", "father"],
];

export default function TableB() {
  return (
    <section id="appendix-table-b" className="scroll-mt-4 space-y-3">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#72a153]">Table B</p>
        <h4 className="mt-1 text-xl font-extrabold text-[#1d3214]">Short and long vowels</h4>
      </div>

      <TableFrame>
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <TableCaption>Short and long vowels</TableCaption>
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
