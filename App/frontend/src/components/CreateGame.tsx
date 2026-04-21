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

    // Tar bort spelare från listan innan matchen skapas.
    const removePlayer = (playerId: string) => {
        setPlayers((prev) => prev.filter((player) => player.id !== playerId));
    };

    // Visar formulär för matchuppsättning och sammanställning av tillagda spelare.
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-slate-100 flex justify-center items-start p-6 sm:p-8">
            <div className="w-full max-w-2xl bg-linear-to-b from-white to-slate-50/50 shadow-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/50">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent">
                            Skapa spel
                        </h1>
                        <div className="mt-2 h-1 w-16 bg-linear-to-r from-sky-500 to-emerald-500 rounded-full"></div>
                    </div>
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors px-4 py-2 rounded-lg hover:bg-sky-50"
                    >
                        ← Tillbaka
                    </Link>
                </div>

                <p className="mt-2 text-slate-600 font-medium">
                    Ange spelnamn och lägg till spelare innan du startar spelet.
                </p>

                <h2 className="text-3xl font-bold text-center mt-8 mb-6 bg-linear-to-r from-sky-700 to-emerald-600 bg-clip-text text-transparent">
                    {gameName}
                </h2>

                <div className="space-y-4">
                    <GameNameInput onSetName={setGameName} />
                    <AddPlayerForm onAddPlayer={addPlayer} />
                </div>

                <div className="mt-8 space-y-3">
                    {players.length === 0 ? (
                        <p className="text-center py-6 text-slate-500 text-sm italic">Inga spelare ännu...</p>
                    ) : (
                        players.map((player) => (
                            <PlayerRow
                                key={player.id}
                                player={player}
                                onRemovePlayer={removePlayer}
                            />
                        ))
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-sky-50/50 border border-sky-200/50 cursor-pointer transition hover:bg-sky-50">
                        <input
                            type="checkbox"
                            checked={allowAddingPlayers}
                            onChange={(e) => setAllowAddingPlayers(e.target.checked)}
                            className="h-5 w-5 rounded border-sky-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700">
                            Tillåt att lägga till spelare efter att matchen skapats
                        </span>
                    </label>

                    <button
                        type="button"
                        className="w-full inline-flex items-center justify-center bg-linear-to-b from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl active:scale-95"
                        onClick={handleCreate}
                    >
                        ✨ Starta spel
                    </button>
                </div>

            </div>
        </div>
        
    );
}