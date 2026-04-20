import type { Player } from "../../components/types";

// Intern representation av ett spel i frontend-state.
export type GameState = {
  gameName: string;
  players: Player[];
  allowAddingPlayers: boolean;
};

// Dictionary med gameId som nyckel.
export type GamesById = Record<string, GameState>;

// Offentligt API som exponeras via React context.
export type GameContextType = {
  gamesById: GamesById;
  saveGame: (
    gameId: string,
    gameName: string,
    players: Player[],
    allowAddingPlayers: boolean
  ) => void;
  ensureGame: (gameId: string) => void;
  setGameName: (gameId: string, gameName: string) => void;
  addPlayer: (gameId: string, playerName: string) => void;
  removePlayer: (gameId: string, playerId: string) => void;
  changeScore: (gameId: string, playerId: string, delta: number) => void;
};

// Struktur på data som kommer tillbaka från backend.
export type ApiGame = {
  id: string;
  gameName: string;
  allowAddingPlayers: boolean;
  players: Player[];
};

// Standardvärden för ett nyskapat spel.
export function getDefaultGame(): GameState {
  return {
    gameName: "Spel",
    players: [],
    allowAddingPlayers: true,
  };
}

// Mapper backendmodell -> frontendmodell.
export function toGameState(apiGame: ApiGame): GameState {
  return {
    gameName: apiGame.gameName,
    players: apiGame.players,
    allowAddingPlayers: apiGame.allowAddingPlayers,
  };
}

// Mapper frontendmodell -> payload till API.
export function toApiPayload(gameId: string, game: GameState) {
  return {
    id: gameId,
    gameName: game.gameName,
    higherIsBetter: true,
    allowAddingPlayers: game.allowAddingPlayers,
    players: game.players,
  };
}
