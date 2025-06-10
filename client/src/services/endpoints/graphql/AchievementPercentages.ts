export type AchievementPercentagesType = {
  achievementpercentages: {
    achievements: Array<{
      name: string;
      percent: number;
    }>;
  };
};

export const AchievementPercentagesStringify = `
      achievementpercentages {
        achievements {
          name
          percent
        }
      }
  ` as const;
