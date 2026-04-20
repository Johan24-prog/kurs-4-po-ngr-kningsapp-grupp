import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

const STORAGE_KEY = "gamesById";

// Startvärde för nya matcher.
function getDefaultGame(): GameState {
  return {
    gameName: "Spel",
    players: [],
    allowAddingPlayers: true,
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

  const saveGame = (
    gameId: string,
    gameName: string,
    players: Player[],
    allowAddingPlayers: boolean
  ) => {
    // Skapar eller skriver över en match med inkommande data.
    setGamesById((prev) => ({
      ...prev,
      [gameId]: {
        gameName,
        players,
        allowAddingPlayers,
      },
    }));
  };

  const ensureGame = (gameId: string) => {
    // Säkerställer att matchen finns, exempelvis vid direktlänk till route.
    setGamesById((prev) => {
      if (prev[gameId]) return prev;

      return {
        ...prev,
        [gameId]: getDefaultGame(),
      };
    });
  };

  const setGameName = (gameId: string, gameName: string) => {
    // Uppdaterar enbart namnet och behåller övriga fält.
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
      // Respekterar matchens inställning för om nya spelare får läggas till.
      if (!game.allowAddingPlayers) return prev;

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
    // Uppdaterar poäng för en enskild spelare.
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
    // Nollställer matchen men bevarar om spelare får läggas till efter start.
    setGamesById((prev) => ({
      ...prev,
      [gameId]: {
        ...getDefaultGame(),
        allowAddingPlayers: prev[gameId]?.allowAddingPlayers ?? true,
      },
    }));
  };

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
    [gamesById]
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
