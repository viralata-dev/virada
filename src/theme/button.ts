import type { ButtonProps, MantineTheme, MantineThemeComponent } from "@mantine/core";

export const Button: MantineThemeComponent = {
  defaultProps: (theme: MantineTheme) =>
    ({
      size: "md",
      bg: `linear-gradient(135deg, ${theme.defaultGradient.from} 0%, ${theme.defaultGradient.to} 100%)`,
      color: theme.colors.primary[0],
      variant: "gradient",
      gradient: {
        from: theme.defaultGradient.from,
        to: theme.defaultGradient.to,
        deg: theme.defaultGradient.deg,
      },
      fullWidth: true,
      bdrs: "md",

      styles: {
        root: {
          boxShadow:
            "6px 6px 4px 0 rgba(255, 255, 255, 0.25) inset, -6px -6px 8px 0 rgba(0, 0, 0, 0.20) inset",
          fontWeight: 500,
        },
      },
    }) satisfies ButtonProps,
};
/*
border-radius: 8px;
background: linear-gradient(91deg, #4C35C2 0.34%, #963CB6 105.96%);


*/
