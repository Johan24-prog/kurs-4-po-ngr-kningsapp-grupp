import { useState } from "react";
import type { Player } from "./types";
import { PlayerRow } from "./PlayerRow";
import { AddPlayerForm } from "./AddPlayerForm";

// Game är den övergripande komponenten som håller all state
// och logik för att lägga till spelare och ändra poäng
export function Game() {
    const [players, setPlayers] = useState<Player[]>([]);

    // lägga till en ny spelare
    const addPlayer = (name: string) => {
        setPlayers((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name,
                score: 0,
            },
        ]);
    };

    // ändra poäng för en spelare
    const changeScore = (id: string, delta: number) => {
        setPlayers((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, score: p.score + delta }
                    : p
            )
        );
    };

    // rendera AddPlayerForm och en PlayerRow för varje spelare
    return (
        <div>
            <h1>Poängspel</h1>

            <AddPlayerForm onAddPlayer={addPlayer} />

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