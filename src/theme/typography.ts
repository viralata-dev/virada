import type { MantineTheme } from "@mantine/core";

export const typography = {
  fontFamily: "var(--font-geist-sans)",
  fontFamilyMonospace: "var(--font-geist-mono)",
  headings: {
    sizes: {
      h1: { fontSize: "54px", lineHeight: "1.2", fontWeight: "400" },
      h2: { fontSize: "36px", lineHeight: "1.3", fontWeight: "400" },
      h3: { fontSize: "28px", lineHeight: "1.4", fontWeight: "400" },
      h4: { fontSize: "24px", lineHeight: "1.5", fontWeight: "400" },
      h5: { fontSize: "20px", lineHeight: "1.6", fontWeight: "400" },
      h6: { fontSize: "16px", lineHeight: "1.7", fontWeight: "400" },
    },
  },
};

// COMPONENTS ---------------------------------------

export const Title = {
  styles: (theme: MantineTheme) => ({
    root: {
      fontFamily: "var(--font-nerko-one)",
      textTransform: "uppercase",
      color: theme.colors.primary[0],
    },
  }),
};
