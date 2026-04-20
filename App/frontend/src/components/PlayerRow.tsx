import type { Player } from "./types";

// Props för en rad som visar en spelare i listan.
type Props = {
  player: Player;
  onChangeScore?: (id: string, delta: number) => void;
  onRemovePlayer?: (id: string) => void;
};

// Presentationskomponent för spelarnamn/poäng och valfria knappar för poängändring/borttagning.
export function PlayerRow({ player, onChangeScore, onRemovePlayer }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-linear-to-r from-slate-50 to-sky-50/30 p-4 shadow-sm transition-all hover:shadow-md hover:border-sky-200">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900">{player.name}</h3>
        <p className="mt-1 text-sm font-medium text-slate-600">Poäng: <span className="text-sky-700 font-bold text-base">{player.score}</span></p>
      </div>

      {(onChangeScore || onRemovePlayer) && (
        <div className="ml-4 flex items-center gap-3">
          {onChangeScore && (
            <div className="flex items-center gap-2 rounded-xl bg-white/80 p-2 shadow-sm">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-b from-rose-500 to-rose-600 text-lg font-bold text-white shadow-md transition-all hover:from-rose-600 hover:to-rose-700 hover:shadow-lg active:scale-95"
                onClick={() => onChangeScore(player.id, -1)}
                aria-label={`Minska poäng för ${player.name}`}
              >
                −
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-b from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-md transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg active:scale-95"
                onClick={() => onChangeScore(player.id, 1)}
                aria-label={`Öka poäng för ${player.name}`}
              >
                +
              </button>
            </div>
          )}

          {onRemovePlayer && (
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-linear-to-b from-red-500 to-red-600 px-4 text-sm font-bold text-white shadow-md transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg active:scale-95"
              onClick={() => onRemovePlayer(player.id)}
              aria-label={`Ta bort spelaren ${player.name}`}
            >
              Ta bort
            </button>
          )}
        </div>
      )}
    </div>
  );
}