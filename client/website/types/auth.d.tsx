export interface User {
  _id: string;
  email: string;
  username: string;
  avatar: string;
  credits: Credits;
}

export interface Credits {
  _id: string;
  boughtCredits: number;
  dailyCredits: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  tokens: AuthTokens | null;
  setTokens: React.Dispatch<React.SetStateAction<AuthTokens | null>>;
}
