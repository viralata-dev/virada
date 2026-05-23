import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import type { Viewport } from "next";
import { Geist, Geist_Mono, Nerko_One } from "next/font/google";
import type { ReactNode } from "react";
import { theme } from "../theme";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nerkoOne = Nerko_One({
  variable: "--font-nerko-one",
  style: "normal",
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" style={{
      scrollbarWidth: "thin",
      scrollbarColor: `#6741D9 #231a36`,
      scrollBehavior: "smooth"
    }}>
      <body className={`${geistSans.variable} ${geistMono.variable} ${nerkoOne.variable} bg-main`}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html >
  );
}
