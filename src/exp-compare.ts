// yes I know I already started a calculator, but that one's too generic for my usecase right now lol

import { getMonsterData } from "./utils/get-monster-data";
import { getMonsterList } from "./utils/get-monster-list";
import { searchMonsterByName } from "./utils/search-monster";
import { getMonsterExp } from "./utils/get-monster-exp";
import { getMonsterWarnings } from "./utils/get-monster-warnings";

interface CalcResult {
  data: MonsterData;
  exp: ReturnType<typeof getMonsterExp>;
  lang: "en" | "de";
}

const [, , ...args] = process.argv;

async function getMonsterListFiltered() {
  const list = await getMonsterList();
  const filtered: typeof list = [];

  for (const id of list) {
    const data = await getMonsterData(id);
    if (data.area != "normal") continue; // only overworld monsters
    if (data.flying || data.event) continue; // no flying or event monsters
    // Monster must be small, normal or captain rank
    if (
      !(data.rank == "small" || data.rank == "normal" || data.rank == "captain")
    ) {
      continue;
    }
    const nameNormalized = data.name.en.toLowerCase();
    if (nameNormalized.startsWith("criminal")) continue; // no kebaras
    if (nameNormalized.includes("berry carrier")) continue; // no berry carriers
    if (nameNormalized.endsWith("catcher")) continue; // no ore catchers
    filtered.push(id);
  }

  return filtered;
}

function parseLevelRangeArg(input: string) {
  if (!/^(\d\d?|1[0-5]\d|160)-(\d\d?|1[0-5]\d|160)$/.test(input)) {
    throw new Error(
      "First argument must be level range separated by a - (dash)"
    );
  }

  const match = input.match(/(?<start>\d+)-(?<end>\d+)/);
  const start = Number(match?.groups?.start);
  const end = Number(match?.groups?.end);

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Unexpected Error while parsing level range");
  }

  return [start, end] as const;
}

// prettier-ignore
const HELP = 
`Exp compare

Usage: exp-compare.ts [-h] [--sort] range mobs [mobs ...]

Arguments:
  -h, --help          Print this help instead of running the script
  --sort              Whether to sort result by efficiency
  range               Must be a level range separated by a - (dash) like this: 98-105
  mobs                List of Monster names to test each level against (can be full name or partial)`;

async function main() {
  const queries = [...args];
  let isSorted = false;
  let rangeArg = queries.shift();
  if (rangeArg == "--sort") {
    isSorted = true;
    rangeArg = queries.shift();
  }
  if (!rangeArg || rangeArg == "-h" || rangeArg == "--help") {
    console.log(HELP);
    process.exit(0);
  }
  const [start, end] = parseLevelRangeArg(rangeArg);
  const list = await getMonsterListFiltered();

  if (queries.length < 1) {
    throw new Error("Must give at least one search query");
  }

  const monsters: Awaited<ReturnType<typeof searchMonsterByName>> = [];
  for (const query of queries) {
    const results = await searchMonsterByName(list, query);
    results.forEach(res => monsters.push(res));
  }

  if (monsters.length < 1) {
    throw new Error(
      `Could not find any monsters for queries: ${queries.join(", ")}`
    );
  }

  const warningsMap = new Map<MonsterData, string[]>();
  for (const monster of monsters) {
    const warnings = await getMonsterWarnings(monster.data);
    warningsMap.set(monster.data, warnings);
  }

  for (let lv = start; lv <= end; lv++) {
    console.log(`For level ${lv}`);
    const results: CalcResult[] = monsters.map(monster => ({
      exp: getMonsterExp(lv, monster.data),
      data: monster.data,
      lang: monster.lang
    }));

    if (isSorted) results.sort((a, b) => b.exp.expPerHp - a.exp.expPerHp);
    const bestVal = Math.max(...results.map(res => res.exp.expPerHp));
    const table = Object.fromEntries(
      results.map(result => {
        const efficiency = +Number(
          100 * (result.exp.expPerHp / bestVal)
        ).toPrecision(4);
        const warnings = warningsMap.get(result.data);

        return [
          result.data.name[result.lang],
          { ...result.exp, efficiency, warnings }
        ] as const;
      })
    );

    console.table(table);
    console.log(""); // force newline
  }
}

main()
  .then(() => console.log("Completed"))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
