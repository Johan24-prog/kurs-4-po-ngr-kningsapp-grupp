import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createOrUpdateGame, deleteGameById, loadGameById, persistGame } from "./api";
import { getDefaultGame, type GameState, type GamesById } from "./types";
import type { Player } from "../../components/types";

type Props = {
  setGamesById: Dispatch<SetStateAction<GamesById>>;
};

// Samlar alla state-ändringar för spel till ett ställe.
export function useGameActions({ setGamesById }: Props) {
  // Laddar spel från backend och skriver in i state om det finns.
  const loadGame = useCallback(async (gameId: string) => {
    const game = await loadGameById(gameId);
    if (!game) return false;

    setGamesById((prev) => ({
      ...prev,
      [gameId]: game,
    }));

    return true;
  }, [setGamesById]);

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

  // Skriver över ett spel med nytt state och sparar till backend.
  const overwriteGame = useCallback((gameId: string, game: GameState) => {
    setGamesById((prev) => ({
      ...prev,
      [gameId]: game,
    }));

    void persistGame(gameId, game);
  }, [setGamesById]);

  // Tar bort ett spel i både lokalt state och backend.
  const deleteGame = useCallback(async (gameId: string) => {
    setGamesById((prev) => {
      if (!prev[gameId]) return prev;

      const { [gameId]: _removed, ...rest } = prev;
      return rest;
    });

    return deleteGameById(gameId);
  }, [setGamesById]);

  // Ser till att spel finns i state och försöker sedan ladda serverversionen.
  const ensureGame = useCallback((gameId: string) => {
    setGamesById((prev) => {
      if (prev[gameId]) return prev;
      void loadGame(gameId);
      return prev;
    });
  }, [setGamesById, loadGame]);

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
      loadGame,
      overwriteGame,
      deleteGame,
      setGameName,
      addPlayer,
      removePlayer,
      changeScore,
    }),
    [saveGame, ensureGame, loadGame, overwriteGame, deleteGame, setGameName, addPlayer, removePlayer, changeScore]
  );
}
