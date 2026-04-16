import type { Player } from "./types";

// PlayerRow är en komponent som visar en spelares namn och poäng, samt knappar för att ändra poängen
type Props = {
  player: Player;
  onChangeScore: (id: string, delta: number) => void;
};

// När man klickar på + eller - så anropas onChangeScore med spelarens id och hur mycket poängen ska ändras
// PlayerRow tar emot en player och en onChangeScore-funktion som props
// PlayerRow är "dum" och har ingen egen state, den visar bara det den får via props och skickar upp event när knapparna klickas
export function PlayerRow({ player, onChangeScore }: Props) {
  return (
    <div>
      <h3>{player.name}: {player.score}
        <button onClick={() => onChangeScore(player.id, 1)}>
        +
      </button>
        <button onClick={() => onChangeScore(player.id, -1)}>
        -
      </button>
      </h3>
    </div>
  );
}