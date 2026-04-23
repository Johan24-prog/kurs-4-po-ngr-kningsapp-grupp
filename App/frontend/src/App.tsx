import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CreateGame } from './components/CreateGame';
import { Game } from './components/Game';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/creategame" element={<CreateGame />} />
        <Route path="/:gameId" element={<Game />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
                <h1 className="text-2xl font-bold text-slate-900">Sidan hittades inte</h1>
                <p className="mt-2 text-slate-600">Kontrollera adressen och försök igen.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

// Routes och Route används för att definiera olika URL-vägar i appen och vilka komponenter som ska renderas för varje väg.
// LandingPage, CreateGame och Game är komponenter som representerar olika sidor i appen.
// Den sista Route med path="*" fångar alla ogiltiga URL:er och visar en "Sidan hittades inte" sida.


