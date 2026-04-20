import { useMemo, useState } from "react";

type GameSummary = {
  gameName: string;
};

type Props = {
  gamesById: Record<string, GameSummary>;
  currentGameId: string;
  onSelectGame: (gameId: string) => void;
};

export function GameSearchInput({ gamesById, currentGameId, onSelectGame }: Props) {
  const [query, setQuery] = useState("");

  const searchableGames = useMemo(
    () =>
      Object.entries(gamesById).map(([id, game]) => ({
        id,
        gameName: game.gameName,
      })),
    [gamesById]
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGames = useMemo(() => {
    if (!normalizedQuery) {
      return searchableGames;
    }

    return searchableGames.filter((game) => {
      return (
        game.gameName.toLowerCase().includes(normalizedQuery) ||
        game.id.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery, searchableGames]);

  const showResults = query.trim().length > 0;

  return (
    <div className="relative flex flex-col gap-2">
      <input
        type="text"
        placeholder="Sök spel"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      {showResults && (
        <div className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {filteredGames.length === 0 ? (
            <p className="px-3 py-2 text-sm text-slate-500">Inga spel hittades</p>
          ) : (
            filteredGames.map((game) => {
              const isCurrent = game.id === currentGameId;

              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => onSelectGame(game.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
                >
                  <span>{game.gameName || "Namnlöst spel"}</span>
                  {isCurrent && <span className="text-xs text-slate-500">Aktuellt</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
