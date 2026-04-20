import { useState } from "react";

// Props för inputfältet som skickar tillbaka skrivet spelnamn.
type Props = {
  onSetName: (name: string) => void;
};

// Enkel kontrollerad input för att skriva ett spelnamn.
export function GameNameInput({ onSetName }: Props) {
  const [name, setName] = useState("");

  // Synkar lokalt input-state och meddelar föräldrakomponenten.
  const handleChange = (value: string) => {
    setName(value);
    onSetName(value);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Spelets namn"
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
}