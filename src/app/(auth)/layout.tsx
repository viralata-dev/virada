import { Container } from "@mantine/core";
import Image from "next/image";
import type { ReactNode } from "react";
import { bgGraph, fullLogo } from "../../../public/images";



export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Container component="main" py="md" fs="xs" ta="center" bg={`url(${bgGraph.src}) no-repeat center/cover`} h="100dvh">
            <Image
                src={fullLogo}
                alt="Minha Virada Cultural"
                width={247}
                height={143}
                priority
            />
            {children}
        </Container>
    );
}
