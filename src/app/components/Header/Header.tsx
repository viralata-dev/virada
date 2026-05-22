import { Container, Flex } from "@mantine/core";
import { fullLogo } from "@public/images";
import Image from "next/image";
import { UserMenu } from "../UserMenu";

export const Header = () => {
  return (
    <Container component="header" py="md">
      <Flex align="center" justify="space-between">
        <Image src={fullLogo} alt="Virada Cultural 2026" width={66} height={39} />
        <UserMenu />
      </Flex>
    </Container>
  );
};
