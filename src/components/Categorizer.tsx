import React from "react";
import { colorFor, intersperse } from "../lib/utils";

type Abbrevs = string[];

type InputEntry = {
  abbrevs?: Abbrevs;
  cat?: string;
};

type InputJson = Record<string, InputEntry>;

type Entry = {
  symbol: string;
  abbrevs: Abbrevs;
};

const schema: string = `{ 
  $SYMBOL: {
    "abbrevs": [
      $ABBREVIATION1,
      ...
    ]
  }
}`

// maybe grab from the uploaded json? maybe provide a standard set?
const DEFAULT_CATEGORIES: string[] = ["misc"];

function parseInput(raw: string): { entries: Entry[]; assignments: Record<string, string>; cats: string[] } {
  const data = JSON.parse(raw) as InputJson;
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Expected a JSON object mapping symbols to { abbrevs }.");
  }

  const entries: Entry[] = [];
  const assignments: Record<string, string> = {};
  const seenCats = new Set<string>();

  for (const [symbol, value] of Object.entries(data)) {
    if (value === null || typeof value !== "object" || !Array.isArray(value.abbrevs)) {
      throw new Error(`Entry "${symbol}" is missing a valid "abbrevs" array.`);
    }
    entries.push({ symbol, abbrevs: value.abbrevs });
    if (typeof value.cat === "string" && value.cat.length > 0) {
      assignments[symbol] = value.cat;
      seenCats.add(value.cat);
    }
  }

  if (entries.length === 0) {
    throw new Error("The uploaded file has no entries.");
  }

  // urgh
  const cats = [...new Set([...seenCats, ...DEFAULT_CATEGORIES])];

  return { entries, assignments, cats };
}

