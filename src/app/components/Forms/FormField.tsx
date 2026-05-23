import type { ComponentPropsWithoutRef, ElementType } from "react";
import { useFormsContext } from "./Forms";

type FormFieldProps<TComponent extends ElementType> = {
  component: TComponent;
  name: string;
  fieldType?: "input" | "checkbox";
} & Omit<
  ComponentPropsWithoutRef<TComponent>,
  "name" | "value" | "defaultValue" | "checked" | "onChange" | "onBlur" | "error"
>;

export function FormField<TComponent extends ElementType>({
  component,
  name,
  fieldType = "input",
  ...rest
}: FormFieldProps<TComponent>) {
  const form = useFormsContext();
  const Component = component as ElementType;

  const inputProps =
    fieldType === "checkbox"
      ? form.getInputProps(name, { type: "checkbox" })
      : form.getInputProps(name);

  return <Component key={form.key(name)} {...rest} {...inputProps} />;
}
