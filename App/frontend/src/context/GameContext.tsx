import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Player } from "../components/types";

// Intern state per match.
type GameState = {
  gameName: string;
  players: Player[];
  allowAddingPlayers: boolean;
};

// Alla matcher lagras i ett objekt med gameId som nyckel.
type GamesById = Record<string, GameState>;

// Publikt API som komponenter använder via context.
type GameContextType = {
  gamesById: GamesById;
  // Sparar ett nytt spel med namn och spelare.
  saveGame: (
    gameId: string,
    gameName: string,
    players: Player[],
    allowAddingPlayers: boolean
  ) => void;
  // Ser till att ett spel finns för route-id:t.
  ensureGame: (gameId: string) => void;
  // Uppdaterar spelnamn för ett specifikt spel.
  setGameName: (gameId: string, gameName: string) => void;
  // Lägger till en spelare i ett specifikt spel.
  addPlayer: (gameId: string, playerName: string) => void;
  // Ändrar poäng för en spelare i ett specifikt spel.
  changeScore: (gameId: string, playerId: string, delta: number) => void;
  // Nollställer ett specifikt spel till standardvärden.
  resetGame: (gameId: string) => void;
};

// Startvärde för nya matcher.
function getDefaultGame(): GameState {
  return {
    gameName: "Spel",
    players: [],
    allowAddingPlayers: true,
  };
}

const GameContext = createContext<GameContextType | null>(null);

type ApiGame = {
  id: string;
  gameName: string;
  allowAddingPlayers: boolean;
  players: Player[];
};

function toGameState(apiGame: ApiGame): GameState {
  return {
    gameName: apiGame.gameName,
    players: apiGame.players,
    allowAddingPlayers: apiGame.allowAddingPlayers,
  };
}

function toApiPayload(gameId: string, game: GameState) {
  return {
    id: gameId,
    gameName: game.gameName,
    higherIsBetter: true,
    allowAddingPlayers: game.allowAddingPlayers,
    players: game.players,
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gamesById, setGamesById] = useState<GamesById>({});

  const persistGame = useCallback(async (gameId: string, game: GameState) => {
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
  }, []);

  // Laddar alla spel från backend när appen startar.
  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      try {
        const response = await fetch("/api/games");
        if (!response.ok) return;

        const games = (await response.json()) as ApiGame[];
        if (cancelled) return;

        const nextState: GamesById = {};
        for (const game of games) {
          nextState[game.id] = toGameState(game);
        }

        setGamesById(nextState);
      } catch {
        // Ingen åtgärd behövs här, användaren kan fortfarande skapa nya spel.
      }
    }

    void loadGames();

    return () => {
      cancelled = true;
    };
  }, []);

  const saveGame = useCallback((
    gameId: string,
    gameName: string,
    players: Player[],
    allowAddingPlayers: boolean
  ) => {
    const nextGame: GameState = {
      gameName,
      players,
      allowAddingPlayers,
    };

    // Skapar eller skriver över en match med inkommande data.
    setGamesById((prev) => ({
      ...prev,
      [gameId]: nextGame,
    }));

    void (async () => {
      try {
        const createResponse = await fetch("/api/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toApiPayload(gameId, nextGame)),
        });

        if (!createResponse.ok) {
          await persistGame(gameId, nextGame);
        }
      } catch {
        // Behåll UI-state även om backend inte svarar just nu.
      }
    })();
  }, [persistGame]);

  const ensureGame = useCallback((gameId: string) => {
    // Säkerställer att matchen finns, exempelvis vid direktlänk till route.
    setGamesById((prev) => {
      if (prev[gameId]) return prev;

      return {
        ...prev,
        [gameId]: getDefaultGame(),
      };
    });

    void (async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) return;

        const game = (await response.json()) as ApiGame;
        setGamesById((prev) => ({
          ...prev,
          [gameId]: toGameState(game),
        }));
      } catch {
        // Ingen extra åtgärd. Lokal fallback finns redan i state.
      }
    })();
  }, []);

  const setGameName = useCallback((gameId: string, gameName: string) => {
    let nextGame: GameState | null = null;

    setGamesById((prev) => {
      // Uppdaterar enbart namnet och behåller övriga fält.
      const updated = {
        ...(prev[gameId] ?? getDefaultGame()),
        gameName,
      };
      nextGame = updated;

      return {
        ...prev,
        [gameId]: updated,
      };
    });

    if (nextGame) {
      void persistGame(gameId, nextGame);
    }
  }, [persistGame]);

  const addPlayer = useCallback((gameId: string, playerName: string) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    let nextGame: GameState | null = null;

    setGamesById((prev) => {
      const game = prev[gameId] ?? getDefaultGame();
      // Respekterar matchens inställning för om nya spelare får läggas till.
      if (!game.allowAddingPlayers) return prev;

      const updated = {
        ...game,
        players: [
          ...game.players,
          {
            id: crypto.randomUUID(),
            name: trimmedName,
            score: 0,
          },
        ],
      };
      nextGame = updated;

      return {
        ...prev,
        [gameId]: updated,
      };
    });

    if (nextGame) {
      void persistGame(gameId, nextGame);
    }
  }, [persistGame]);

  const changeScore = useCallback((gameId: string, playerId: string, delta: number) => {
    let nextGame: GameState | null = null;

    // Uppdaterar poäng för en enskild spelare.
    setGamesById((prev) => {
      const game = prev[gameId] ?? getDefaultGame();

      const updated = {
        ...game,
        players: game.players.map((player) =>
          player.id === playerId
            ? { ...player, score: player.score + delta }
            : player
        ),
      };
      nextGame = updated;

      return {
        ...prev,
        [gameId]: updated,
      };
    });

    if (nextGame) {
      void persistGame(gameId, nextGame);
    }
  }, [persistGame]);

  const resetGame = useCallback((gameId: string) => {
    let nextGame: GameState | null = null;

    // Nollställer matchen men bevarar om spelare får läggas till efter start.
    setGamesById((prev) => {
      const updated = {
        ...getDefaultGame(),
        allowAddingPlayers: prev[gameId]?.allowAddingPlayers ?? true,
      };
      nextGame = updated;

      return {
        ...prev,
        [gameId]: updated,
      };
    });

    if (nextGame) {
      void persistGame(gameId, nextGame);
    }
  }, [persistGame]);

  const value = useMemo(
    // Memoiserar context-värdet för att undvika onödiga re-renders.
    () => ({
      gamesById,
      saveGame,
      ensureGame,
      setGameName,
      addPlayer,
      changeScore,
      resetGame,
    }),
    [gamesById, saveGame, ensureGame, setGameName, addPlayer, changeScore, resetGame]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  // Hjälpfunktion så komponenter får ett typat context-värde.
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used inside GameProvider");
  }

  return context;
}
