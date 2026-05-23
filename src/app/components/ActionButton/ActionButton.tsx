import { ActionIcon } from "@mantine/core";
import { ActionGlyph, type ActionVariant } from "./ActionGlyph";


interface ActionButtonProps {
  variant: ActionVariant;
  size?: 32 | 35;
  onClick?: () => void;
  ariaLabel: string;
}


export function ActionCircleButton({
  variant,
  onClick,
  ariaLabel,
}: ActionButtonProps) {
  return (
    // Mantine ActionIcon docs: https://mantine.dev/core/action-icon/#usage
    <ActionIcon variant="outline" color="violet" size="xl" radius="xl" onClick={onClick} aria-label={ariaLabel}>
      <ActionGlyph variant={variant} />
    </ActionIcon>
  );
}
export function ActionSimpleButton({
  variant,
  onClick,
  ariaLabel,
}: ActionButtonProps) {
  return (
    <ActionIcon variant="light" onClick={onClick} aria-label={ariaLabel}>
      <ActionGlyph variant={variant} />
    </ActionIcon>);
}