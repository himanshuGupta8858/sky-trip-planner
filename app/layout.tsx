import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyTrip — AI-Powered Personalized Travel Planner & Trip Companion",
  description:
    "Plan end-to-end travel itineraries with multi-model Generative AI, interactive Google Maps route plotting, live currency conversion, timezone intelligence, and accessible printable travel guides.",
  keywords: [
    "AI trip planner",
    "travel itinerary generator",
    "route optimization",
    "accessible travel",
    "SkyTrip",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <ConvexClientProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
