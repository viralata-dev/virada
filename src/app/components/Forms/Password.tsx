import {
  PasswordInput as MantinePasswordInput,
  type PasswordInputProps as MantinePasswordInputProps,
} from "@mantine/core";
import { FormField } from "./FormField";

type PasswordInputProps = Omit<MantinePasswordInputProps, "name"> & {
  name: string;
};

export function PasswordInput({ name, ...props }: PasswordInputProps) {
  // Mantine PasswordInput usage: https://mantine.dev/core/password-input/#usage
  return <FormField component={MantinePasswordInput} name={name} {...props} />;
}
