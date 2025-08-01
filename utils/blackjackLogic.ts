// utils/blackjackLogic.ts

export type Card = {
  suit: string;
  value: string;
};

export function calculateScore(hand: Card[]): number {
  let score = 0;
  let aces = 0;
  hand.forEach((card) => {
    if (['J', 'Q', 'K'].includes(card.value)) {
      score += 10;
    } else if (card.value === 'A') {
      score += 11;
      aces += 1;
    } else {
      score += parseInt(card.value);
    }
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function playSound(audio: HTMLAudioElement) {
  audio.currentTime = 0;
  audio.play();
}
