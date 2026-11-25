"use client";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { TripContextType, TripDetailContext } from "@/context/TripDetailContext";
import { UserDetailContext, type UserDetailContextValue } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import type { TripInfo, UserDetail } from "@/types/trip";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useCallback, useContext, useEffect, useState } from "react";

import Header from "./_components/header";

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const createUser = useMutation(api.user.CreateNewUser);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const { user } = useUser();

  const handleCreateUser = useCallback(async () => {
    if (user) {
      const result = await createUser({
        name: user.fullName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user.imageUrl,
      });
      setUserDetail(result as UserDetail);
    }
  }, [user, createUser]);

  useEffect(() => {
    if (user) {
      void handleCreateUser();
    }
  }, [user, handleCreateUser]);

  const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo | null>(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{ tripDetailInfo, setTripDetailInfo }}>
        <FavoritesProvider>
          <div>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
            >
              Skip to main content
            </a>
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </div>
        </FavoritesProvider>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  );
};

export default Provider;

export const useUserDetail = (): UserDetailContextValue => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error("useUserDetail must be used within a UserDetailProvider");
  }
  return context;
};

export const useTripDetail = (): TripContextType => {
  const context = useContext(TripDetailContext);
  if (!context) {
    throw new Error("useTripDetail must be used within a TripDetailProvider");
  }
  return context;
};
