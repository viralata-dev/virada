"use client";

import { EventsGrid } from "@components/EventsGrid";
import { FloatingShareButton } from "@components/FloatingShareButton";
import eventsData from "@data/events2025.json";
import { isLoggedIn } from "@utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page2025() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main>
      <EventsGrid data={eventsData} />
      <FloatingShareButton />
    </main>
  );
}
