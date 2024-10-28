interface WorldLocation {
  world: number;
  x: number;
  y: number;
  z: number;
  continent?: number;
}

interface WorldContinent {
  id: number;
  name: LocalizedName;
  town: boolean;
  //polygon
}

interface WorldData {
  id: number;
  name: LocalizedName;
  type: "main" | "prison" | "dungeon" | "instance" | "event";
  //places
  //lodestars
  continents: Array<WorldContinent>;
}
