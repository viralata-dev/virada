"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "viradaFavoriteEventIds";

export function useFavoriteEvents() {
  const [favoriteEventIds, setFavoriteEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY);
      if (!savedFavorites) {
        return;
      }

      const parsedFavorites = JSON.parse(savedFavorites) as string[];
      setFavoriteEventIds(new Set(parsedFavorites));
    } catch (error) {
      console.error("Error loading favorites state:", error);
    }
  }, []);

  const saveFavorites = useCallback((nextFavoriteIds: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(nextFavoriteIds)));
    } catch (error) {
      console.error("Error saving favorites state:", error);
    }
  }, []);

  const toggleFavorite = useCallback(
    (eventId: string) => {
      setFavoriteEventIds((previousIds) => {
        const nextFavoriteIds = new Set(previousIds);

        if (nextFavoriteIds.has(eventId)) {
          nextFavoriteIds.delete(eventId);
        } else {
          nextFavoriteIds.add(eventId);
        }

        saveFavorites(nextFavoriteIds);
        return nextFavoriteIds;
      });
    },
    [saveFavorites]
  );

  const isFavorite = useCallback(
    (eventId: string) => {
      return favoriteEventIds.has(eventId);
    },
    [favoriteEventIds]
  );

  return {
    favoriteEventIds,
    isFavorite,
    toggleFavorite,
  };
}
