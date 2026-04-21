import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createOrUpdateGame, loadGameById, persistGame } from "./api";
import { getDefaultGame, type GameState, type GamesById } from "./types";
import type { Player } from "../../components/types";

type Props = {
  setGamesById: Dispatch<SetStateAction<GamesById>>;
};

// Samlar alla state-ändringar för spel till ett ställe.
export function useGameActions({ setGamesById }: Props) {
  // Skapar eller skriver över ett spel och synkar mot backend.
  const saveGame = useCallback((
    gameId: string,
    gameName: string,
    players: Player[],
    higherIsBetter: boolean,
    allowAddingPlayers: boolean
  ) => {
    const nextGame: GameState = {
      gameName,
      players,
      higherIsBetter,
      allowAddingPlayers,
    };

    setGamesById((prev) => ({
      ...prev,
      [gameId]: nextGame,
    }));

    void createOrUpdateGame(gameId, nextGame);
  }, [setGamesById]);

  // Ser till att spel finns i state och försöker sedan ladda serverversionen.
  const ensureGame = useCallback((gameId: string) => {
    let shouldLoadFromServer = false;

    setGamesById((prev) => {
      if (prev[gameId]) return prev;

      shouldLoadFromServer = true;

      return {
        ...prev,
        [gameId]: getDefaultGame(),
      };
    });

    if (!shouldLoadFromServer) {
      return;
    }

    void (async () => {
      const game = await loadGameById(gameId);
      if (!game) return;

      setGamesById((prev) => ({
        ...prev,
        [gameId]: game,
      }));
    })();
  }, [setGamesById]);

  // Uppdaterar endast spelnamn.
  const setGameName = useCallback((gameId: string, gameName: string) => {
    let nextGame: GameState | null = null;

    setGamesById((prev) => {
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
  }, [setGamesById]);

  // Lägger till spelare om spelet tillåter det.
  const addPlayer = useCallback((gameId: string, playerName: string) => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    let nextGame: GameState | null = null;

    setGamesById((prev) => {
      const game = prev[gameId] ?? getDefaultGame();
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
  }, [setGamesById]);

  // Tar bort en spelare från aktuell match.
  const removePlayer = useCallback((gameId: string, playerId: string) => {
    let nextGame: GameState | null = null;

    setGamesById((prev) => {
      const game = prev[gameId] ?? getDefaultGame();
      const updated = {
        ...game,
        players: game.players.filter((player) => player.id !== playerId),
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
  }, [setGamesById]);

  // Justerar poäng för en spelare.
  const changeScore = useCallback((gameId: string, playerId: string, delta: number) => {
    let nextGame: GameState | null = null;

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
  }, [setGamesById]);

  // Returneras memoiserat för att undvika onödiga rerenders i consumers.
  return useMemo(
    () => ({
      saveGame,
      ensureGame,
      setGameName,
      addPlayer,
      removePlayer,
      changeScore,
    }),
    [saveGame, ensureGame, setGameName, addPlayer, removePlayer, changeScore]
  );
}
