import { Link } from "react-router-dom";

// Enkel startsida med länk till flödet för att skapa en ny match.
export function LandingPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 flex justify-center items-center p-6">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 text-center border border-slate-200">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Poängräknare</p>
                <h1 className="text-4xl font-bold mt-2 mb-4 text-slate-900">Välkommen!</h1>
                <p className="text-lg mb-8 text-slate-700">
                    Skapa ett spel, lägg till spelare och börja räkna poäng direkt.
                </p>
                <Link
                    to="/creategame"
                    className="inline-flex items-center justify-center bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition"
                >
                    Skapa spel
                </Link>
            </div>
        </div>
    );
}

