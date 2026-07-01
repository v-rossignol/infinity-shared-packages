export interface Player {
  id: string;
  username: string;
  level: number;
  xp: number;
  guild?: string;
  position: {
    systemId: string;
    planetId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlayerSummary {
  id: string;
  username: string;
  level: number;
}
