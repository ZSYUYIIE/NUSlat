import { TableCaption, TableCell, TableFrame } from "./TableParts";

const rows = [
  ["ia", "bia", "beer"],
  ["ʉa", "rʉa", "boat"],
  ["ua", "phǔa", "husband"],
];

export default function TableC() {
  return (
    <section id="appendix-table-c" className="scroll-mt-4 space-y-3">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#72a153]">Table C</p>
        <h4 className="mt-1 text-xl font-extrabold text-[#1d3214]">Diphthongs</h4>
      </div>

      <TableFrame>
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <TableCaption>Diphthongs</TableCaption>
          <thead>
            <tr>
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
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>
    </section>
  );
}
