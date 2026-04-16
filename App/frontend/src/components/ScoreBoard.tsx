// ScoreBoard är en komponent som bara visar en poäng. Den tar emot poängen som props och har ingen egen state.
type Props = {
  score: number;
};

export function ScoreBoard({ score }: Props) {
  return <div>{score}</div>;
}