import { useState } from "react";
import type { Player } from "./types";
import { PlayerRow } from "./PlayerRow";
import { AddPlayerForm } from "./AddPlayerForm";
import { GameNameInput } from "./GameNameInput";
import { generateGameId } from "./guid"; 
import { Link, useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";


// Game är den övergripande komponenten som håller all state
// och logik för att lägga till spelare och ändra poäng
export function CreateGame() {
    const [gameName, setGameName] = useState("Nytt spel");
    const [players, setPlayers] = useState<Player[]>([]);
    const navigate = useNavigate();
    const { saveGame } = useGameContext();

    const handleCreate = () => {
        const gameId = generateGameId();
        saveGame(gameId, gameName, players);
        navigate(`/${gameId}`);
    };


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
        <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 flex justify-center items-start p-6 sm:p-8">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Skapa spel
                    </h1>
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        Till startsidan
                    </Link>
                </div>

                <p className="mt-2 text-slate-600">
                    Ange spelnamn och lägg till spelare innan du startar spelet.
                </p>

                <h2 className="text-2xl font-bold text-center mt-6 mb-4 text-slate-800">
                    {gameName}
                </h2>

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
                <div className="mt-8">
                    <button
                        type="button"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        onClick={handleCreate}
                    >
                        Starta spel
                    </button>
                </div>

            </div>
        </div>
        
    );
}