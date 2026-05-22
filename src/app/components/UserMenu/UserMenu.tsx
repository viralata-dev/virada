"use client";
import { Burger, Menu } from "@mantine/core";
import { clearSession } from "@utils/auth";
import { useRouter } from "next/navigation";

export const UserMenu = () => {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    // Mantine Menu docs: https://mantine.dev/core/menu/#usage
    <Menu>
      <Menu.Target>
        <Burger color="pink" />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        {/* Mantine Menu.Item docs: https://mantine.dev/core/menu/#usage */}
        <Menu.Item color="red" onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
