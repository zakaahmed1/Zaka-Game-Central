export type Profile = {
  name: string;
  description: string;
  country: string;
  follower_count: number; // in millions
};

export const GAME_DATA: Profile[] = [
  { name: "Cristiano Ronaldo", description: "footballer", country: "Portugal", follower_count: 605 },
  { name: "Lionel Messi", description: "footballer", country: "Argentina", follower_count: 504 },
  { name: "Selena Gomez", description: "musician and actress", country: "USA", follower_count: 429 },
  { name: "Kylie Jenner", description: "media personality", country: "USA", follower_count: 400 },
  { name: "Dwayne Johnson", description: "actor and wrestler", country: "USA", follower_count: 392 },
  { name: "Ariana Grande", description: "singer and actress", country: "USA", follower_count: 380 },
  { name: "Kim Kardashian", description: "media personality", country: "USA", follower_count: 365 },
  { name: "Taylor Swift", description: "singer-songwriter", country: "USA", follower_count: 322 },
  { name: "Virat Kohli", description: "cricketer", country: "India", follower_count: 278 },
  { name: "Neymar Jr", description: "footballer", country: "Brazil", follower_count: 220 },
];
