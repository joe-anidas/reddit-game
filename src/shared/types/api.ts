// Game state types for r/GuessTheComment
export type DailyPost = {
  id: string;
  title: string;
  content?: string | undefined; // text content if applicable
  imageUrl?: string | undefined; // image URL if applicable
  subreddit: string;
  topComment: string;
  date: string; // YYYY-MM-DD
};

export type PlayerGuess = {
  id: string;
  username: string;
  guess: string;
  votes: number;
  timestamp: number;
  postId: string;
};

export type GameState = {
  dailyPost: DailyPost;
  guesses: PlayerGuess[];
  hasGuessed: boolean;
  userGuess?: PlayerGuess | undefined;
};

// API Response types
export type InitGameResponse = {
  type: 'init';
  gameState: GameState;
};

export type SubmitGuessResponse = {
  type: 'guessSubmitted';
  guess: PlayerGuess;
  revealed: boolean; // true if this was their first guess and comment is now revealed
};

export type VoteGuessResponse = {
  type: 'voteSubmitted';
  guessId: string;
  newVoteCount: number;
};

export type RevealResponse = {
  type: 'reveal';
  topComment: string;
  allGuesses: PlayerGuess[];
};