export const API_URL = "https://api.flyff.com";

export const API = {
  monstersList: `${API_URL}/monster`,
  monster: (id: number) => `${API_URL}/monster/${id}`,
  skill: (id: number) => `${API_URL}/skill/${id}`
} as const;

export const DATA_DIR = "data";

export const PATHS = {
  monsters: `${DATA_DIR}/monsters`,
  monster: (id: number) => `${DATA_DIR}/monsters/${id}.json`,
  monsterSkills: `${DATA_DIR}/monsters/skills`,
  monsterSkill: (id: number) => `${DATA_DIR}/monsters/skills/${id}.json`
} as const;
