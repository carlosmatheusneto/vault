import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const TIMEZONE = "America/Sao_Paulo";
const DAYS = 30;
const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "activity.json");

function localDateString(date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(date);
}

function lastNDays(n) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    days.push(localDateString(d));
  }
  return days;
}

function resolveRenamedPath(path) {
  // git numstat shows renames as "prefix{old => new}suffix" (common prefix/suffix)
  // or as a bare "old => new" (no common parts). We only care about the
  // resulting (new) path, since that's where the content lives now.
  const braceMatch = path.match(/^(.*)\{.* => (.*)\}(.*)$/);
  if (braceMatch) {
    const [, prefix, newMid, suffix] = braceMatch;
    return prefix + newMid + suffix;
  }
  const arrowMatch = path.match(/^.* => (.*)$/);
  if (arrowMatch) return arrowMatch[1];
  return path;
}

function parseGitLog(raw) {
  // Sums additions+deletions per (date, top-level folder) from `git log --numstat`
  // output produced with `--pretty=format:'COMMIT|<hash>|<date>'`.
  const totals = new Map(); // date -> Map<folder, number>
  let currentDate = null;

  for (const line of raw.split("\n")) {
    if (line.startsWith("COMMIT|")) {
      const [, , date] = line.split("|");
      currentDate = date;
      continue;
    }
    if (!line.trim() || !currentDate) continue;

    const parts = line.split("\t");
    if (parts.length !== 3) continue;
    const [addedRaw, deletedRaw, rawPath] = parts;
    const path = resolveRenamedPath(rawPath);
    const slash = path.indexOf("/");
    if (slash === -1) continue; // root-level file, not a vault topic folder

    // Normalize so a folder rename (e.g. "system designs" -> "system-designs")
    // doesn't split one topic's history across two chart categories.
    const folder = path.slice(0, slash).trim().toLowerCase().replace(/\s+/g, "-");
    const added = addedRaw === "-" ? 0 : Number(addedRaw);
    const deleted = deletedRaw === "-" ? 0 : Number(deletedRaw);
    const changed = added + deleted;
    if (!Number.isFinite(changed) || changed === 0) continue;

    if (!totals.has(currentDate)) totals.set(currentDate, new Map());
    const byFolder = totals.get(currentDate);
    byFolder.set(folder, (byFolder.get(folder) ?? 0) + changed);
  }

  return totals;
}

function main() {
  const raw = execFileSync(
    "git",
    [
      "log",
      "--since=31 days ago",
      "--numstat",
      "--pretty=format:COMMIT|%H|%ad",
      "--date=format-local:%Y-%m-%d",
    ],
    { encoding: "utf8", env: { ...process.env, TZ: TIMEZONE } }
  );

  const totals = parseGitLog(raw);
  const days = lastNDays(DAYS).map((date) => {
    const byFolder = totals.get(date);
    const folders = byFolder ? Object.fromEntries(byFolder) : {};
    return { date, folders };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    days,
  };

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n");
  console.log(`Wrote ${OUT_PATH}`);
}

main();
