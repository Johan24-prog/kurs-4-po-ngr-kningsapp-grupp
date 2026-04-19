import type { Player } from "./types";

// PlayerRow är en komponent som visar en spelares namn och poäng, samt knappar för att ändra poängen
type Props = {
  player: Player;
  onChangeScore?: (id: string, delta: number) => void;
};

// När man klickar på + eller - så anropas onChangeScore med spelarens id och hur mycket poängen ska ändras
// PlayerRow tar emot en player och en onChangeScore-funktion som props
// PlayerRow är "dum" och har ingen egen state, den visar bara det den får via props och skickar upp event när knapparna klickas
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