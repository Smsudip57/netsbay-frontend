import axios from "axios";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

 interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

 interface Profile {
  name?: string;
  avatarUrl?: string;
}

 type UserRole = 'user' | 'admin';

 interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  whatsapp: string;
  address: Address;
  organizationName?: string;
  gstNumber?: string;
  role: UserRole;
  createdAt?: Date;
  balance?: number;
  profile?: Profile;
  isActive?: boolean;
}

interface AppContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getuserinfo", {
          withCredentials: true,
        });
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, loading, logout: () => {} }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  // ✅ Fix: Move `useNavigate()` inside the function
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      context.setUser(null);
      toast({
        title: "Logout successful!",
        description: "You have successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed!",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    }
  };

  return { ...context, logout };
};