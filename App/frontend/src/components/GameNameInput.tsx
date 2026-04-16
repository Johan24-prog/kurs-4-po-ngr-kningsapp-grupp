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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Spelets namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Skapa</button>
    </form>
  );
}