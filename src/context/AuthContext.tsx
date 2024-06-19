// AuthContext.tsx
import { useLocation, useNavigate } from "react-router-dom";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/service/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  profile_photo_url: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  token: null as string | null,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setToken: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  token: string | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();

      // console.log(currentAccount.data);
      if (currentAccount) {
        setUser({
          id: currentAccount.data.id,
          name: currentAccount.data.name,
          username: currentAccount.data.username,
          email: currentAccount.data.email,
          profile_photo_url: currentAccount.data.profile_photo_url,
          bio: currentAccount.data.bio,
        });
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = location.pathname; // Mendapatkan path saat ini
  
    if (!token && path !== "/sign-up") {
      setIsAuthenticated(false);
      navigate("/sign-in");
    } else if (!token && path === "/sign-up") {
      // Tidak ada token dan pengguna berada di halaman sign-up
      // Lakukan sesuatu di sini, seperti membiarkan pengguna mengakses halaman sign-up
      setIsAuthenticated(false);
    } else {
      checkAuthUser();
    }
  }, []);

  const value = {
    user,
    token,
    setUser,
    setToken,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
