// Gemensam datamodell för en spelare i appen.
export type Player = {
  id: string;
  name: string;
  score: number;
  initialScore?: number;
};