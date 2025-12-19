import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  type AuthContextType,
  type User,
  type AuthTokens,
} from "../../types/auth.d";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    axios
      .get<{ user: User }>(`${import.meta.env.VITE_API_ENDPOINT}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        console.log(res.data.user);
      })
      .catch(() => setTokens(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, tokens, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
