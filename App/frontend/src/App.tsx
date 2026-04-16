import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CreateGame } from './components/CreateGame';
import { Game } from './components/Game';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/creategame" element={<CreateGame />} />
        <Route path="/:gameId" element={<Game />} />
        <Route path="*" element={<h1>404 - Sidan hittades inte</h1>} />
      </Routes>
    </div>
  );
}


