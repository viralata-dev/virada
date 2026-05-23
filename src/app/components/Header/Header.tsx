import { Container, Flex } from "@mantine/core";
import { fullLogo } from "@public/images";
import Image from "next/image";
import { ActionCircleButton } from "../ActionButton";
import { UserMenu } from "../UserMenu";

export const Header = () => {
  return (
    <Container component="header" py="md">
      {/* Mantine Flex docs: https://mantine.dev/core/flex/#usage */}
      <Flex align="center" justify="space-between">
        <Image src={fullLogo} alt="Virada Cultural 2026" width={66} height={39} />
        <Flex align="center" gap="xs">
          <ActionCircleButton variant="favorite" ariaLabel="Favoritos" />
          <UserMenu />
        </Flex>
      </Flex>
    </Container>
  );
};
