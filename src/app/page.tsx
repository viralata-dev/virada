"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getStoredCredentials, isLoggedIn } from "../utils/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/2026");
    } else if (getStoredCredentials()) {
      router.replace("/login");
    } else {
      router.replace("/register");
    }
  }, [router]);

  return null;
}
