import { Box } from "@mantine/core";
import Image from "next/image";

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
                <Image src={require("./Icons/star-filled.svg")} alt="Favoritos" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "favorite-empty") {
        return (
            <Box >
                <Image src={require("./Icons/star-outline.svg")} alt="Favoritos" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "menu") {
        return (
            <Box >
                <Image src={require("./Icons/burger.svg")} alt="Menu" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "location") {
        return (
            <Box >
                <Image src={require("./Icons/map-pin.svg")} alt="Localização" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "filter") {
        return (
            <Box >
                <Image src={require("./Icons/filter.svg")} alt="Filtrar" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "plus") {
        return (
            <Box >
                <Image src={require("./Icons/plus.svg")} alt="Adicionar" width={20} height={20} />
            </Box >
        );
    }

    if (variant === "minus") {
        return (
            <Box >
                <Image src={require("./Icons/minus.svg")} alt="Remover" width={20} height={20} />
            </Box >
        );
    }

    return (
        <Box >
            ⌄
        </Box >
    );
}
