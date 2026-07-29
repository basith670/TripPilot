import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "sonner";

import ReduxProvider from "@/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "TripPilot",
  description: "AI Travel Planning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}