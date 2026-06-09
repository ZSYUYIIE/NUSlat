import { TableCaption, TableCell, TableFrame } from "./TableParts";

const rows = [
  ["Mid", "no symbol", "dii", "good"],
  ["Low", "ˋ", "sii", "four"],
  ["Falling", "ˆ", "hâa", "five"],
  ["High", "´", "náam", "water"],
  ["Rising", "ˇ", "sɔ̌ɔŋ", "two"],
];

export default function TableF() {
  return (
    <section id="appendix-table-f" className="scroll-mt-4 space-y-3">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#72a153]">Table F</p>
        <h4 className="mt-1 text-xl font-extrabold text-[#1d3214]">Tones</h4>
      </div>
      <p>
        Standard Thai has five tones. Their names, transcription symbols, and
        examples are shown below.
      </p>

      <TableFrame>
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <TableCaption>Tones</TableCaption>
          <thead>
            <tr>
              <TableCell header>Name</TableCell>
              <TableCell header>Symbol</TableCell>
              <TableCell header>Thai</TableCell>
              <TableCell header>Meaning</TableCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <TableCell>{row[0]}</TableCell>
                <TableCell italic={row[1] === "no symbol"}>{row[1]}</TableCell>
                <TableCell emphasized>{row[2]}</TableCell>
                <TableCell>{row[3]}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
    </section>
  );
}
