import { TripInfo } from "@/app/create-new-trip/_component/chatbox";
import { createContext } from "react";

export type TripContextType = {
    tripDetailInfo: TripInfo | null;
    setTripDetailInfo: (value: TripInfo | null) => void;
}

export const TripDetailContext = createContext<TripContextType | null>(null);

