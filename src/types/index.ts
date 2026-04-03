export interface Competition {
  id: number;
  name: string;
  code: string;
  area: {
    name: string;
  };
}

export interface Team {
  id: number;
  name: string;
  crestUrl?: string;
  tla?: string;
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: {
    fullTime: { homeTeam: number | null; awayTeam: number | null };
    extraTime: { homeTeam: number | null; awayTeam: number | null };
    penalties: { homeTeam: number | null; awayTeam: number | null };
  };
}