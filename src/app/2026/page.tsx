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
    <Container component="main" py="md" fs="xs">
      <DataGrid />
    </Container>
  );
}
