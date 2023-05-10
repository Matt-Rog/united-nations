export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  games: string[];
  players: string[];
  [key: string]: any;
}
