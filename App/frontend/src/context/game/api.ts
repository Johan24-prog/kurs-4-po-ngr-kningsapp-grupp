import { toApiPayload, toGameState, type ApiGame, type GameState, type GamesById } from "./types";

const gameWriteQueues = new Map<string, Promise<void>>();

function enqueueGameWrite(gameId: string, write: () => Promise<void>) {
  const previous = gameWriteQueues.get(gameId) ?? Promise.resolve();

  const next = previous
    .catch(() => {
      // Keep queue alive even if a previous request failed.
    })
    .then(write);

  gameWriteQueues.set(
    gameId,
    next.finally(() => {
      if (gameWriteQueues.get(gameId) === next) {
        gameWriteQueues.delete(gameId);
      }
    })
  );

  return next;
}

// Sparar hela spelstate till backend med PUT.
export async function persistGame(gameId: string, game: GameState) {
  try {
    await enqueueGameWrite(gameId, async () => {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toApiPayload(gameId, game)),
      });

      if (!response.ok) {
        throw new Error(`Failed to persist game ${gameId}: ${response.status}`);
      }
    });
  } catch (error) {
    // Appen fungerar lokalt i UI även om nätverket tillfälligt misslyckas.
    console.error("Could not persist game", error);
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
    await enqueueGameWrite(gameId, async () => {
      const createResponse = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toApiPayload(gameId, game)),
      });

      if (!createResponse.ok) {
        const updateResponse = await fetch(`/api/games/${gameId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toApiPayload(gameId, game)),
        });

        if (!updateResponse.ok) {
          throw new Error(`Failed to create or update game ${gameId}: ${updateResponse.status}`);
        }
      }
    });
  } catch (error) {
    // Behåll UI-state även om backend inte svarar just nu.
    console.error("Could not create or update game", error);
  }
}
