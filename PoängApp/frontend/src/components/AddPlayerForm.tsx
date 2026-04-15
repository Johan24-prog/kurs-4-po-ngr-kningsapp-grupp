import { useState } from "react";

type Props = {
  onAddPlayer: (name: string) => void;
};

// AddPlayerForm är en komponent som visar ett formulär för att lägga till en ny spelare
export function AddPlayerForm({ onAddPlayer }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    onAddPlayer(name);
    setName(""); // rensa input
  };

  // håller sitt eget input-state
  // skickar upp namnet till Game
  // rensar input efter submit
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Spelarens namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button type="submit">Lägg till</button>
    </form>
  );
}