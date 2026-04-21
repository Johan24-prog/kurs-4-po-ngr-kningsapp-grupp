import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddPlayerForm } from "./AddPlayerForm";
import { PlayerRow } from "./PlayerRow";
import { useGameContext } from "../context/GameContext";

// Visar en pågående match baserat på gameId i URL:en.
export function Game() {
    const { gameId } = useParams();
    const { gamesById, ensureGame, addPlayer, removePlayer, changeScore } = useGameContext();
    const [scoreMode, setScoreMode] = useState<"standard" | "custom">("standard");
    const [customStep, setCustomStep] = useState<number>(5);

    // Säkerställer att spelobjektet finns även vid direktlänk till route.
    useEffect(() => {
        if (!gameId) return;
        ensureGame(gameId);
    }, [ensureGame, gameId]);

    if (!gameId) {
        return <h1>Ogiltigt spel-id</h1>;
    }

    // Fallback används om route finns men spelet ännu inte hunnit laddas in.
    const game = gamesById[gameId] ?? { gameName: "Spel", players: [] };
    const higherIsBetter = game.higherIsBetter ?? true;
    const canAddPlayers = game.allowAddingPlayers ?? true;
    const sortedPlayers = [...game.players].sort((a, b) => {
        if (higherIsBetter) {
            return b.score - a.score;
        }

        return a.score - b.score;
    });

    // Lägger till spelare i aktuell match via context.
    const handleAddPlayer = (name: string) => {
        addPlayer(gameId, name);
    };

    // Tar bort en spelare från aktuell match.
    const handleRemovePlayer = (playerId: string) => {
        removePlayer(gameId, playerId);
    };

    // Uppdaterar poäng för en specifik spelare.
    const handleChangeScore = (playerId: string, delta: number) => {
        changeScore(gameId, playerId, delta);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-slate-100 flex justify-center items-start p-6 sm:p-8">
            <div className="w-full max-w-2xl bg-linear-to-b from-white to-slate-50/50 shadow-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/50">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent">{game.gameName}</h1>
                        <div className="mt-2 h-1 w-16 bg-linear-to-r from-sky-500 to-emerald-500 rounded-full"></div>
                    </div>
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-sky-700 transition-colors px-4 py-2 rounded-lg hover:bg-sky-50"
                    >
                        ← Tillbaka
                    </Link>
                </div>

                <div className="mt-6">
                    <AddPlayerForm onAddPlayer={handleAddPlayer} disabled={!canAddPlayers} />
                </div>

                {!canAddPlayers && (
                    <p className="mt-3 text-sm font-medium text-amber-700 bg-amber-50/70 px-4 py-2 rounded-lg border border-amber-200/50">
                        Spelare kan inte läggas till efter att matchen har skapats.
                    </p>
                )}

                {/* Poänginställningar */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-slate-600 uppercase tracking-wide">Poänginställning</p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setScoreMode("standard")}
                            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
                                scoreMode === "standard"
                                    ? "bg-linear-to-b from-sky-500 to-sky-600 text-white shadow-md"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            Standard (+1)
                        </button>
                        <button
                            type="button"
                            onClick={() => setScoreMode("custom")}
                            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
                                scoreMode === "custom"
                                    ? "bg-linear-to-b from-emerald-500 to-emerald-600 text-white shadow-md"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            Anpassat
                        </button>
                    </div>
                    {scoreMode === "custom" && (
                        <div className="mt-3 flex items-center gap-3">
                            <label htmlFor="customStep" className="text-sm font-medium text-slate-600 whitespace-nowrap">
                                Steg per poäng
                            </label>
                            <input
                                id="customStep"
                                type="number"
                                min={1}
                                value={customStep}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val >= 1) setCustomStep(val);
                                }}
                                className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-bold text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                            />
                        </div>
                    )}

                </div>

                <div className="mt-6 space-y-3">
                    {game.players.length === 0 ? (
                        <p className="text-center py-8 text-slate-500 text-sm">Inga spelare ännu. Lägg till en spelare för att börja!</p>
                    ) : (
                        sortedPlayers.map((player) => (
                            <PlayerRow
                                key={player.id}
                                player={player}
                                onRemovePlayer={handleRemovePlayer}
                                onChangeScore={handleChangeScore}
                                scoreStep={scoreMode === "custom" ? customStep : 1}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

