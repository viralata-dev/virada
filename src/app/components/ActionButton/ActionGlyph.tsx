import { Box } from "@mantine/core";
import Image from "next/image";
import { BurgerIcon, FilterIcon, MapPinIcon, MinusIcon, PlusIcon, StarFilledIcon, StarOutlineIcon } from "./Icons";

export type ActionVariant =
    | "favorite"
    | "favorite-empty"
    | "filter"
    | "menu"
    | "location"
    | "plus"
    | "minus"
    | "default";


export function ActionGlyph({ variant }: { variant: ActionVariant }) {
    if (variant === "favorite") {
        return (
            <Box >
                <Image src={StarFilledIcon} alt="Favoritos" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "favorite-empty") {
        return (
            <Box >
                <Image src={StarOutlineIcon} alt="Favoritos" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "menu") {
        return (
            <Box >
                <Image src={BurgerIcon} alt="Menu" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "location") {
        return (
            <Box >
                <Image src={MapPinIcon} alt="Localização" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "filter") {
        return (
            <Box >
                <Image src={FilterIcon} alt="Filtrar" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "plus") {
        return (
            <Box >
                <Image src={PlusIcon} alt="Adicionar" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "minus") {
        return (
            <Box >
                <Image src={MinusIcon} alt="Remover" width={20} height={20} />
            </Box >
        );
    }

    return (
        <Box >
            ⌄
        </Box >
    );
}
