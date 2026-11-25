import type { UserDetail } from "@/types/trip";
import { createContext, type Dispatch, type SetStateAction } from "react";

export interface UserDetailContextValue {
  userDetail: UserDetail | null;
  setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}

export const UserDetailContext = createContext<UserDetailContextValue | null>(null);
