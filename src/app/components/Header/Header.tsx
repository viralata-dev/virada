"use client";

import { Container, Flex } from "@mantine/core";
import { fullLogo } from "@public/images";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ActionCircleButton } from "../ActionButton";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isFavoritesPage = pathname === "/2026/favorites";
  const actionVariant = isFavoritesPage ? "back" : "favorite-empty";
  const actionAriaLabel = isFavoritesPage ? "Voltar para programação" : "Favoritos";
  const handleActionClick = () => {
    if (isFavoritesPage) {
      router.push("/2026");
      return;
    }

    router.push("/2026/favorites");
  };

  return (
    <Container component="header" py="md">
      {/* Mantine Flex docs: https://mantine.dev/core/flex/#usage */}
      <Flex align="center" justify="space-between">
        <Image src={fullLogo} alt="Virada Cultural 2026" width={66} height={39} />
        <Flex align="center" gap="xs">
          <ActionCircleButton
            variant={actionVariant}
            ariaLabel={actionAriaLabel}
            onClick={handleActionClick}
          />
          {/* <UserMenu /> */}
        </Flex>
      </Flex>
    </Container>
  );
};
