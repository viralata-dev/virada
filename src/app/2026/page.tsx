"use client";

import { Container } from "@mantine/core";
import { isLoggedIn } from "@utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DataGrid } from "~/app/components/DataGrid";

export default function Page2026() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    // Mantine Container docs: https://mantine.dev/core/container/#usage
    <Container
      component="main"
      py="md"
      px="xs"
      fs="xs"
      h="100%"
      style={{ overflowY: "auto"}}
      pos="relative"
    >
      <DataGrid />
    </Container>
  );
}
