import { Link, useNavigate } from "react-router-dom";
import { GameSearchInput } from "./GameSearchInput";
import { useGameContext } from "../context/GameContext";

// Enkel startsida med länk till flödet för att skapa en ny match.
export function LandingPage() {
    const { gamesById } = useGameContext();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-slate-100 flex justify-center items-center p-6">
            <div className="w-full max-w-lg bg-linear-to-b from-white to-slate-50/50 shadow-2xl rounded-3xl p-8 text-center border border-slate-200/50">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-r from-sky-500 to-emerald-500 mb-4 mx-auto">
                    <span className="text-xl font-bold text-white">🎯</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-2">Poängräknare</p>
                <h1 className="text-5xl font-bold mt-2 mb-3 bg-linear-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent">Välkommen!</h1>
                <p className="text-lg mb-8 text-slate-600 leading-relaxed">
                    Skapa ett spel, lägg till spelare och börja räkna poäng.
                </p>

                <div className="mb-6 p-4 rounded-2xl bg-sky-50/50 border border-sky-200/50">
                    <p className="mb-3 text-sm font-bold text-sky-700 uppercase tracking-wide">Fortsätt ett befintligt spel</p>
                    <GameSearchInput
                        gamesById={gamesById}
                        currentGameId=""
                        onSelectGame={(selectedGameId: string) => navigate(`/${selectedGameId}`)}
                    />
                </div>

                <div className="space-y-3">
                    <Link
                        to="/creategame"
                        className="inline-flex items-center justify-center w-full bg-linear-to-b from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl active:scale-95"
                    >
                        ✨ Skapa nytt spel
                    </Link>
                </div>
            </div>
        </div>
    );
}

