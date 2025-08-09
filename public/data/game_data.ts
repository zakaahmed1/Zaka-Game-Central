export type Profile = {
  name: string;
  description: string;
  country: string;
  follower_count: number; // in millions
  image?: string;
};

export const gameData: Profile[] = [
  { name: "Cristiano Ronaldo", description: "footballer", country: "Portugal", follower_count: 605, image: "/images/cristiano.jpg" },
  { name: "Lionel Messi", description: "footballer", country: "Argentina", follower_count: 504, image: "/images/messi.webp"   },
  { name: "Selena Gomez", description: "musician and actress", country: "USA", follower_count: 429, image: "/images/selenagomez.webp" },
  { name: "Kylie Jenner", description: "media personality", country: "USA", follower_count: 400, image: "/images/kyliejenner.webp"   },
  { name: "Dwayne Johnson", description: "actor and wrestler", country: "USA", follower_count: 392, image: "/images/dwaynejohnson.avif" },
  { name: "Ariana Grande", description: "singer and actress", country: "USA", follower_count: 380, image: "/images/arianagrande.webp"   },
  { name: "Kim Kardashian", description: "media personality", country: "USA", follower_count: 365, image: "/images/kimkardashian.avif"   },
  { name: "Taylor Swift", description: "singer-songwriter", country: "USA", follower_count: 322, image: "/images/taylorswift.avif"   },
  { name: "Virat Kohli", description: "cricketer", country: "India", follower_count: 278, image: "/images/virat.webp" },
  { name: "Neymar Jr", description: "footballer", country: "Brazil", follower_count: 220, image: "/images/neymar.jpg" },
];
