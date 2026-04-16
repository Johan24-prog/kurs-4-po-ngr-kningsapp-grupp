import { useState } from "react";

type Props = {
  onSetName: (name: string) => void;
};

export function GameNameInput({ onSetName }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSetName(name);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Spelets namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 transition"
      >
        Spara namn
      </button>
    </form>
  );
}