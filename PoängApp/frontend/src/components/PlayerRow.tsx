import type { Player } from "./types";

type Props = {
  player: Player;
  onChangeScore: (id: string, delta: number) => void;
};

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