import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AddPlayerForm } from "./AddPlayerForm";
import { GameNameInput } from "./GameNameInput";
import { PlayerRow } from "./PlayerRow";
import { useGameContext } from "../context/GameContext";

export function Game() {
    const { gameId } = useParams();
    const { gamesById, ensureGame, setGameName, addPlayer, changeScore, resetGame } = useGameContext();

    // Säkerställer att spelobjektet finns även vid direktlänk till route.
    useEffect(() => {
        if (!gameId) return;
        ensureGame(gameId);
    }, [ensureGame, gameId]);

    if (!gameId) {
        return <h1>Ogiltigt spel-id</h1>;
    }

    const game = gamesById[gameId] ?? { gameName: "Spel", players: [] };

    const handleSetGameName = (name: string) => {
        setGameName(gameId, name);
    };

    const handleAddPlayer = (name: string) => {
        addPlayer(gameId, name);
    };

    const handleChangeScore = (playerId: string, delta: number) => {
        changeScore(gameId, playerId, delta);
    };

    // Nollställer spelnamn och spelare för aktuellt gameId.
    const handleResetGame = () => {
        resetGame(gameId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex justify-center items-start p-6 sm:p-8">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">Pågående spel</h1>
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        Till startsidan
                    </Link>
                </div>

                <GameNameInput onSetName={handleSetGameName} />

                <h2 className="text-2xl font-bold text-center mt-6 mb-4 text-slate-800">
                    {game.gameName}
                </h2>

                <AddPlayerForm onAddPlayer={handleAddPlayer} />

                <div className="mt-4">
                    <button
                        type="button"
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-600 transition"
                        onClick={handleResetGame}
                    >
                        Rensa/Nollställ
                    </button>
                </div>

                <div className="mt-6 space-y-3">
                    {game.players.map((player) => (
                        <PlayerRow
                            key={player.id}
                            player={player}
                            onChangeScore={handleChangeScore}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

