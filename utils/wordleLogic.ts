type Color = 'green' | 'yellow' | 'gray';
type Feedback = [Color, string];

export function evaluateGuess(guess: string, answer: string): Feedback[] {
  const result: Feedback[] = new Array(answer.length).fill(null);
  const unmatched = answer.split('');

  // First pass
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = ['green', guess[i]];
      unmatched[i] = '';
    }
  }

  // Second pass
  for (let i = 0; i < answer.length; i++) {
    if (!result[i]) {
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

export function updateKeyboard(
  keyboard: { [key: string]: string },
  feedback: Feedback[]
) {
  for (const [color, letter] of feedback) {
    if (color === 'green') keyboard[letter] = 'green';
    else if (color === 'yellow' && keyboard[letter] !== 'green') keyboard[letter] = 'yellow';
    else if (color === 'gray' && !keyboard[letter]) keyboard[letter] = 'gray';
  }
  return keyboard;
}
