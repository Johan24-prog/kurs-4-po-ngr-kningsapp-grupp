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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Spelarens namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition"
      >
        Lägg till spelare
      </button>
    </form>
  );
}