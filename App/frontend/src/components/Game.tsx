import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Link, useParams } from "react-router-dom";
import { AddPlayerForm } from "./AddPlayerForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { PlayerRow } from "./PlayerRow";
import { useGameContext } from "../context/GameContext";

function isGuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// Visar en pågående match baserat på gameId i URL:en.
export function Game() {
    const { gameId } = useParams();
    const { gamesById, loadGame, overwriteGame, addPlayer, removePlayer, changeScore } = useGameContext();
    const [scoreMode, setScoreMode] = useState<"standard" | "custom">("standard");
    const [settingsTab, setSettingsTab] = useState<"score" | "match">("score");
    const [customStep, setCustomStep] = useState<number>(5);
    const [status, setStatus] = useState<"loading" | "ready" | "not-found">("loading");
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);

    // Validerar gameId och laddar spel från backend om det inte redan finns i state.
    useEffect(() => {
        if (!gameId || !isGuid(gameId)) {
            setStatus("not-found");
            return;
        }

        if (gamesById[gameId]) {
            setStatus("ready");
            return;
        }

        let cancelled = false;
        setStatus("loading");

        void (async () => {
            const found = await loadGame(gameId);
            if (cancelled) return;

            setStatus(found ? "ready" : "not-found");
        })();

        return () => {
            cancelled = true;
        };
    }, [gameId, gamesById, loadGame]);

    // Prenumererar på realtidsuppdateringar för aktuell match via SignalR.
    useEffect(() => {
        if (!gameId || !isGuid(gameId)) {
            return;
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("/gamehub")
            .withAutomaticReconnect()
            .build();

        let isMounted = true;

        connection.on("GameUpdated", () => {
            if (!isMounted) return;

            void loadGame(gameId);
        });

        connection.onreconnected(() => connection.invoke("JoinGame", gameId));

        void connection
            .start()
            .then(() => connection.invoke("JoinGame", gameId))
            .catch((error) => {
                console.error("Could not connect to game hub", error);
            });

        return () => {
            isMounted = false;

            void connection
                .invoke("LeaveGame", gameId)
                .catch(() => {
                    // Ignore leave failures during teardown.
                })
                .finally(() => {
                    void connection.stop();
                });
        };
    }, [gameId, loadGame]);

    if (!gameId) {
        return <h1>Ogiltigt spel-id</h1>;
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-slate-100 flex justify-center items-start p-6 sm:p-8">
                <div className="w-full max-w-2xl bg-linear-to-b from-white to-slate-50/50 shadow-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/50 text-center">
                    <p className="text-slate-600 font-medium">Laddar spel...</p>
                </div>
            </div>
        );
    }

    if (status === "not-found") {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-slate-100 flex justify-center items-start p-6 sm:p-8">
                <div className="w-full max-w-2xl bg-linear-to-b from-white to-slate-50/50 shadow-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/50 text-center">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent">404 - Spelet hittades inte</h1>
                    <p className="mt-3 text-slate-600">Kontrollera länken eller skapa ett nytt spel.</p>
                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-b from-sky-500 to-sky-600 px-5 py-3 font-bold text-white shadow-md transition-all hover:from-sky-600 hover:to-sky-700 hover:shadow-lg active:scale-95"
                    >
                        Till startsidan
                    </Link>
                </div>
            </div>
        );
    }

    const game = gamesById[gameId];
    if (!game) {
        return null;
    }

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

    const handleRestartMatch = () => {
        setShowRestartConfirm(true);
    };

    const confirmRestartMatch = () => {
        const resetPlayers = game.players.map((player) => ({
            ...player,
            score: player.initialScore ?? 0,
        }));
        overwriteGame(gameId, {
            ...game,
            players: resetPlayers,
        });
        setScoreMode("standard");
        setCustomStep(5);
        setShowRestartConfirm(false);
    };

    return (
        <>
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
                        Till startsidan
                    </Link>
                </div>

                <div className="mt-6 rounded-3xl border border-sky-200/60 bg-linear-to-b from-white via-sky-50/30 to-slate-50/70 p-4 shadow-lg sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Inställningar</h2>
                        <div className="inline-flex rounded-xl border border-slate-200 bg-white/80 p-1 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setSettingsTab("score")}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    settingsTab === "score"
                                        ? "bg-linear-to-b from-sky-500 to-sky-600 text-white shadow"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                Poäng
                            </button>
                            <button
                                type="button"
                                onClick={() => setSettingsTab("match")}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    settingsTab === "match"
                                        ? "bg-linear-to-b from-emerald-500 to-emerald-600 text-white shadow"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                Match
                            </button>
                        </div>
                    </div>

                    {settingsTab === "score" && (
                        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm">
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
                    )}

                    {settingsTab === "match" && (
                        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm space-y-3">
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Matchhantering</p>
                            <button
                                type="button"
                                onClick={handleRestartMatch}
                                className="w-full inline-flex items-center justify-center rounded-xl bg-linear-to-b from-amber-500 to-amber-600 px-5 py-3 font-bold text-white shadow-md transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-lg active:scale-95"
                            >
                                Starta om match
                            </button>
                        </div>
                    )}
                </div>

                {canAddPlayers && (
                    <div className="mt-6">
                        <AddPlayerForm onAddPlayer={handleAddPlayer} />
                    </div>
                )}

                {!canAddPlayers && (
                    <p className="mt-6 text-sm font-medium text-amber-700 bg-amber-50/70 px-4 py-2 rounded-lg border border-amber-200/50">
                        Spelare kan inte läggas till efter att matchen har skapats.
                    </p>
                )}

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
            <ConfirmDialog
                isOpen={showRestartConfirm}
                title="Starta om match"
                message="Vill du verkligen starta om matchen? Alla spelares poäng återställs till startpoäng."
                confirmText="Starta om"
                cancelText="Avbryt"
                confirmVariant="warning"
                onCancel={() => setShowRestartConfirm(false)}
                onConfirm={confirmRestartMatch}
            />
        </>
    );
}

