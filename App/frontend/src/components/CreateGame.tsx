import { useState } from "react";
import type { Player } from "./types";
import { PlayerRow } from "./PlayerRow";
import { AddPlayerForm } from "./AddPlayerForm";
import { GameNameInput } from "./GameNameInput";
import { generateGameId } from "./guid"; 
import { Link, useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";

// Hanterar skapandet av en ny match innan användaren går till spelsidan.
export function CreateGame() {
    // Lokalt state för nya matchens namn, spelare och om spelare får läggas till senare.
    const [gameName, setGameName] = useState("Nytt spel");
    const [players, setPlayers] = useState<Player[]>([]);
    const [allowAddingPlayers, setAllowAddingPlayers] = useState(true);
    const navigate = useNavigate();
    const { saveGame } = useGameContext();

    const handleCreate = async () => {
        const gameId = generateGameId();

        try {
            // Försöker spara till backend när endpoint finns.
            await fetch("/api/games", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: gameId,
                    gameName,
                    players,
                    allowAddingPlayers,
                }),
            });
        } catch {
            // Behåll frontend-flödet även om backend-endpointen inte är klar ännu.
        }

        saveGame(gameId, gameName, players, allowAddingPlayers);
        navigate(`/${gameId}`);
    };

    // Lägger till en spelare i den lokala listan före matchen skapas.
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

    // Visar formulär för matchuppsättning och sammanställning av tillagda spelare.
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
                        />
                    ))}
                </div>
                <div className="mt-8">
                    <button
                        type="button"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        onClick={handleCreate}
                    >
                        Skapa match
                    </button>

                    <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={allowAddingPlayers}
                            onChange={(e) => setAllowAddingPlayers(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        Tillåt att lägga till spelare efter att matchen skapats
                    </label>
                </div>

            </div>
        </div>
        
    );
}