export const API_URL = "https://api.flyff.com";

export const API = {
  monstersList: `${API_URL}/monster`,
  monster: (id: number) => `${API_URL}/monster/${id}`,
  skill: (id: number) => `${API_URL}/skill/${id}`,
  questsList: `${API_URL}/quest`,
  quest: (id: number) => `${API_URL}/quest/${id}`,
  item: (id: number) => `${API_URL}/item/${id}`,
  npc: (id: number) => `${API_URL}/npc/${id}`,
  world: (id: number) => `${API_URL}/world/${id}`
} as const;

export const DATA_DIR = "data";

export const PATHS = {
  monsters: `${DATA_DIR}/monster`,
  monster: (id: number) => `${DATA_DIR}/monster/${id}.json`,
  monsterList: `${DATA_DIR}/monsters.json`,
  monsterLists: {
    overworld: `${DATA_DIR}/monsters/overworld.json`,
    overworldNonGiant: `${DATA_DIR}/monsters/overworld-non-giant.json`,
    overworldGiant: `${DATA_DIR}/monsters/overworld-giant.json`
  } as const,
  monsterSkills: `${DATA_DIR}/monster/skill`,
  monsterSkill: (id: number) => `${DATA_DIR}/monster/skill/${id}.json`,
  quests: `${DATA_DIR}/quest`,
  quest: (id: number) => `${DATA_DIR}/quest/${id}.json`,
  questList: `${DATA_DIR}/quests.json`,
  item: (id: number) => `${DATA_DIR}/item/${id}.json`,
  npc: (id: number) => `${DATA_DIR}/npc/${id}.json`,
  mainWorld: `${DATA_DIR}/world.json`
} as const;
