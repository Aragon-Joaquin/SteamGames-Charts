type GameStats = {
  achievements: Array<{
    name: string;
    defaultvalue: number;
    displayName: string;
    hidden: number;
    description?: string;
    icon: string;
    icongray: string;
  }>;
};

export type SchemaForGameType = {
  gameName: string;
  gameVersion: string;
  availableGameStats: GameStats;
  achievements: GameStats;
};

export const SchemaForGameStringified = `
    gameName
    gameVersion
    availableGameStats
    achievements
` as const;