function download(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const pillBase =
  "px-2 py-0.5 font-mono text-sm rounded border-2 cursor-pointer transition-colors";

export const Categorizer = () => {
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [index, setIndex] = React.useState(0);
  const [assignments, setAssignments] = React.useState<Record<string, string>>({});
  const [categories, setCategories] = React.useState<string[]>(DEFAULT_CATEGORIES);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setEntries(null);
    setIndex(0);
    setAssignments({});
    setCategories(DEFAULT_CATEGORIES);
    setDraft("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseInput(text);
      setEntries(parsed.entries);
      setAssignments(parsed.assignments);
      setCategories(parsed.cats);
      setIndex(0);
      setDraft("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse that file.");
      setEntries(null);
    }
  };

  const assign = (rawCat: string) => {
    if (!entries) return;
    const cat = rawCat.trim();
    if (!cat) return;
    const { symbol } = entries[index];

    setCategories((prev) => (prev.includes(cat) ? prev : [...prev, cat]));
    setAssignments((prev) => ({ ...prev, [symbol]: cat }));
    setDraft("");
    setIndex((i) => i + 1);
  };

  const skip = () => setIndex((i) => Math.min(i + 1, entries ? entries.length : 0));
  const back = () => setIndex((i) => Math.max(i - 1, 0));

  const buildOutput = (): string => {
    if (!entries) return "{}";
    const out: Record<string, { abbrevs: Abbrevs; cat: string }> = {};
    for (const { symbol, abbrevs } of entries) {
      out[symbol] = { abbrevs, cat: assignments[symbol] ?? "misc" };
    }
    return JSON.stringify(out, null, 2);
  };

  // --- render: upload screen --------------------------------------------
  if (!entries) {
    return (
      <div className="w-full flex flex-col items-center gap-3 py-6">
        <div className="w-4/5 max-w-200">
          <h1>
            <span className="font-mono">lean-symb</span> categorizer
          </h1>
          upload a <span className="font-mono">.json</span> file, built from the
          reference abbreviations file to obtain the following schema
          <pre>
            {schema}
          </pre>
          this tool allows you to define your own categories, and sort the symbols
          according to them. use it to build a new categorization proposal.

          <div className="w-full flex justify-center p-2">
            <label
              htmlFor="file"
              className="p-2 rounded-sm border border-uchu-dark-gray w-fit cursor-pointer"
            >
              Import a <code>.json</code> to start.
            </label>
            <input
              ref={inputRef}
              className="opacity-0 w-0 h-0"
              type="file"
              id="file"
              name="abbrevs"
              accept=".json,application/json"
              onChange={handleFile}
            />
            {error && <p className="text-sm text-uchu-dark-red font-mono">{error}</p>}
          </div>

          if there's enough interest, there may be a feature to upload your own file
          for use on the main view, but that's not planned for now.
        </div>
      </div>
    );
  }

  // --- render: completion screen ----------------------------------------
  const done = index >= entries.length;
  const assignedCount = entries.filter((e) => assignments[e.symbol]).length;

  if (done) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-6">
        <p className="text-sm">
          Categorized <span className="font-mono">{assignedCount}</span> /{" "}
          <span className="font-mono">{entries.length}</span> symbols.
        </p>
        <div className="flex gap-3">
          <button
            className="px-3 py-1 rounded border-2 border-uchu-dark-gray bg-uchu-dark-gray text-uchu-yang cursor-pointer text-sm"
            onClick={() => download("grouped.json", buildOutput())}
          >
            Download grouped.json
          </button>
          <button
            className="px-3 py-1 rounded border-2 border-uchu-dark-gray cursor-pointer text-sm"
            onClick={back}
          >
            Back
          </button>
          <button
            className="px-3 py-1 rounded border-2 border-uchu-dark-gray cursor-pointer text-sm"
            onClick={reset}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  // --- render: categorizing screen --------------------------------------
  const current = entries[index];
  const currentCat = assignments[current.symbol];

  return (
    <div className="w-full flex justify-center items-center gap-5 p-4">
      <div className="flex flex-row items-start gap-4 w-3/5 py-3">
        <div className="w-fit flex flex-col items-center">
          <div className="flex w-full flex-row justify-between p-2">
            <p className="text-sm font-mono text-uchu-dark-gray">
              {index + 1} / {entries.length}
            </p>
            <p>{Math.round(index / entries.length * 100)}%</p>
          </div>
          <div className="aspect-square w-[16em] flex items-center justify-center rounded bg-uchu-yin/10">
            <span className="text-9xl font-math leading-none select-none">
              {current.symbol}
            </span>
          </div>
        </div>

        <div className="h-full flex flex-col gap-3 pt-12">
          <div>
            Write it as:
            <div className="flex flex-wrap items-center">
              {
                intersperse(current.abbrevs.map((a) => (
                  <div className="font-mono py-1 px-2 m-1 rounded-sm w-fit" key={a} >
                    \{a}
                  </div>)), <span>;</span>)
              }
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const color = colorFor(cat, categories);
              const active = currentCat === cat;
              return (
                <button
                  key={cat}
                  className={pillBase}
                  style={
                    active
                      ? { backgroundColor: color, borderColor: color, color: "var(--uchu-yang)" }
                      : { borderColor: color, color }
                  }
                  onClick={() => assign(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              assign(draft);
            }}
          >
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="or new..."
              className="font-mono text-sm bg-transparent border-b-2 
                  border-uchu-gray outline-none text-uchu-yin 
                  placeholder:text-uchu-gray focus:border-uchu-dark-gray
                  transition-all duration-150 pb-0.5"
            />
            <button
              type="submit"
              className="px-2 py-0.5 rounded border-2 border-uchu-dark-gray
                  cursor-pointer text-sm font-mono"
            >
              add &amp; next
            </button>
          </form>

          <div className="flex gap-3 text-sm w-full">
            <button
              className="px-3 py-1 rounded border-2 border-uchu-dark-gray cursor-pointer disabled:opacity-30"
              onClick={back}
              disabled={index === 0}
            >
              back
            </button>
            <button
              className="px-3 py-1 rounded border-2 border-uchu-dark-gray cursor-pointer"
              onClick={skip}
            >
              skip
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};
