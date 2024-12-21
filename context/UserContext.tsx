"use client";
import { useToast } from "@/hooks/use-toast";
import { account } from "@/lib/appWrite";
import { GetUser } from "@/lib/appWriteHandlers";
import React, { useEffect, useState, createContext, useContext } from "react";

// Define the User type
export type User = {
  $id: string; // Appwrite account ID
  email: string; // User's email
  username: string; // User's username
  avatar?: string; // Optional: User's avatar
  bio?: string; // Optional: User's bio
  $createdAt?: string; // Optional: Creation timestamp
};

// Define the Global State type
type GlobalState = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
};

// Create the context
const GlobalContext = createContext<GlobalState | null>(null);

// Hook to access the Global Context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Provider component
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch user data
  const getUser = async () => {
    const { message, success, error, user: fetchedUser } = await GetUser();
    if (!success || !fetchedUser) {
      setUser(null);
      setIsLogged(false);
      toast({
        title: "Error fetching user",
        description: `${message} ${error}`,
        variant: "destructive",
      });
      return;
    }

    setUser(fetchedUser);
    setIsLogged(true);
  };

  useEffect(() => {
    account
      .get()
      .then(() => {
        // If the session exists, fetch user data
        getUser();
      })
      .catch(() => {
        // If no session exists, clear state
        setUser(null);
        setIsLogged(false);
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser, isLogged, setIsLogged }}>
      {children}
    </GlobalContext.Provider>
  );
};
