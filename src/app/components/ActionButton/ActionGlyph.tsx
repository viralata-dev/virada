import { Box } from "@mantine/core";
import Image from "next/image";
import {
  ArrowLeftIcon,
  BurgerIcon,
  CheckIcon,
  CloseIcon,
  FilterIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from "./Icons";

export type ActionVariant =
  | "back"
  | "favorite"
  | "favorite-empty"
  | "close"
  | "expand"
  | "filter"
  | "menu"
  | "location"
  | "plus"
  | "minus"
  | "check"
  | "default";

export function ActionGlyph({ variant }: { variant: ActionVariant }) {
  if (variant === "back") {
    return (
      <Box>
        <Image src={ArrowLeftIcon} alt="Voltar" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "favorite") {
    return (
      <Box>
        <Image src={StarFilledIcon} alt="Favoritos" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "favorite-empty") {
    return (
      <Box>
        <Image src={StarOutlineIcon} alt="Favoritos" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "menu") {
    return (
      <Box>
        <Image src={BurgerIcon} alt="Menu" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "location") {
    return (
      <Box>
        <Image src={MapPinIcon} alt="Localização" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "filter") {
    return (
      <Box>
        <Image src={FilterIcon} alt="Filtrar" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "plus") {
    return (
      <Box>
        <Image src={PlusIcon} alt="Adicionar" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "minus") {
    return (
      <Box>
        <Image src={MinusIcon} alt="Remover" width={20} height={20} />
      </Box>
    );
  }

  if (variant === "expand") {
    return <Box>⌄</Box>;
  }

  if (variant === "close") {
    return (
      <Box>
        <Image src={CloseIcon} alt="Fechar" width={20} height={20} />
      </Box>
    );
  }
  if (variant === "check") {
    return (
      <Box>
        <Image src={CheckIcon} alt="Aceitar" width={20} height={20} />
      </Box>
    );
  }

  return <Box>⌄</Box>;
}
