# flyffu-api-playground

This repository is my personal playground for doing stuff with the [Flyff Universe API](https://api.flyff.com) provided by the game's publisher.

<p align="center"><img src="./.github/banner.jpeg" width="640" height="320" alt="Flyff Universe"></p>

## Usage

This repository is intended to be used with Node.js v18 and pnpm 9.x

```
pnpm install
pnpm prepare-cache
```

## Scripts

All scripts have their own built-in help text accessible with `-h` or `--help`

### Monster Search

```
pnpm search-monster
```

This script can be used to find Monsters by name. The script has flags to display or hide the id, level and rank in the result. see `--help` for more information.

### EXP Compare

```
pnpm exp-compare
```

Compare the exp efficiency of a specified selection of monster for a given level range. Monsters are searched for with the same search method as Monster Search, but limited to Small, Normal and Captain overworld monsters.

### EXP Calculator (WIP)

```
pnpm exp-calc
```

This script can be configured with a level range and filter function to determine the mobs for exp comparisons (similar to Exp Compare)

### Tower Quests

```
pnpm tsx src/tower-quests.ts
```

Simple script that finds all Forsaken Tower quests, organizes them by floor and outputs a list with how much exp is earned at each possible level for those floors, as well as how much penya is earned and how many quests are available.

## Cache

Instead of constantly redownloading the same data the `pnpm prepare-cache` script downloads all needed data for monsters and quests at once and stores it in `./data`. Other data such as NPCs and Items are downloaded once on demand and also stored:

```
data
├── monsters.json (list of all monster IDs)
├── quests.json (list of all quest IDs)
├── item
|  └── {id}.json (individual item data)
├── monster
|  ├── {id}.json (individual monster data)
|  └── skill
|     └── {id}.json (individual skill data)
├── monsters
|  └── {slug}.json (pre-filtered monster lists)
├── npc
|  └── {id}.json (individual NPC data)
└── quests
   └── {id}.json (individual quest data)
```

## Monster Lists

Due to the variety of monster types that may or may not be wanted in specific queries pre-filtered monster lists are created by `prepare-cache` (see above) and available with the `getMonsterList` util:

|          Name           | Description                                          |
| :---------------------: | :--------------------------------------------------- |
|      `"overworld"`      | All non-flying non-event overworld monsters          |
| `"overworld-non-giant"` | Same as `"overworld"` but without Giants and Violets |
|   `"overworld-giant"`   | Inverse of `"overworld-non-giant"`                   |
