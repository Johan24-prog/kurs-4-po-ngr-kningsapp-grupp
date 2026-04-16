import { useState } from "react";
import type { Player } from "./types";
import { PlayerRow } from "./PlayerRow";
import { AddPlayerForm } from "./AddPlayerForm";
import { GameNameInput } from "./GameNameInput";
import { generateGameId } from "./guid"; 


// Game är den övergripande komponenten som håller all state
// och logik för att lägga till spelare och ändra poäng
export function CreateGame() {
    const [gameName, setGameName] = useState("Skapa Spel");
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
    // samt en GameNameInput för att sätta spelets namn
    return (
        // enkel styling med Tailwind CSS
        <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
            <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
                <h1 className="text-3xl font-bold text-center mb-4">
                    {gameName}
                </h1>

                <div className="space-y-3">
                    <GameNameInput onSetName={setGameName} />
                    <AddPlayerForm onAddPlayer={addPlayer} />
                </div>
                <div className="mt-6 space-y-3">
                    {players.map((player) => (
                        <PlayerRow
                            key={player.id}
                            player={player}
                            onChangeScore={changeScore}
                        />
                    ))}
                </div>
                <div>
                    <a href={`/${generateGameId()}`} className="inline-block mt-6 bg-green-300 text-white px-6 py-3 rounded-lg hover:bg-green-400 transition">
                        Starta Spelet
                    </a>
                </div>

            </div>
        </div>
        
    );
}