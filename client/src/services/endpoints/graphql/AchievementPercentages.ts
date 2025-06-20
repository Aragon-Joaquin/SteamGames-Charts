export type AchievementPercentagesType = {
  achievements: Array<{
    name: string;
    percent: number;
  }>;
};

export const AchievementPercentagesStringified = `
        achievements {
          name
          percent
        }

  ` as const;
