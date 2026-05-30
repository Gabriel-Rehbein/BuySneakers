/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type AuthContextValue = {
  token: string;
  isAuthenticated: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
};

const TOKEN_KEY = "buysneakers.token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      saveToken: (newToken: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
