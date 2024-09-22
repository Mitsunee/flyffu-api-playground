# flyffu-api-playground

This repository is my personal playground for doing stuff with the [Flyff Universe API](https://api.flyff.com) provided by the game's publisher.

## Usage

This repository is intended to be used with Node.js v18 and pnpm 9.x

```
pnpm install
pnpm prepare-cache
```

## Scripts

None available yet :)

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
