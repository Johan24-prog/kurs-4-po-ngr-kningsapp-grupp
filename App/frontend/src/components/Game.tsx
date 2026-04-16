import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
        <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
            <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-6">
                <GameNameInput onSetName={handleSetGameName} />

                <h1 className="text-3xl font-bold text-center mb-4">
                    {game.gameName}
                </h1>

                <AddPlayerForm onAddPlayer={handleAddPlayer} />

                <div className="mt-4">
                    <button
                        type="button"
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        onClick={handleResetGame}
                    >
                        Clear/Reset
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

