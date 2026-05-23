import { TextInput, type TextInputProps } from "@mantine/core";
import { FormField } from "./FormField";

type InputProps = Omit<TextInputProps, "name"> & {
  name: string;
};

export function Input({ name, ...props }: InputProps) {
  // Mantine TextInput usage: https://mantine.dev/core/text-input/#usage
  return <FormField component={TextInput} name={name} {...props} aria-label="name" />;
}
