import type { Metadata } from "next";
import "./globals.css";

import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

import { Toaster } from "sonner";

import ReduxProvider from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <ReduxProvider>
          <ThemeProvider>
            {children}

            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
            />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}