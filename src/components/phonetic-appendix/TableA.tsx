import { TableCaption, TableCell, TableFrame } from "./TableParts";

const rows = [
  ["a", "father", "ɔ", "top"],
  ["e", "café", "ʉ", "(pronounced like u with a smile) sit"],
  ["i", "machine", "ɛ", "cat"],
  ["o", "home", "ə", "(pronounced like o with a smile) mallet"],
  ["u", "rude", "", ""],
];

export default function TableA() {
  return (
    <section id="appendix-table-a" className="scroll-mt-4 space-y-3">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#72a153]">Table A</p>
        <h4 className="mt-1 text-xl font-extrabold text-[#1d3214]">Simple vowels</h4>
      </div>
      <p>
        There are nine simple vowels, or monophthongs, in Standard Thai. Their
        phonetic symbols are presented below.
      </p>

      <TableFrame>
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <TableCaption>Thai simple vowels</TableCaption>
          <thead>
            <tr>
              <TableCell header>Phonetic symbol</TableCell>
              <TableCell header>As in the word</TableCell>
              <TableCell header>Phonetic symbol</TableCell>
              <TableCell header>As in the word</TableCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <TableCell emphasized>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
                <TableCell emphasized>{row[2]}</TableCell>
                <TableCell>{row[3]}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </TableFrame>

      <p>
        These vowels can occur alone, followed by the same vowel, or followed by
        another vowel. Repeating a simple vowel makes it long, as in aa. Pairing
        it with another vowel makes a diphthong, as in ia. Tables B and C show
        examples of both patterns.
      </p>
    </section>
  );
}
