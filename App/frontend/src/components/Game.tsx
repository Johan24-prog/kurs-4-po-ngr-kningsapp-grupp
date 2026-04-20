import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AddPlayerForm } from "./AddPlayerForm";
import { GameSearchInput } from "./GameSearchInput.tsx";
import { PlayerRow } from "./PlayerRow";
import { useGameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

// Visar en pågående match baserat på gameId i URL:en.
export function Game() {
    const { gameId } = useParams();
    const { gamesById, ensureGame, addPlayer, changeScore, resetGame } = useGameContext();
    const navigate = useNavigate();

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
    const canAddPlayers = game.allowAddingPlayers ?? true;

    // Lägger till spelare i aktuell match via context.
    const handleAddPlayer = (name: string) => {
        addPlayer(gameId, name);
    };

    // Uppdaterar poäng för en specifik spelare.
    const handleChangeScore = (playerId: string, delta: number) => {
        changeScore(gameId, playerId, delta);
    };

    // Nollställer spelnamn och spelare för aktuellt gameId.
    const handleResetGame = () => {
        resetGame(gameId);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 flex justify-center items-start p-6 sm:p-8">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-slate-900 -mt-1">{game.gameName}</h1>
                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        Till startsidan
                    </Link>
                </div>

                <GameSearchInput
                    gamesById={gamesById}
                    currentGameId={gameId}
                    // Byte av aktiv match sker genom navigation till valt gameId.
                    onSelectGame={(selectedGameId: string) => {
                        if (selectedGameId === gameId) return;
                        navigate(`/${selectedGameId}`);
                    }}
                />

                <h2 className="text-2xl font-bold text-center mt-6 mb-4 text-slate-800">
                </h2>

                <AddPlayerForm onAddPlayer={handleAddPlayer} disabled={!canAddPlayers} />

                {!canAddPlayers && (
                    <p className="mt-2 text-sm text-slate-500">
                        Spelare kan inte läggas till efter att matchen har skapats.
                    </p>
                )}

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

