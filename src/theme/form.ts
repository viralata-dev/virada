import type {
  MantineTheme,
  MultiSelectFactory,
  MultiSelectProps,
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

  styles: (theme: MantineTheme) =>
    ({
      input: {
        backgroundColor: "rgba(0, 0, 0, 0.22)",
        borderColor: theme.colors.violet[6],
        color: theme.white,
        "--input-color": theme.white,
        "--input-placeholder-color": theme.colors.primary[8],
      },

      dropdown: {
        backgroundColor: "rgba(12, 8, 24, 0.98)",
        borderColor: theme.colors.violet[6],
      },

      option: {
        color: theme.white,
        backgroundColor: "transparent",
        "&[data-combobox-selected]": {
          backgroundColor: "rgba(124, 101, 172, 0.35)",
          color: theme.white,
        },
        "&[data-combobox-active]": {
          backgroundColor: "rgba(116, 91, 168, 0.25)",
        },
      },

      empty: {
        color: theme.colors.primary[4],
      },
    }) satisfies StylesApiProps<SelectFactory>["styles"],
};

export const MultiSelect = {
  defaultProps: {
    variant: "default",
    size: "md",
    radius: "md",
    w: "100%",
  } satisfies MultiSelectProps,

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
        marginBottom: "4px",
      },

      dropdown: {
        backgroundColor: "rgba(12, 8, 24, 0.98)",
        borderColor: theme.colors.violet[6],
      },

      option: {
        color: theme.white,
        backgroundColor: "transparent",
        "&[dataComboboxSelected]": {
          backgroundColor: "rgba(124, 101, 172, 0.35)",
          color: theme.white,
        },
        "&[dataComboboxActive]": {
          backgroundColor: "rgba(116, 91, 168, 0.25)",
        },
      },

      empty: {
        color: theme.colors.primary[4],
      },

      pill: {
        backgroundColor: "rgba(124, 101, 172, 0.3)",
        border: `1px solid ${theme.colors.violet[5]}`,
        color: theme.white,
      },

      pillsList: {
        gap: "6px",
      },
    }) satisfies StylesApiProps<MultiSelectFactory>["styles"],
};
