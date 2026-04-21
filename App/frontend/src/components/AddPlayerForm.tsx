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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <input
        type="text"
        placeholder="Spelarens namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
        className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={disabled}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-linear-to-b from-emerald-500 to-emerald-600 px-6 font-bold text-white shadow-md transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-md sm:w-48"
      >
        Lägg till
      </button>
    </form>
  );
}