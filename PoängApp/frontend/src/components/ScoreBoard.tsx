import { useState } from "react";

// Definiera en typ för en spelare, som innehåller spelarens namn och poäng.
type Player = 
{
    name: string;
    score: number;
};

// Scoreboard komponent för att hålla koll på poängen för varje spelare.
export default function ScoreBoard() 
{
    // Skapa en state för att hålla koll på spelarna och deras poäng.
    const [players, setPlayers] = useState<Player[]>
    ([
        { name: "Player 1", score: 0 },
        { name: "Player 2", score: 0 },
        { name: "Player 3", score: 0 },
        { name: "Player 4", score: 0 }
    ]);

    // Funktion för att uppdatera poängen för en spelare.
    const updateScore = (index: number, amount: number) =>
    {
        const newPlayers = [...players];
        newPlayers[index].score += amount;
        setPlayers(newPlayers);
    }

    // Rendera poängbrädet med spelarnas namn och poäng, samt knappar för att uppdatera poängen.
    return (
    <div>
        {players.map((player, index) => (
            <div key={index}>
                <h2>{player.name}: {player.score}</h2>
                <button onClick={() => updateScore(index, 1)}>+1</button>
                <button onClick={() => updateScore(index, -1)}>-1</button>
            </div>
        ))}
    </div>
    );
}