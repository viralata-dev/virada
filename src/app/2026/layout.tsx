import { Header } from "@app/components/Header";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
    title: "Programação Virada 2026",
    description: "Programação do Virada 2026",
};

export default function Layout26({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
