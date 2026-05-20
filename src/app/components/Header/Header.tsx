import { Container, Flex } from "@mantine/core";
import Image from "next/image";
import { UserMenu } from "../UserMenu";

export const Header = () => {
  return (
    <Container component="header" py="md">
      <Flex align="center" justify="space-between">
        <Image src="/full-logo.svg" alt="Virada Cultural 2026" width={66} height={39} />
        <UserMenu />
      </Flex>
    </Container>
  );
};
