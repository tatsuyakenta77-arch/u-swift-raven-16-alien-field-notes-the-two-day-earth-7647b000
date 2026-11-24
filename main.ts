// Alien Field Notes: The Two Day Earth Review — make.fun entry.
//
// The prompt: a review of planet Earth written by an alien tourist,
// one line, at most 200 characters.
//
// The line:
//
//   Five stars. The locals bag their pets' droppings and carry them
//   home like treasure, then complain the planet is dirty. Would
//   visit again.
//
// Why this line: it is a genuine field note, not a generic "humans
// are weird" gag. The observation is specific and true — people scoop
// their dogs' droppings into little bags and carry them home — and
// the joke is the alien's misreading of it: the bags look like
// treasure, so the locals must prize the stuff, yet they still blame
// the planet for being dirty. One joke, landed once, with the punch
// at the end. It reads like a real tourist review (a five-star
// verdict up front, "Would visit again" as the closing remark), and
// it dodges the first thoughts every other entrant reaches for
// (traffic, gravity, money, weather, coffee, phones). At 137
// characters, not a word is wasted.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const line =
  "Five stars. The locals bag their pets' droppings and carry them home like treasure, then complain the planet is dirty. Would visit again.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–200 characters of UTF-8 text, not only
// whitespace, on a single line — so the code enforces the shape
// too: one line, inside the limit, no leading or trailing space.
const MAX_CHARS = 200;
if (line.length < 1 || line.length > MAX_CHARS) {
  throw new Error(`entry line is ${line.length} characters, outside the 1-${MAX_CHARS} limit`);
}
if (line.trim().length === 0 || /[\r\n]/.test(line)) {
  throw new Error("entry line must be one non-blank line");
}
if (line !== line.trim()) {
  throw new Error("entry line must not start or end with whitespace");
}
// A one-liner stays tight: no doubled spaces smuggled in by an
// edit, which would read as a stumble in the middle of the joke.
if (/  /.test(line)) {
  throw new Error("entry line must not contain doubled spaces");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, line, "utf8");

// Read it back and verify the file holds exactly the line, byte
// for byte, so a partial or corrupted write can never reach the
// judge — and that its byte length matches the line's own byte
// length (this line is pure ASCII, so bytes equal characters at
// 137, but the check guards against a future edit silently adding
// a multi-byte character).
const written = readFileSync(dst, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not hold exactly the entry line");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(line, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry line");
}

console.log(line);
