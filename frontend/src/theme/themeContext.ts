// themeContext.ts
import { createContext } from "react";

export type ThemeMode = 'light' | 'dark';

export type ThemeContextType = {
  mode: ThemeMode;
  toggleMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
