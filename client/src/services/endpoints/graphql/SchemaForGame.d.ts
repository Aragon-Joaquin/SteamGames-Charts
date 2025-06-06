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

export type SchemaForGame = {
  game: Array<{
    gameName: string;
    gameVersion: string;
    availableGameStats: GameStats;
  }>;
};
