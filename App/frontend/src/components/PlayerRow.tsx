import type { Player } from "./types";

// Props för en rad som visar en spelare i listan.
type Props = {
  player: Player;
  onChangeScore?: (id: string, delta: number) => void;
};

// Presentationskomponent för spelarnamn/poäng och valfria knappar för poängändring.
export function PlayerRow({ player, onChangeScore }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{player.name}</h3>
        <p className="text-sm text-slate-600">Poäng: {player.score}</p>
      </div>

      {onChangeScore && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 w-9 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
            onClick={() => onChangeScore(player.id, -1)}
            aria-label={`Minska poäng för ${player.name}`}
          >
            -
          </button>
          <button
            type="button"
            className="h-9 w-9 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition"
            onClick={() => onChangeScore(player.id, 1)}
            aria-label={`Öka poäng för ${player.name}`}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}