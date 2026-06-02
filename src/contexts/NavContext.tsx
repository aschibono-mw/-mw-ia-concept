import { createContext, useContext } from "react";

export type NavMode = "current" | "future";

export const NavContext = createContext<NavMode>("current");

export const useNavMode = () => useContext(NavContext);
