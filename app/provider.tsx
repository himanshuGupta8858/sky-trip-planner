"use client"
import { FavoritesProvider } from '@/context/FavoritesContext';
import { TripContextType, TripDetailContext } from '@/context/TripDetailContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import Header from './_components/header';
import { TripInfo } from './create-new-trip/_component/chatbox';
const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const createUser = useMutation(api.user.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>(null);
  const { user } = useUser();

  const CreateNewUser = useCallback(async () => {
    if (user) {
      const result = await createUser({
        name: user.fullName ?? '',
        email: user.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user.imageUrl,
      });
      setUserDetail(result);
    }
  }, [user, createUser]);

  useEffect(() => {
    user && CreateNewUser();
  }, [user, CreateNewUser]);

  const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo | null>(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{ tripDetailInfo, setTripDetailInfo }}>
        <FavoritesProvider>
          <div>
            <Header />
            {children}
          </div>
        </FavoritesProvider>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error('useUserDetail must be used within a UserDetailProvider');
  }
  return context;
};

export const useTripDetail = (): TripContextType => {
  const context = useContext(TripDetailContext);
  if (!context) {
    throw new Error('useTripDetail must be used within a TripDetailProvider');
  }
  return context;
};