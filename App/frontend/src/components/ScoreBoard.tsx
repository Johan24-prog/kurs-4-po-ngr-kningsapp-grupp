// Visar en enkel poängruta och har ingen egen state.
type Props = {
  score: number;
};

export function ScoreBoard({ score }: Props) {
  return <div>{score}</div>;
}