import { Container, Stack } from "@mantine/core";
import Image from "next/image";
import type { ReactNode } from "react";
import { bgGraph, fullLogo } from "../../../public/images";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Container component="main" bg={`url(${bgGraph.src}) no-repeat center/cover`} h="100dvh">
      <Stack align="center" h="100%" gap="32">
        <Image src={fullLogo} alt="Minha Virada Cultural" width={247} height={143} priority />
        {children}
      </Stack>
    </Container>
  );
}
