import type { NextApiRequest, NextApiResponse } from 'next';

const WORD_LENGTH = 5;

type Feedback = [string, string][]; // [color, letter]

function evaluateGuess(guess: string, answer: string): Feedback {
  const result: Feedback = Array(WORD_LENGTH).fill(['', '']);
  const unmatched = answer.split('');

  // First pass – correct position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i] = ['green', guess[i]];
      unmatched[i] = ''; // Mark matched
    }
  }

  // Second pass – wrong position or not in word
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i][0] === '') {
      if (unmatched.includes(guess[i])) {
        result[i] = ['yellow', guess[i]];
        unmatched[unmatched.indexOf(guess[i])] = '';
      } else {
        result[i] = ['gray', guess[i]];
      }
    }
  }

  return result;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guess, answer } = req.body;

  if (!guess || !answer || guess.length !== WORD_LENGTH || answer.length !== WORD_LENGTH) {
    return res.status(400).json({ error: 'Invalid guess or answer' });
  }

  const feedback = evaluateGuess(guess.toLowerCase(), answer.toLowerCase());

  res.status(200).json({ feedback });
}
