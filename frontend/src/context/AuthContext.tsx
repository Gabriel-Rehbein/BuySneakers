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

function isTokenExpired(token: string) {
  try {
    const [, payload] = token.split(".");

    if (!payload) return true;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const dados = JSON.parse(window.atob(base64)) as { exp?: number };

    if (!dados.exp) return true;

    return dados.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function getStoredToken() {
  const storedToken = localStorage.getItem(TOKEN_KEY) ?? "";

  if (!storedToken || isTokenExpired(storedToken)) {
    localStorage.removeItem(TOKEN_KEY);
    return "";
  }

  return storedToken;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(getStoredToken);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      saveToken: (newToken: string) => {
        if (isTokenExpired(newToken)) {
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          return;
        }

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
