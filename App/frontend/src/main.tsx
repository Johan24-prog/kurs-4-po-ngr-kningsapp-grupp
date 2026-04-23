import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GameProvider } from './context/GameContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GameProvider>
  </StrictMode>,
)
// SctrictMode är en utvecklingsfunktion som hjälper till att identifiera potentiella problem i applikationen.
// Context Provider. Gör game-state och game-funktioner tillgängliga för komponenter längre ner i trädet via context.
// Aktiverar routing med URL:er (react-router-dom), gör det möjligt att ha olika sidor/vyer utan full sidreload.
// App är huvudkomponenten för din UI, där resten av appens komponenter ligger.

/*Kort sagt: 
HTML-root -> React-root -> 
säkerhetskontroller (StrictMode) -> global spel-state (GameProvider) -> 
routing (BrowserRouter) -> appen (App).
*/


  

