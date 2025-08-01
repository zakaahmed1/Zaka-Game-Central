import type { NextApiRequest, NextApiResponse } from 'next';

function calculateScore(name1: string, name2: string) {
  const combined = (name1 + name2).toLowerCase();
  const trueScore = [...'true'].reduce((sum, letter) => sum + (combined.split(letter).length - 1), 0);
  const loveScore = [...'love'].reduce((sum, letter) => sum + (combined.split(letter).length - 1), 0);
  const total = parseInt(`${trueScore}${loveScore}`);
  return {
    score: total,
    interpretation: interpretScore(total),
  };
}

function interpretScore(score: number): string {
  if (score > 90) return '🔥 Perfect match!';
  if (score > 70) return '😊 Strong match!';
  if (score > 50) return '😌 Decent match';
  if (score > 30) return '🤔 Might need some work';
  return '💔 Not looking good...';
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name1, name2 } = req.body;

  if (!name1 || !name2) {
    return res.status(400).json({ error: 'Both names are required.' });
  }

  const result = calculateScore(name1, name2);
  res.status(200).json(result);
}
