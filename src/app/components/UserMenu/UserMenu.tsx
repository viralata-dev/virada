"use client";
import { Burger, Menu } from "@mantine/core";

export const UserMenu = () => {
  return (
    <Menu>
      <Menu.Target>
        <Burger color="pink" />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
