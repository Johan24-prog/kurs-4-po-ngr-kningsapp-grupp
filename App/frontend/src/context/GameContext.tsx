import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Player } from "../components/types";

type GameState = {
  gameName: string;
  players: Player[];
};

type GamesById = Record<string, GameState>;

type GameContextType = {
  gamesById: GamesById;
  // Sparar ett nytt spel med namn och spelare.
  saveGame: (gameId: string, gameName: string, players: Player[]) => void;
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

const STORAGE_KEY = "gamesById";

function getDefaultGame(): GameState {
  return {
    gameName: "Spel",
    players: [],
  };
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gamesById, setGamesById] = useState<GamesById>({});

  // Läser tidigare sparad state från localStorage vid första renderingen.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as GamesById;
      setGamesById(parsed);
    } catch {
      setGamesById({});
    }
  }, []);

  // Skriver alltid senaste state till localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gamesById));
  }, [gamesById]);

  const saveGame = (gameId: string, gameName: string, players: Player[]) => {
    setGamesById((prev) => ({
      ...prev,
      [gameId]: {
        gameName,
        players,
      },
    }));
  };

  const ensureGame = (gameId: string) => {
    setGamesById((prev) => {
      if (prev[gameId]) return prev;

      return {
        ...prev,
        [gameId]: getDefaultGame(),
      };
    });
  };

  const setGameName = (gameId: string, gameName: string) => {
    setGamesById((prev) => ({
      ...prev,
      [gameId]: {
        ...(prev[gameId] ?? getDefaultGame()),
        gameName,
      },
    }));
  };

  const addPlayer = (gameId: string, playerName: string) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    setGamesById((prev) => {
      const game = prev[gameId] ?? getDefaultGame();

      return {
        ...prev,
        [gameId]: {
          ...game,
          players: [
            ...game.players,
            {
              id: crypto.randomUUID(),
              name: trimmedName,
              score: 0,
            },
          ],
        },
      };
    });
  };

  const changeScore = (gameId: string, playerId: string, delta: number) => {
    setGamesById((prev) => {
      const game = prev[gameId] ?? getDefaultGame();

      return {
        ...prev,
        [gameId]: {
          ...game,
          players: game.players.map((player) =>
            player.id === playerId
              ? { ...player, score: player.score + delta }
              : player
          ),
        },
      };
    });
  };

  const resetGame = (gameId: string) => {
    setGamesById((prev) => ({
      ...prev,
      [gameId]: getDefaultGame(),
    }));
  };

  const value = useMemo(
    () => ({
      gamesById,
      saveGame,
      ensureGame,
      setGameName,
      addPlayer,
      changeScore,
      resetGame,
    }),
    [gamesById]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used inside GameProvider");
  }

  return context;
}
