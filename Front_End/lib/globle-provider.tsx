import { createContext, useContext, useEffect, useState } from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import { getCurrentUser } from "./appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
  completeOnboarding: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser });
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem("hasCompletedOnboarding");
      setHasCompletedOnboarding(completed === "true");
    };
    checkOnboarding();
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("hasCompletedOnboarding", "true");
    setHasCompletedOnboarding(true);
  };

  const isLoggedIn = !!user;

  return (
    <GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch, hasCompletedOnboarding, completeOnboarding }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () : GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalProvider");
    }
    return context;
}

export default GlobalContext;
