"use client";
import { Menu } from "@mantine/core";
import { clearSession } from "@utils/auth";
import { useRouter } from "next/navigation";
import { ActionCircleButton } from "../ActionButton";


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
        <ActionCircleButton variant="menu" ariaLabel="Menu do usuário" />
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
