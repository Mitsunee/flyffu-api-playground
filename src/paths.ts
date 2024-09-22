export const API_URL = "https://api.flyff.com";

export const API = {
  monstersList: `${API_URL}/monster`,
  monster: (id: number) => `${API_URL}/monster/${id}`,
  skill: (id: number) => `${API_URL}/skill/${id}`
} as const;

export const DATA_DIR = "data";

export const PATHS = {
  monsters: `${DATA_DIR}/monster`,
  monster: (id: number) => `${DATA_DIR}/monster/${id}.json`,
  monsterList: `${DATA_DIR}/monsters.json`,
  monsterSkills: `${DATA_DIR}/monster/skill`,
  monsterSkill: (id: number) => `${DATA_DIR}/monster/skill/${id}.json`
} as const;
