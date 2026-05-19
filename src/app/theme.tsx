import type { MantineColorsTuple } from '@mantine/core';
import { createTheme } from '@mantine/core';

const myColor: MantineColorsTuple = [
    '#f4f1f8',
    '#e3e0eb',
    '#c6bdd8',
    '#a798c5',
    '#8d79b5',
    '#7c65ac',
    '#745ba8',
    '#634b93',
    '#584284',
    '#231a36'
];

export const theme = createTheme({
    colors: {
        myColor,
    },
    primaryColor: 'myColor',
    fontFamily: "var(--font-geist-sans)",
    fontFamilyMonospace: "var(--font-geist-mono)"
});