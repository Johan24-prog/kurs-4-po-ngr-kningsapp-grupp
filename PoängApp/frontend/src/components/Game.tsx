import { useState } from "react";
import type { Player } from "./types";
import { PlayerRow } from "./PlayerRow";

export function Game() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Player 1", score: 0 },
    { id: "2", name: "Player 2", score: 0 },
  ]);

  const changeScore = (id: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, score: p.score + delta } : p
      )
    );
  };

  return (
    <div>
      <h1>Score Game</h1>

      {players.map((p) => (
        <PlayerRow
          key={p.id}
          player={p}
          onChangeScore={changeScore}
        />
      ))}
    </div>
  );
}