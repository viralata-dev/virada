"use client";

import type { MantineColorsTuple, MantineTheme } from "@mantine/core";
import { createTheme } from "@mantine/core";

const primary: MantineColorsTuple = [
  "#f4f1f8",
  "#e3e0eb",
  "#c6bdd8",
  "#a798c5",
  "#8d79b5",
  "#7c65ac",
  "#745ba8",
  "#634b93",
  "#584284",
  "#231a36",
];

export const theme = createTheme({
  colors: {
    primary,
  },
  primaryColor: "primary",
  fontFamily: "var(--font-geist-sans)",
  fontFamilyMonospace: "var(--font-geist-mono)",
  components: {
    Button: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.primary[6],
          color: theme.white,
          "&:hover": {
            backgroundColor: theme.colors.primary[7],
          },
        },
      }),
    },
    Pill: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.primary[0],
          color: theme.colors.primary[9],
          borderColor: theme.colors.pink[6],
        },
      }),
    },
    Paper: {
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: theme.colors.primary[0],
          color: theme.colors.primary[9],
          borderColor: theme.colors.pink[6],
        },
      }),
    },
  }
});
