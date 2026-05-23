import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Programação Virada 2025",
  description: "Programação do Virada 2025",
};

export default function Layout2025({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
