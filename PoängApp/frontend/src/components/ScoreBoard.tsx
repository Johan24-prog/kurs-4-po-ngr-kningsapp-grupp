type Props = {
  score: number;
};

export function ScoreBoard({ score }: Props) {
  return <div>{score}</div>;
}