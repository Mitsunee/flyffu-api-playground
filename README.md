# flyffu-api-playground

This repository is my personal playground for doing stuff with the [Flyff Universe API](https://api.flyff.com) provided by the game's publisher.

<center><img src="./.github/banner.jpeg" width="640" height="320" alt="Flyff Universe"></center>

## Usage

This repository is intended to be used with Node.js v18 and pnpm 9.x

```
pnpm install
pnpm prepare-cache
```

## Scripts

### Monster Search

```
pnpm tsx src/search-monster.ts
```

This script can be used to find Monsters by name. The script has flags to display or hide the id, level and rank in the result. see `--help` for more information.

## Cache

Instead of constantly redownloading the same data the `pnpm prepare-cache` script downloads all needed data at once and stores it in `./data`:

```
data
├── monsters.json (list of all monster IDs)
└── monster
   ├── {id}.json (individual monster data)
   └── skill
      └── {id}.json (individual skill data)
```
