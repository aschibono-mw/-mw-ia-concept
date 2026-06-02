import { NavContext } from "@/contexts/NavContext";

export const FutureWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavContext.Provider value="future">
    {children}
  </NavContext.Provider>
);
