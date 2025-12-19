export type Player = {
  id: string;
  number: string;
  name: string;
  tags?: string[];
};

export type Team = {
  id: string;
  name: string;
  roster: Player[];
};

export type PositionKey = 1 | 2 | 3 | 4 | 5 | 6;

export type CourtState = Record<PositionKey, string | null>;

export type MatchState = {
  teamId: string;
  usScore: number;
  oppScore: number;
  positions: CourtState;
  bench: string[];
  updatedAt: number;
  history?: MatchEvent[];
};

export type MatchEvent = {
  type: 'score' | 'sub' | 'rotate';
  timestamp: number;
  details?: Record<string, unknown>;
};
