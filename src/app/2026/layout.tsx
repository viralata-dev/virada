import { Header } from "@app/components/Header";
import { Box } from "@mantine/core";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EVENTS_2026_TOKENS } from "../components/Events2026";
import "../globals.css";

export const metadata: Metadata = {
  title: "Programação Virada 2026",
  description: "Programação do Virada 2026",
};

export default function Layout26({ children }: { children: ReactNode }) {
  return (
    // Mantine Box docs: https://mantine.dev/core/box/#usage
    <Box bg={EVENTS_2026_TOKENS.colors.bgDark} mih="100dvh">
      <Header />
      {children}
    </Box>
  );
}
