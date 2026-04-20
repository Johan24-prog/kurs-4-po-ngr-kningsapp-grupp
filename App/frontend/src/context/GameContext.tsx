import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadAllGames } from "./game/api";
import { useGameActions } from "./game/useGameActions";
import type { GameContextType, GamesById } from "./game/types";

// Endast context-instans och provider wiring ligger i denna fil.
const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gamesById, setGamesById] = useState<GamesById>({});

  // Action-logiken är uppdelad i separat hook för bättre läsbarhet.
  const actions = useGameActions({ setGamesById });

  // Laddar alla spel från backend när appen startar.
  useEffect(() => {
    let cancelled = false;

    async function loadGames() {
      const games = await loadAllGames();
      if (!games || cancelled) return;

      setGamesById(games);
    }

    void loadGames();

    return () => {
      cancelled = true;
    };
  }, []);

  // Exponerar state + actions via ett stabilt context-värde.
  const value = useMemo(
    () => ({
      gamesById,
      ...actions,
    }),
    [gamesById, actions]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Typad helper-hook för alla komponenter som konsumerar GameContext.
export function useGameContext() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used inside GameProvider");
  }

  return context;
}
