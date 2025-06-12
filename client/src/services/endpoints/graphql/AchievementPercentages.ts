export type AchievementPercentagesType = {
  achievements: Array<{
    name: string;
    percent: number;
  }>;
};

export const AchievementPercentagesStringify = `
        achievements {
          name
          percent
        }

  ` as const;
