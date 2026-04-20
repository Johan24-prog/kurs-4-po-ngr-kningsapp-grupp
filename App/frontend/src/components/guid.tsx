// Skapar ett unikt id för en ny match.
export function generateGameId() {
  return crypto.randomUUID();
}