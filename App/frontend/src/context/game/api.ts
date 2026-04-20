import { toApiPayload, toGameState, type ApiGame, type GameState, type GamesById } from "./types";

// Sparar hela spelstate till backend med PUT.
export async function persistGame(gameId: string, game: GameState) {
  try {
    await fetch(`/api/games/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toApiPayload(gameId, game)),
    });
  } catch {
    // Appen fungerar lokalt i UI även om nätverket tillfälligt misslyckas.
  }
}

// Hämtar alla spel och normaliserar till GamesById.
export async function loadAllGames(): Promise<GamesById | null> {
  try {
    const response = await fetch("/api/games");
    if (!response.ok) return null;

    const games = (await response.json()) as ApiGame[];
    const nextState: GamesById = {};
    for (const game of games) {
      nextState[game.id] = toGameState(game);
    }

    return nextState;
  } catch {
    return null;
  }
}

// Hämtar ett specifikt spel från backend.
export async function loadGameById(gameId: string): Promise<GameState | null> {
  try {
    const response = await fetch(`/api/games/${gameId}`);
    if (!response.ok) return null;

    const game = (await response.json()) as ApiGame;
    return toGameState(game);
  } catch {
    return null;
  }
}

// Försöker skapa spel, fallback till uppdatering om det redan finns.
export async function createOrUpdateGame(gameId: string, game: GameState) {
  try {
    const createResponse = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toApiPayload(gameId, game)),
    });

    if (!createResponse.ok) {
      await persistGame(gameId, game);
    }
  } catch {
    // Behåll UI-state även om backend inte svarar just nu.
  }
}
