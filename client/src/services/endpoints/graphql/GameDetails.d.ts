type genres_types = {
  id: string;
  description: string;
};

type release_date_types = {
  date: string;
};

type price_overview_types = {
  currency: string;
  initial: number;
  final: number;
  discount_percent?: number;
  final_formatted: string;
};

export type GameDetailsType = {
  steam_appid: string;
  name: string;
  required_age?: number;
  short_description?: string;
  supported_languages?: string;
  developers?: string[];
  publishers?: string[];
  price_overview?: price_overview_types;
  genres: genres_types[];
  release_date?: release_date_types;
  header_image?: string;
};
