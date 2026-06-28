const PALETTE = [
  "var(--uchu-dark-red)",
  "var(--uchu-dark-blue)",
  "var(--uchu-dark-green)",
  "var(--uchu-dark-yellow)",
  "var(--uchu-dark-purple)",
  "var(--uchu-dark-pink)",
  "var(--uchu-dark-orange)",
  "var(--uchu-purple)",
  "var(--uchu-blue)",
  "var(--uchu-red)",
];

export function colorFor(cat: string, categories: string[]): string {
  if (cat === "misc") return "var(--uchu-dark-gray)";
  const i = categories.indexOf(cat);
  const idx = i === -1 ? categories.length : i;
  return PALETTE[idx % PALETTE.length];
}

export function intersperse<t>(arr: t[], sep: t): t[] {
  return arr.flatMap((v, idx, arr) => (idx < arr.length - 1) ? [v, sep] : [v])
}