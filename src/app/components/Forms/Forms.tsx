import { Box, Button, Stack, type StackProps } from "@mantine/core";
import { type UseFormReturnType, useForm } from "@mantine/form";
import { createContext, type ReactNode, useContext } from "react";

type FormValues = Record<string, unknown>;
type AppForm = UseFormReturnType<FormValues>;

const FormsContext = createContext<AppForm | null>(null);

type MultiFormProps = {
  children: ReactNode | ((form: AppForm) => ReactNode);
  initialValues: FormValues;
  onSubmit: (values: FormValues) => void;
  onSubmitInvalid?: (errors: Record<string, ReactNode>) => void;
  mode?: "controlled" | "uncontrolled";
  withSubmitButton?: boolean;
  submitLabel?: string;
  stackProps?: Omit<StackProps, "children">;
};

export function MultiForm({
  children,
  initialValues,
  onSubmit,
  onSubmitInvalid,
  mode = "uncontrolled",
  withSubmitButton = false,
  submitLabel = "Submit",
  stackProps,
}: MultiFormProps) {
  const form = useForm<FormValues>({
    mode,
    initialValues,
  });

  const renderedChildren = typeof children === "function" ? children(form) : children;

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit, onSubmitInvalid)} h="100%" w="100%">
      <FormsContext.Provider value={form}>
        <Stack align="center" justify="center" {...stackProps}>
          {renderedChildren}
          {withSubmitButton && <Button type="submit">{submitLabel}</Button>}
        </Stack>
      </FormsContext.Provider>
    </Box>
  );
}

export function useFormsContext() {
  const context = useContext(FormsContext);

  if (!context) {
    throw new Error("Form fields must be rendered inside <MultiForm />.");
  }

  return context;
}
