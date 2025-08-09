export type Profile = {
  name: string;
  description: string;
  country: string;
  follower_count: number; // in millions
  image?: string;
};

export const gameData: Profile[] = [
  { name: "Cristiano Ronaldo", description: "Footballer", country: "Portugal", follower_count: 662, image: "/images/cristiano.jpg" },
  { name: "Lionel Messi", description: "Footballer", country: "Argentina", follower_count: 507, image: "/images/messi.webp"   },
  { name: "Selena Gomez", description: "Musician and Actress", country: "USA", follower_count: 418, image: "/images/selenagomez.webp" },
  { name: "Kylie Jenner", description: "Media Personality", country: "USA", follower_count: 393, image: "/images/kyliejenner.webp"   },
  { name: "Dwayne Johnson", description: "Actor and Wrestler", country: "USA", follower_count: 392, image: "/images/dwaynejohnson.avif" },
  { name: "Ariana Grande", description: "Singer and Actress", country: "USA", follower_count: 375, image: "/images/arianagrande.webp"   },
  { name: "Kim Kardashian", description: "Media Personality", country: "USA", follower_count: 356, image: "/images/kimkardashian.avif"   },
  { name: "Taylor Swift", description: "Singer-songwriter", country: "USA", follower_count: 281, image: "/images/taylorswift.avif"   },
  { name: "Virat Kohli", description: "Cricketer", country: "India", follower_count: 274, image: "/images/virat.webp" },
  { name: "Neymar Jr", description: "Footballer", country: "Brazil", follower_count: 231, image: "/images/neymar.jpg" },
];
