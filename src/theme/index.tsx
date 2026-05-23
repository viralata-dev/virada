"use client";

import { createTheme } from "@mantine/core";
import { Button } from "./button";
import { colors, defaultGradient, primaryColor } from "./colors";
import { Input, MultiSelect, PasswordInput } from "./form";
import { Title, typography } from "./typography";

export const theme = createTheme({
  colors,
  primaryColor,
  defaultGradient,
  ...typography,
  components: {
    TextInput: Input,
    PasswordInput,
    MultiSelect,
    Title,
    Button,
  },
});
