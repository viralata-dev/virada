"use client";

import { useEffect, useState } from "react";
import type { Event } from "../types/event";
import { isEventHappening } from "../utils/event";

export function useEventHappening(event: Event): boolean {
  const [isHappening, setIsHappening] = useState(() =>
    isEventHappening(event.time, event.duration, event.date, new Date())
  );

  useEffect(() => {
    const updateHappeningState = () => {
      setIsHappening(isEventHappening(event.time, event.duration, event.date, new Date()));
    };

    updateHappeningState();
    const intervalId = setInterval(updateHappeningState, 60000);

    return () => clearInterval(intervalId);
  }, [event.date, event.duration, event.time]);

  return isHappening;
}
