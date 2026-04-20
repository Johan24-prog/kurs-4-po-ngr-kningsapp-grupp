import { useState } from "react";

// Props för formuläret som lägger till en spelare.
type Props = {
  onAddPlayer: (name: string) => void;
  disabled?: boolean;
};

// Visar input + knapp för att lägga till en spelare i aktuell match.
export function AddPlayerForm({ onAddPlayer, disabled = false }: Props) {
  const [name, setName] = useState("");

  // Stoppar sidomladdning och skickar upp spelarens namn till föräldern.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (!name.trim()) return;

    onAddPlayer(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Spelarens namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition"
      >
        Lägg till spelare
      </button>
    </form>
  );
}