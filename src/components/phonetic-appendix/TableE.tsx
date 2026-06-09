import { TableCaption, TableCell, TableFrame } from "./TableParts";

const rows = [
  ["h", "hěn", "see", "h", "?", "ʔìt", "brick", "it"],
  ["ph", "phìt", "wrong", "p", "p", "pɛ̀ɛt", "eight", "p-b"],
  ["th", "thii", "time", "t", "t", "tûu", "cupboard", "t-d"],
  ["ch", "chìit", "inject", "ch", "c", "cèt", "seven", "j-ch"],
  ["kh", "khít", "think", "k", "k", "kàt", "bite", "g-k"],
  ["b", "bɔ̀y", "often", "b", "f", "fan", "teeth", "f"],
  ["d", "duu", "look at", "d", "s", "sii", "four", "s"],
  ["m", "mii", "have", "m", "y", "yùu", "be at", "y"],
  ["n", "nâw", "rotten", "n", "w", "wǐi", "comb", "w"],
  ["ŋ", "ŋuu", "snake", "sing", "l", "lɛ̂ɛk", "exchange", "l"],
  ["", "", "", "", "r", "rɛ̂ɛk", "first", "r"],
];

export default function TableE() {
  return (
    <section id="appendix-table-e" className="scroll-mt-4 space-y-3">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#72a153]">Table E</p>
        <h4 className="mt-1 text-xl font-extrabold text-[#1d3214]">Consonants</h4>
      </div>
      <p>
        Standard Thai has 21 consonants. The table pairs each one with a Thai
        example and its closest English equivalent. When two English sounds are
        shown, the Thai sound falls between them. The symbol ? represents a
        closing of the throat, like the middle of the English “uh-uh.”
      </p>

      <TableFrame>
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <TableCaption>Consonants</TableCaption>
          <thead>
            <tr>
              <TableCell header>Consonant</TableCell>
              <TableCell header>Thai</TableCell>
              <TableCell header>Meaning</TableCell>
              <TableCell header>English</TableCell>
              <TableCell header>Consonant</TableCell>
              <TableCell header>Thai</TableCell>
              <TableCell header>Meaning</TableCell>
              <TableCell header>English</TableCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={`${cell}-${cellIndex}`}
                    emphasized={cellIndex === 0 || cellIndex === 4}
                  >
                    {cell}
                  </TableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
    </section>
  );
}
