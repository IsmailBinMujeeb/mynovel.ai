export interface User {
  _id: string;
  email: string;
  username: string;
  avatar: string;
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
