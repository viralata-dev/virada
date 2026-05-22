import type {
  MantineTheme,
  PasswordInputFactory,
  SelectFactory,
  SelectProps,
  StylesApiProps,
  TextInputFactory,
  TextInputProps,
} from "@mantine/core";

export const Input = {
  defaultProps: {
    variant: "default",
    size: "md",
    radius: "md",
    w: "100%",
  } satisfies TextInputProps,

  styles: (theme: MantineTheme) =>
    ({
      input: {
        backgroundColor: "rgba(0, 0, 0, 0.22)",
        borderColor: theme.colors.violet[6],
        color: theme.white,
        "--input-color": theme.white,
        "--input-placeholder-color": theme.colors.primary[8],
      },

      label: {
        fontWeight: 400,
        marginBottom: `4px`,
      },
    }) satisfies StylesApiProps<TextInputFactory>["styles"],
};

export const PasswordInput = {
  ...Input,
  // defaultProps: {} satisfies PasswordInputProps,
  styles: (theme: MantineTheme) =>
    ({
      ...Input.styles(theme),
      innerInput: {
        color: theme.white,
        "&:focus::placeholder": {
          opacity: 0,
        },
      },
      visibilityToggle: {
        color: theme.colors.violet[4],
        padding: "4px",
      },
    }) satisfies StylesApiProps<PasswordInputFactory>["styles"],
};

export const Select = {
  defaultProps: {
    variant: "default",
    size: "md",
    radius: "md",
    w: "100%",
  } satisfies SelectProps,

  styles: (theme: MantineTheme) => ({

    root: {
      backgroundColor: "rgba(0, 0, 0, 0.22)",
      borderColor: theme.colors.violet[6],
      color: theme.white,
      "--input-color": theme.white,
      "--input-placeholder-color": theme.colors.primary[8],
    }

  }) satisfies StylesApiProps<SelectFactory>["styles"],
} 