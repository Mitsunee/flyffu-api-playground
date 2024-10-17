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

Instead of constantly redownloading the same data the `pnpm prepare-cache` script downloads all needed data at once and stores it in `./data`:

```
data
├── monsters.json (list of all monster IDs)
├── quests.json (list of all quest IDs)
├── monster
|  ├── {id}.json (individual monster data)
|  └── skill
|     └── {id}.json (individual skill data)
└── quests
   └── {id}.json (individual quest data)
```
